# CommitAI

CommitAI is a command line interface application that automatically generates commit messages based on the output of git diff. It utilizes the power of OpenAI's GPT-3 API to create meaningful and descriptive commit messages, making it easier to keep track of code changes. With CommitAI, you can save time and focus on writing code, rather than crafting commit messages.

<p align="center">
  <img width="1024" src="./demo.svg">
</p>

<!-- <video src="https://asciinema.org/a/y685nS8Qeh26ISn8gY5HF8lQK" width="320" height="240" controls></video> -->

<!-- [![asciicast](https://asciinema.org/a/y685nS8Qeh26ISn8gY5HF8lQK.svg)](https://asciinema.org/a/y685nS8Qeh26ISn8gY5HF8lQK) -->

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
$ commitai [OPTIONS]
```
or 
```bash
$ npx commitai [OPTIONS]
```

## Options

- `-h, --help`: Show help
- `-v, --version`: Show version number
- `-n [number], --numberOfCommitMessages [number]`: Number of commit messages to generate
- `-e, --edit`: Edit the commit message before committing
  - `--no-e, --no-edit`: Do not prompt to edit the commit message before committing
- `-c, --confirmation`: Confirm the commit message before committing
  - `--no-c, --no-confirmation`: Do not prompt for confirmation before committing
