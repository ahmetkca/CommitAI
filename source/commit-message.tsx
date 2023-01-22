import { Box, Text } from "ink";
import React, { FC } from "react";

const CommitMessage: FC<{
    message: string; 
    index: number; 
    isSelected: boolean
}> = ({
    message, 
    isSelected, 
    index
}) => (
	<Box flexDirection='row'>
		<Text color={'cyanBright'}>{isSelected ? '▶' : '  '}</Text><Text>{` ${index + 1}. `}</Text>
		<Text
			bold={isSelected}
			underline={isSelected}
			color={isSelected ? 'green' : 'white'}
		>
			{message}
		</Text>
	</Box>
);

export default CommitMessage;