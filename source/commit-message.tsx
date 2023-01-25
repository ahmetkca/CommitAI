import { Box, Text } from "ink";
import React, { FC } from "react";
import { ICommitMessage } from "./openai";

const CommitMessage: FC<{
    commitMessage: ICommitMessage;
    index: number; 
    isSelected: boolean
}> = ({
    commitMessage: { subject }, 
    isSelected, 
    index
}) => (
	<Text>
		<Text color={'cyanBright'}>{isSelected ? '▶' : ' '}</Text><Text>{` ${index + 1}. `}</Text>
		<Text
			bold={isSelected}
			underline={isSelected}
			color={isSelected ? 'green' : 'white'}
		>
			{subject}
		</Text>
	</Text>
);

export default CommitMessage;