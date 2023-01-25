# CommitAI

CommitAI is a command line interface application that automatically generates commit messages based on the output of git diff. It utilizes the power of OpenAI's GPT-3 API to create meaningful and descriptive commit messages, making it easier to keep track of code changes. With CommitAI, you can save time and focus on writing code, rather than crafting commit messages.

<!-- <p align="center">
  <img width="1024" src="./demo.svg">
</p> -->

<!-- <script id="asciicast-y685nS8Qeh26ISn8gY5HF8lQK" src="https://asciinema.org/a/y685nS8Qeh26ISn8gY5HF8lQK.js" async></script> -->

<!-- <video src="https://asciinema.org/a/y685nS8Qeh26ISn8gY5HF8lQK" width="320" height="240" controls></video> -->

[![asciicast](https://asciinema.org/a/y685nS8Qeh26ISn8gY5HF8lQK.svg)](https://asciinema.org/a/y685nS8Qeh26ISn8gY5HF8lQK)


## Install

```bash
$ npm install --global commitai
```
or
```bash
$ yarn global add commitai
```



## Usage

```bash
$ npx commitai [OPTIONS]
```
or
```bash
$ commitai [OPTIONS]
```

Note: You must have a valid OpenAI API key in order to use CommitAI. You can get one [OpenAI API keys](https://beta.openai.com/account/api-keys). After you have your API key, you have to set it as an environment variable or you have to run the following command before using CommitAI:
```bash
OPENAI_API_KEY=sk-<your-api-key> commitai
```
or export it as an environment variable in your `.bashrc` or `.zshrc` file:
```bash
export OPENAI_API_KEY=sk-<your-api-key>
```

## Options

- `-h, --help`: Show help
- `-v, --version`: Show version number
- `-n [number], --numberOfCommitMessages [number]`: Number of commit messages to generate
- `-e, --edit`: Edit the commit message before committing
  - `--no-e, --no-edit`: Do not prompt to edit the commit message before committing
- `-c, --confirmation`: Confirm the commit message before committing
  - `--no-c, --no-confirmation`: Do not prompt for confirmation before committing
