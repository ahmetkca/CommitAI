
import React, {type FC, useCallback} from 'react';
import {Box, Text, useInput} from 'ink';

const ConfirmInput: FC<{
	confirmationMessage: string;
	isChecked: boolean;
	onSubmit: (value: boolean) => void;
}> = ({confirmationMessage, onSubmit, isChecked}) => {
	const [selectAnswer, setSelectAnswer] = React.useState(isChecked);

	useInput(
		useCallback(
			(_input, key) => {
				if (key.return) {
					onSubmit(selectAnswer);
				}

				if (key.tab || key.rightArrow || key.leftArrow) {
					setSelectAnswer(previous => !previous);
				}
			}, [selectAnswer, isChecked, confirmationMessage]),
		{isActive: true},
	);

	return (
		<Box flexDirection='row'>
			<Text>{confirmationMessage}</Text>

			<Box flexDirection='row' marginLeft={0.5}>
				{selectAnswer ? (
					<>
						<Text color='green'>[Y]es</Text><Text>/</Text><Text color='red'>no</Text>
					</>
				) : (
					<>
						<Text color='green'>yes</Text><Text>/</Text><Text color='red'>[N]o</Text>
					</>
				)}
			</Box>
		</Box>
	);
};

export default ConfirmInput;
