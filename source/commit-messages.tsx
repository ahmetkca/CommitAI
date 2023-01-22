import React, {FC, useCallback, useEffect, useState} from 'react';
import {Box, useInput} from 'ink';
import CommitMessage from './commit-message';


const CommitMessages: FC<{
	messages: string[];
	onChange?: (messages: string[], index: number) => void;
	onSelected?: (message?: string) => void;
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
		<Box flexDirection='column'>
			{messages.map((message, index) => (
				<Box key={index + (Math.random() * message.length) + (message.at(0) ?? '')}>
					<CommitMessage
						message={message}
						index={index}
						isSelected={index === selectedMessageIndex}
					/>
				</Box>
			))}
		</Box>
	);
};


export default CommitMessages;