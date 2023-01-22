#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import CommitUI from './commit-ui';
import {execGitCommit, getGitDiffOutput, isInGitRepository} from './git';
import {generateCommitMessages} from './openai';
import chalk from 'chalk';

const cli = meow(chalk`
	{underline Usage}
	    $ commitai <options>

	{underline Options}
		--edit, -e: {grey Edit the commit message before committing}, {green default: true}
        --confirmation, -c: {grey Confirm the commit message before committing}, {green default: true}
        --numberOfCommitMessages, -n: {grey Number of commit messages to choose from}, {green default: 3}

	{underline Examples}
        $ commitai --no-e -n 4
          1. Add ConfirmInput component
		▶ 2.  Update ConfirmInput to handle submit and arrow keys
          3. Refactor ConfirmInput to use React.useState
          4. Add logic to handle onSubmit event and confirm selection with arrow/tab keys

        Press \`Ctrl + r\` to refresh

        --------------------------------

        git commit -m "Update ConfirmInput to handle submit and arrow keys"
        Do you confirm this commit message? [Y]es/no

        --------------------------------

        [master 4b0b2b4] Update ConfirmInput to handle submit and arrow keys
            1 file changed, 1 insertion(+), 1 deletion(-)
`, {
	flags: {
		edit: {
			type: 'boolean',
			default: true,
			alias: 'e',
		},
		confirmation: {
			type: 'boolean',
			default: true,
			alias: 'c',
		},
		numberOfCommitMessages: {
			type: 'number',
			default: 3,
			alias: 'n',
		},
	},
	inferType: true,
	allowUnknownFlags: false,
});

render(<CommitUI
	edit={cli.flags.edit}
	confirmation={cli.flags.confirmation}
	numberOfCommitMessages={cli.flags.numberOfCommitMessages}
    isInGitRepository={isInGitRepository}
    getGitDiffOutput={getGitDiffOutput}
    generateCommitMessages={generateCommitMessages}
    execGitCommit={execGitCommit}
/>);
