const Octokit = require("@octokit/rest");
const dotenv = require('dotenv');
const fs = require('fs');
const json2md = require("json2md");

dotenv.config();

console.log(process.env.GITHUB_TOKEN);

const octokit = Octokit({
  auth: process.env.GITHUB_TOKEN,
  userAgent: 'githubIssuesMastertool v.1.0.0',
  baseUrl: 'https://api.github.com',
  log: {
    debug: () => {},
    info: () => {},
    warn: console.warn,
    error: console.error
  },
  request: {
    agent: undefined,
    fetch: undefined,
    timeout: 0
  }
});

octokit.issues.listForRepo({
  repo: 'Jaguar-Land-Rover',
  owner: 'user-vision',
  labels: 'Jaguar_ComparisonTool',
}).then(({data, headers, status}) => {
  console.log(json2md(data, 'snippet'));
  fs.writeFile('issues.json', JSON.stringify(data), function (err) {
    if (err) throw err;
    console.log('Issues saved to issues.json!');
  });
  
});