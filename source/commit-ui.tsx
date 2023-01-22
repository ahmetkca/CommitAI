import React, {type FC, useEffect, useState} from 'react';
import {Configuration, OpenAIApi} from 'openai';
import {Box, Text, useApp, Spacer} from 'ink';
import Spinner from 'ink-spinner';
import TextInput from 'ink-text-input';
import CommitMessages from './commit-messages';


import ConfirmInput from './confirm-input';
import chalk from 'chalk';

type CommitUIProps = {
	edit: boolean;
	confirmation: boolean;
	numberOfCommitMessages: number;
    isInGitRepository: () => Promise<boolean>;
    getGitDiffOutput: () => Promise<string>;
    execGitCommit: (commitMessage: string) => Promise<string>;
    generateCommitMessages: (options: any) => Promise<string[]>;
};

const CommitUI: FC<CommitUIProps> = ({
	edit,
	confirmation,
	numberOfCommitMessages,
    isInGitRepository,
    getGitDiffOutput,
    execGitCommit,
    generateCommitMessages,
}) => {

	const app = useApp();

	if (numberOfCommitMessages < 1 || numberOfCommitMessages > 5) {
		return <Text color='red'>Only 1 to 5 commit messages are allowed</Text>;
	}

	const [confirmCommit, setConfirmCommit] = useState<{
		yesOrNo: boolean;
		commitMessage?: string;
		showConfirm: boolean;
	}>({yesOrNo: true, showConfirm: false});

	const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

	const [commitMessage, setCommitMessage] = useState<string | undefined>('');

	const [commitMessages, setCommitMessages] = useState<string[]>([]);

	const [isLoading, setIsLoading] = useState(false);

	const configuration = new Configuration({
		apiKey: process.env['OPENAI_API_KEY'],
	});

	if (!configuration.apiKey) {
		return <Text color='red'>Missing OPENAI_API_KEY environment variable</Text>;
	}

	const openai = new OpenAIApi(configuration);

	const _generateCommitMessages: () => Promise<boolean> = async () => {
		const inGitRepository = await isInGitRepository();
		if (!inGitRepository) {
			setErrorMessage('Not in a git repository');
			return false;
		}

		const diff = await getGitDiffOutput();
		try {
			const commitMessages = await generateCommitMessages({
				openai,
				diff,
				numCommitMessages: numberOfCommitMessages,
			});
			setCommitMessages(commitMessages);
		} catch (error) {
			if (error instanceof Error) {
				setErrorMessage(error.message);
			}

			return false;
		}

		return true;
	};

	useEffect(() => {
		let cancel = false;
		(async () => {
			if (cancel) {
				return;
			}

			setIsLoading(true);
			if (!await _generateCommitMessages()) {
				app.exit(new Error('Failed to generate commit messages'));
			}

			setIsLoading(false);
		})();

		return () => {
			cancel = true;
		};
	}, []);

	const handleRefresh = () => {
		setCommitMessage('');
		setErrorMessage(undefined);
		setCommitMessages([]);

		(async () => {
			setIsLoading(true);
			await _generateCommitMessages();
			setIsLoading(false);
		})();
	};

	const handleSelectedCommitMessage = (message?: string) => {
		if (message) {
			if (!edit && confirmation) {
				setConfirmCommit(
					previousConfirmCommit => ({
						...previousConfirmCommit,
						commitMessage: message,
						showConfirm: true,
					}));
			} else if (!edit && !confirmation) {
				(async () => {
					const returnValue = await execGitCommit(message);
					setCommitMessages([]);
					setCommitMessage(undefined);
					console.log(returnValue);
					app.exit();
				})();
			} else {
				setCommitMessage(message);
			}
		}
	};

	if (!edit && !confirmation && commitMessage) {
		return (
			<></>
		);
	}


	if (isLoading) {
		return (
			<Box flexDirection='column'>
				<Text color='red'>{errorMessage}</Text>
				<Text>
					<Text color='green'>
						<Spinner type='dots'/>
					</Text>
					<Text> Generating commit messages...</Text>
				</Text>
			</Box>
		);
	}

	if (confirmation && confirmCommit.showConfirm && confirmCommit.commitMessage) {
		return (
			<Box flexDirection='column'>
				<Box flexDirection='row'>
					<Text>git commit -m &quot;</Text>
					<Text inverse>{confirmCommit.commitMessage}</Text>
					<Text>&quot;</Text>
				</Box>
				<ConfirmInput
					confirmationMessage='Do you confirm this commit message?'
					isChecked={confirmCommit.yesOrNo}
					onSubmit={(isConfirmed) => {
						if (isConfirmed) {
							(async () => {
								if (!confirmCommit.commitMessage) {
									console.error(chalk.redBright('No commit message'));
									return;
								}

								const returnValue = await execGitCommit(confirmCommit.commitMessage);
								setConfirmCommit(previousConfirmCommit => ({
									...previousConfirmCommit,
									showConfirm: false,
								}));
								setCommitMessage(undefined);
								setCommitMessages([]);
								console.log(returnValue);
								app.exit();
							})();
						} else {
							setCommitMessage(undefined);
							setConfirmCommit(previousConfirmCommit => ({
								...previousConfirmCommit,
								showConfirm: false,
							}));
							setCommitMessages([]);
							app.exit();
						}
					}}
				/>
			</Box>
		);
	}

	if (edit && commitMessage && commitMessage.length > 0) {
		return (
			<Box flexDirection='row'>
				<Text>git commit -m "</Text>
				<Text underline>
					<TextInput
						showCursor
						focus
						value={commitMessage}
						placeholder='Enter your commit message here'
						onChange={setCommitMessage}
						onSubmit={value => {
							if (confirmation) {
								setConfirmCommit(previousConfirmCommit => ({
									...previousConfirmCommit,
									commitMessage: value,
									showConfirm: true,
								}));
							} else {
								(async () => {
									if (!value) {
										console.error('No commit message');
										return;
									}

									const returnValue = await execGitCommit(value);
									setCommitMessage(undefined);
									setConfirmCommit(previousConfirmCommit => ({
										...previousConfirmCommit,
										showConfirm: false,
									}));
									setCommitMessages([]);
									console.log(returnValue);
									app.exit();
								})();
							}
						}}
					/>
				</Text>
				<Text>"</Text>
			</Box>
		);
	}

	if (commitMessages.length > 0) {
		return (
			<Box flexDirection='column'>
				<CommitMessages
					messages={commitMessages}
					onSelected={handleSelectedCommitMessage}
					onRefresh={handleRefresh}/>
				<Spacer />
				<Box flexDirection='row' marginTop={0.5}>
					<Text>Press Ctrl + r to refresh</Text>
				</Box>
			</Box>
		);
	}

	return <></>;

};

module.exports = CommitUI;
export default CommitUI;
