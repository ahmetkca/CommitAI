import {exec, ExecException as _4} from 'node:child_process';
import {promisify} from 'node:util';

console.log(process.env["SHELL"]);

const shellString = {

}

const execAsync = promisify(exec);

const getGitDiffOutput = async () => {
	const {stdout, stderr} = await execAsync('git diff --staged');
	if (stderr) {
		throw new Error(stderr);
	}

	return stdout;
};

const isInGitRepository = async () => {
	try {
		const {stdout, stderr} = await execAsync('git rev-parse --is-inside-work-tree');
		if (stderr) {
			throw new Error(stderr);
		}

		return stdout.trim() === 'true';
	} catch {
		return false;
	}
};

const execGitCommit = async (messageArgs: string[]) => {
	let gitCommitCommand = 'git commit';
	// messageArgs.forEach((message) => {
	// 	gitCommitCommand += ` -m "${message}"`;
	// });

	const {stdout, stderr} = await execAsync(gitCommitCommand);
	if (stderr) {
		throw new Error(stderr);
	}

	return stdout;
};

export {
	getGitDiffOutput,
	isInGitRepository,
	execGitCommit,
};
