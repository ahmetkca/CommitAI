import chalk from 'chalk';
import {type OpenAIApi, Configuration as _1} from 'openai';
import fs from 'node:fs';

import { promtps } from './prompts';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


const cleanGpt3Response = (response: string) => {
	response = response.trim();
	if (response.startsWith('Output:') || response.startsWith('output:')) {
		return response.substring('Output:'.length);
	}
	if (response.startsWith('Response:') || response.startsWith('response:')) {
		return response.substring('Response:'.length);
	}
	return response;
}

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

	const selectedPrompt =  promtps[3];

	const prompt = selectedPrompt?.prompt({
		diff,
		numCommitMessages,
	});


	for (let currentRetry = maxRetries; currentRetry > 0; currentRetry--) {
		const response = await openai.createCompletion({
			model,
			prompt,
			max_tokens,
			temperature: 0.35,
		});

		if (response.data.choices.length === 0 || !response.data.choices[0]?.text) {
			console.log(chalk`(${maxRetries - currentRetry + 1}/${maxRetries}) {red Attempting to generate commit messages again...}`);
			await sleep(retryDelay);
			continue;
		}

		try {
			const gptResponse = cleanGpt3Response(response.data.choices[0].text);
			const commitMessagesJson: {commit_messages: ICommitMessage[]} = JSON.parse(gptResponse);
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
