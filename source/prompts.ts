const promtps = [
    {
        id: '1',
        prompt: ({diff, numCommitMessages}: {diff: string, numCommitMessages: number}) => { return`
Here is the output of the \`git diff\`:
\`\`\`
${diff}
\`\`\`
        
Summarize the changes made in the given \`git diff\` output in a clear and concise commit message that accurately reflects the modifications made to the code-base. 
Use best practices for writing commit messages, and be sure to follow the conventional commit format. Use imperative mood, and be sure to keep the commit message under 50 characters.
             
Please provide a response in the form of a valid JSON object, containing ${numCommitMessages} commit messages in the following format:
{
    "commit_messages": [
        "commit message 1",
        "commit message 2",
        ...
        "commit message n",
    ]
}
The response MUST ONLY contains the JSON object, and no other text. For example, if you print the JSON object, do NOT include "Output:", "Response:" or anything similar to those two before it.
`
        },
    },
    {
        id: '2',
        prompt: ({diff, numCommitMessages}: {diff: string, numCommitMessages: number}) => { return`
Here is the output of the \`git diff\`:
\`\`\`
${diff}
\`\`\`

Craft a clear and concise commit message that accurately reflects the changes made in the given git diff output, using best practices for commit message writing and following the conventional commit format. Use imperative mood and keep the message under 50 characters.

Please provide a response in the form of a valid JSON object, containing ${numCommitMessages} commit messages in the following format:
{
    "commit_messages": [
        "commit message 1",
        "commit message 2",
        ...
        "commit message n",
    ]
}
The response MUST ONLY contains the JSON object, and no other text. For example, if you print the JSON object, do NOT include "Output:", "Response:" or anything similar to those two before it.
`
        }
    },
    {
        id: '3',
        prompt: ({diff, numCommitMessages}: {diff: string, numCommitMessages: number}) => { return`
Here is the output of the \`git diff\`:
\`\`\`
${diff}
\`\`\`

Generate a commit message that accurately summarizes the changes made in the given git diff output, following best practices for writing commit messages and the conventional commit format. Use imperative mood and aim for a message under 50 characters in length.

Please provide a response in the form of a valid JSON object, containing ${numCommitMessages} commit messages in the following format:
{
    "commit_messages": [
        "commit message 1",
        "commit message 2",
        ...
        "commit message n",
    ]
}
The response MUST ONLY contains the JSON object, and no other text. For example, if you print the JSON object, do NOT include "Output:", "Response:" or anything similar to those two before it.
`       
        }
    },
    {
        id: '4',
        prompt: ({diff, numCommitMessages}: {diff: string, numCommitMessages: number}) => { return`
Here is the output of the \`git diff\`:
\`\`\`
${diff}
\`\`\`


Here are some best practices for writing commit messages:
- Write clear, concise, and descriptive messages that explain the changes made in the commit.
- Use the present tense and active voice in the message, for example, "Fix bug" instead of "Fixed bug."
- Use the imperative mood, which gives the message a sense of command, e.g. "Add feature" instead of "Added feature"
- Limit the subject line to 72 characters or less.
- Capitalize the subject line.
- Do not end the subject line with a period.
- Limit the body of the message to 256 characters or less. 
- Use a blank line between the subject and the body of the message.
- Use the body of the message to provide additional context or explain the reasoning behind the changes.
- Avoid using general terms like "update" or "change" in the subject line, be specific about what was updated or changed.
- Explain, What was done at a glance in the subject line, and provide additional context in the body of the message.
- Why the change was necessary in the body of the message.
- The details about what was done in the body of the message.
- Any useful details concerning the change in the body of the message.
- Use a hyphen (-) for the bullet points in the body of the message.

Write ${numCommitMessages} commit messages that accurately summarizes the changes made in the given \`git diff\` output, following the best practices listed above.

Please provide a response in the form of a valid JSON object and do not include "Output:", "Response:" or anything similar to those two before it, in the following format:
{
    "commit_messages": [
        {
            "id": 1,
            "subject": "<type>(<scope>): <subject>",
            "body": "<BODY (bullet points)>"
        },
        {
            "id": 2,
            "subject": "<type>(<scope>): <subject>",
            "body": "<BODY (bullet points)>"
        },
        ...
        {
            "id": n,
            "subject": "<type>(<scope>): <subject>",
            "body": "<BODY (bullet points)>"
        }
    ]
}
`
        }
    },
]

export {
    promtps
};