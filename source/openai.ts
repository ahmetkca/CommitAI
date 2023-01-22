import chalk from 'chalk';
import {type OpenAIApi, Configuration as _1} from 'openai';

import { promtps } from './prompts';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generateRandTemp = () => Math.random() * 0.4 + 0.5;
generateRandTemp();

function randomIntFromInterval(min: number, max: number) { // min and max included 
	return Math.floor(Math.random() * (max - min + 1) + min)
}


// The commit messages should be in the imperative mood, and should be in the form of a single line.
// The commit message should provide enough context for the reader to understand the changes. Describe why a change is being made. Do not simply describe the change. For example, if you are fixing a bug, the commit message should explain what the bug was, and how you fixed it. If you are adding a new feature, the commit message should explain what the feature is, and why it is being added.
// How does it address the issue? What is the motivation for the change? What is the rationale behind the implementation? What alternatives did you consider? What effects does the patch have? Why is this the best implementation? The commit message should not exceed 50 characters. 


// Summarize the changes made in the given \`git diff\` output in a clear and concise commit message that accurately reflects the modifications made to the code-base. Use best practices for writing commit messages, and be sure to follow the conventional commit format.


interface ICommitMessage {
	id: number;
	subject: string;
	body: string;
}

const generateCommitMessages = async ({
	openai,
	diff,
	numCommitMessages,
	model = 'text-davinci-003',
	max_tokens = 1024,
	maxRetries = 3,
	retryDelay = 500,
}: {
	openai: OpenAIApi;
	diff: string;
	numCommitMessages: number;
	model?: string;
	max_tokens?: number;
	maxRetries?: number;
	retryDelay?: number;
}) => {

	if (diff.length === 0) {
		throw new Error('No diff provided');
	}

	const selectedPrompt =  promtps[randomIntFromInterval(0, promtps.length - 2)];//promtps[3];// 
	console.log(chalk.blue(`Selected prompt: ${selectedPrompt?.id}`));

	const prompt = selectedPrompt?.prompt({
		diff,
		numCommitMessages,
	});


	for (let currentRetry = maxRetries; currentRetry > 0; currentRetry--) {
		const response = await openai.createCompletion({
			model,
			prompt,
			max_tokens,
			temperature: 0.25,
		});

		console.log(response.data.choices[0]?.text);

		if (response.data.choices.length === 0 || !response.data.choices[0]?.text) {
			console.log(chalk`(${maxRetries - currentRetry + 1}/${maxRetries}) {red Attempting to generate commit messages again...}`);
			await sleep(retryDelay);
			continue;
		}

		try {
			const commitMessagesJson: {commit_messages: ICommitMessage[]} = JSON.parse(response.data.choices[0].text);
			return commitMessagesJson.commit_messages;
		} catch (e) {
			console.log(chalk`(${maxRetries - currentRetry + 1}/${maxRetries}) {red Attempting to generate commit messages again...}`);
			await sleep(retryDelay);
		}
	}

	throw new Error('Failed to generate commit messages');
};


export {
	generateCommitMessages,
	ICommitMessage,
};
