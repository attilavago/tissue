# Tissue
A Node.js based tool to get issues from Github and translate them to whatever else.

This tool uses the official Github [Octokit](https://octokit.github.io/rest.js) API to grab issues from your Github repository, be that private or public. The resulting `.json` is then saved and ready for use and acts as the single source of truth for any further operations. In this case the tool will take certain relevant information and output it to markdown `.md` files.

## How to set up
- Clone or download the repo
- `npm install`
- create a `.env` file in the project root and add the following line `GITHUB_TOKEN=your token from https://github.com/settings/tokens`. The result will look something like this `GITHUB_TOKEN=abcdefghijklmnop1234567890zxcvbnmkjhg`

## How to use
- in your command line run `node index`