import React, {FC, useCallback, useEffect, useState} from 'react';
import {Box, Spacer, Text, useInput} from 'ink';
import CommitMessage from './commit-message';
import { ICommitMessage } from './openai';


const CommitMessages: FC<{
	messages: ICommitMessage[];
	onChange?: (messages: ICommitMessage[], index: number) => void;
	onSelected?: (message?: ICommitMessage) => void;
	onRefresh?: () => void;
}> = ({messages, onChange, onSelected, onRefresh}) => {
	const [selectedMessageIndex, setSelectedMessageIndex] = useState(0);

	useInput(
		useCallback(
			(input, key) => {
				if (key.ctrl && input === 'r') {
					onRefresh?.();
					return;
				}

				if (key.return) {
					onSelected?.(messages[selectedMessageIndex]);
				}

				if (key.shift && key.tab) {
					setSelectedMessageIndex(index => {
						if (index === 0) {
							return messages.length - 1;
						}

						return index - 1;
					});
				} else if (key.tab) {
					setSelectedMessageIndex(index => {
						if (index === messages.length - 1) {
							return 0;
						}

						return index + 1;
					});
				}

				if (key.upArrow) {
					setSelectedMessageIndex(index => {
						if (index === 0) {
							return messages.length - 1;
						}

						return index - 1;
					});
				}

				if (key.downArrow) {
					setSelectedMessageIndex(index => {
						if (index === messages.length - 1) {
						    return 0;
						}

						return index + 1;
					});
				}
			}, [messages, selectedMessageIndex],
		), {isActive: true});

	useEffect(() => {
		onChange?.(messages, selectedMessageIndex);
	}, [messages, selectedMessageIndex]);

	return (
		<Box minHeight={'40%'} flexDirection='row' alignItems='flex-start' justifyContent='flex-start'>

			<Box flexDirection='column' minWidth={24} marginRight={1} justifyContent='flex-start'>
				{messages.map((message, index) => (
					<Text wrap="truncate-end" key={index + (Math.random() * message.subject.length) + (message.subject.at(0) ?? '')}>
							<CommitMessage
								
								commitMessage={message}
								index={index}
								isSelected={index === selectedMessageIndex}
							/>
					</Text>
				))}
			</Box>
			<Box flexDirection='column' minWidth={24} marginRight={1} justifyContent='flex-start'>
				{messages.filter((_, index) => index === selectedMessageIndex).map((message,index) => {
					return (
						<Box key={`${index}-with-body`} flexDirection='column'>
							<Text bold underline dimColor>Subject:</Text>
							<Text wrap='wrap'>{message.subject}</Text>
							<Text bold underline dimColor>Body:</Text>
							<Text wrap='wrap'>{message.body}</Text>
						</Box>
					);
				})}
			</Box>
		</Box>
	);
};


export default CommitMessages;