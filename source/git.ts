import {exec, ExecException as _4} from 'node:child_process';
import {promisify} from 'node:util';

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

const execGitCommit = async (commitMessage: string) => {
	const {stdout, stderr} = await execAsync(`git commit -m "${commitMessage}"`);
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
