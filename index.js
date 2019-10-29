const Octokit = require("@octokit/rest");
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

let projectOwner = process.argv[2];
let repositoryName = process.argv[3];
let issueLabel = process.argv[4];

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
  repo: repositoryName,//'Jaguar-Land-Rover'
  owner: projectOwner,//'user-vision'
  labels: issueLabel,//'Jaguar_ComparisonTool'
}).then(({data, headers, status}) => {
  fs.writeFile('issues.json', JSON.stringify(data,null, 4), function (err) {
    if (err) throw err;
    console.log('Issues saved to issues.json!');
    data.forEach(function (issue) {
      let body = `${issue.body}\n`;
      let title = issue.body.split('\r')[0] + ' on mobile';
      console.log(title);
      fs.appendFile('issues.md', body, function (err) {
        if (err) throw err;
        // console.log('Issue saved to issues.md!');
      });
    });
  });
  
});