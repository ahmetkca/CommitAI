import React, {type FC, useEffect, useState} from 'react';
import {Configuration, OpenAIApi} from 'openai';
import {Box, Text, useApp, Spacer, Static} from 'ink';
import Spinner from 'ink-spinner';
import TextInput from 'ink-text-input';
import CommitMessages from './commit-messages';


import ConfirmInput from './confirm-input';
import chalk from 'chalk';
import { ICommitMessage } from './openai';

type CommitUIProps = {
	edit: boolean;
	confirmation: boolean;
	numberOfCommitMessages: number;
    isInGitRepository: () => Promise<boolean>;
    getGitDiffOutput: () => Promise<string>;
    execGitCommit: (commitMessage: ICommitMessage) => Promise<string>;
    generateCommitMessages: (options: any) => Promise<ICommitMessage[]>;
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
		commitMessage?: ICommitMessage;
		showConfirm: boolean;
	}>({yesOrNo: true, showConfirm: false});

	const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

	const [commitMessage, setCommitMessage] = useState<ICommitMessage>();

	const [commitMessages, setCommitMessages] = useState<ICommitMessage[]>([]);

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
		setCommitMessage(undefined);
		setErrorMessage(undefined);
		setCommitMessages([]);

		(async () => {
			setIsLoading(true);
			await _generateCommitMessages();
			setIsLoading(false);
		})();
	};

	const handleSelectedCommitMessage = (cMessage?: ICommitMessage
		) => {
		if (cMessage) {
			if (!edit && confirmation) {
				setConfirmCommit(
					previousConfirmCommit => ({
						...previousConfirmCommit,
						commitMessage: cMessage,
						showConfirm: true,
					}));
			} else if (!edit && !confirmation) {
				(async () => {
					const returnValue = await execGitCommit(cMessage);
					setCommitMessages([]);
					setCommitMessage(undefined);
					console.log(returnValue);
					app.exit();
				})();
			} else {
				setCommitMessage(cMessage);
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
					<Text color='greenBright'>
						<Spinner type='dots'/>
					</Text>
					<Text> 🤖 Generating commit messages...</Text>
				</Text>
			</Box>
		);
	}

	if (confirmation && confirmCommit.showConfirm && confirmCommit.commitMessage) {
		return (
			<Box flexDirection='column'>
				<Box flexDirection='row'>
					<Text>git commit -m &quot;</Text>
					<Text inverse>{confirmCommit.commitMessage.subject}</Text>
					<Text>&quot;</Text>
				</Box>
				<ConfirmInput
					confirmationMessage='Do you confirm this commit message?'
					isChecked={confirmCommit.yesOrNo}
					onSubmit={(isConfirmed) => {
						if (isConfirmed) {
							(async () => {
								if (!confirmCommit.commitMessage || 
									!confirmCommit.commitMessage.subject ||
									!confirmCommit.commitMessage.body) {
									console.error(chalk.redBright('No commit message'));
									return;
								}
								const returnValue = await execGitCommit({
									...confirmCommit.commitMessage,
								});
								setCommitMessage(undefined);
								setConfirmCommit(previousConfirmCommit => ({
									...previousConfirmCommit,
									showConfirm: false,
								}));
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

	if (edit && commitMessage && commitMessage.subject.length > 0) {
		return (
			<Box flexDirection='row'>
				<Text>git commit -m "</Text>
				<Text underline>
					<TextInput
						showCursor
						focus
						value={commitMessage.subject}
						placeholder='Enter your commit message here'
						onChange={(val) => {
							setCommitMessage(previousCommitMessage => {
								if (previousCommitMessage) {
									return {
										...previousCommitMessage,
										subject: val,
									}
								}
								return previousCommitMessage;
							});
						}}
						onSubmit={value => {
							if (confirmation && commitMessage) {
								setConfirmCommit(previousConfirmCommit => ({
									...previousConfirmCommit,
									commitMessage: {
										...commitMessage,
										subject: value,
									},
									showConfirm: true,
								}));
							} else {
								(async () => {
									if (!value) {
										console.error(chalk.red('No commit message provided'));
										return;
									}

									const returnValue = await execGitCommit({
										...commitMessage,
										subject: value,
									});
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
			<Box>
				<Static
					items={[
						{
							key: 'Ctrl + r',
							prefix: 'Press',
							suffix: 'to refresh',
						}
					]}
				>
					{({prefix, suffix, key}) => (
						<Text key={key}>
							<Text underline italic color={'grey'}>
								{prefix}
							</Text>
							<Text color={'grey'} bold>{` ${key} `}</Text>
							<Text underline italic color={'grey'}>
								{suffix}
							</Text>
						</Text>
					)}
				</Static>
				<Box flexDirection='column'>
					
					<CommitMessages
						messages={commitMessages}
						onSelected={handleSelectedCommitMessage}
						onRefresh={handleRefresh}/>
				</Box>
			</Box>
		);
	}

	return <></>;

};

module.exports = CommitUI;
export default CommitUI;
