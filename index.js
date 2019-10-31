const Octokit = require("@octokit/rest");
const dotenv = require('dotenv');
const fs = require('fs');
const markdownpdf = require("markdown-pdf");

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



const findLabel = (array) => {
  let labels = [];
  array.forEach(function(label) {
    if(label.name === "Mobile") labels.push('Mobile');
    if(label.name === "Desktop") labels.push('Desktop');
    if(label.name === "Tablet") labels.push('Tablet');
  });
  return labels;
}

const findIssueCategory = (issuesArray, categoryLabel) => {
  let issues = [];
  issuesArray.forEach(function(issue) {
    issue.labels.forEach(function(label) {
      if(label.name === categoryLabel) issues.push(issue);
    });
  });
  return issues;
}

const writeHeading = (heading) => {
  fs.appendFileSync('issues.md', `\n\r${heading}\n\r`);
}

octokit.issues.listForRepo({
  repo: repositoryName,//'Jaguar-Land-Rover'
  owner: projectOwner,//'user-vision'
  labels: issueLabel,//'Jaguar_ComparisonTool'
}).then(({data, headers, status}) => {
  // we need to sort the array of objects by: 1. Positive, 2. High Impact, 3. Medium Impact, 4. Low Impact, 5. Observation
  
  
  fs.writeFile('issues.json', JSON.stringify(data,null, 4), function (err) {
    if (err) throw err;
    console.log('Issues saved to issues.json!');
  
    writeHeading('# Positive Findings');
    
    findIssueCategory(data, "P").forEach(function (issue) {
      let title = `${issue.body.split('\r')[0]}`;
      // # Keyboard on Desktop,Mobile,Tablet
      let titleWithLabels = `${issue.body.split('\r')[0]} ${findLabel(issue.labels).length !== 0 ? 'on' : ''} ${findLabel(issue.labels)}`;
      let body = issue.body.substring(title.length + 1);
      fs.appendFileSync('issues.md', `${titleWithLabels} ${body}`);
    });
  
    writeHeading('# High Impact');
  
    findIssueCategory(data, "H").forEach(function (issue) {
      let title = `${issue.body.split('\r')[0]}`;
      // # Keyboard on Desktop,Mobile,Tablet
      let titleWithLabels = `${issue.body.split('\r')[0]} ${findLabel(issue.labels).length !== 0 ? 'on' : ''} ${findLabel(issue.labels)}`;
      let body = issue.body.substring(title.length + 1);
      fs.appendFileSync('issues.md', `${titleWithLabels} ${body}`);
    });
  
    markdownpdf({cssPath: './issues.css'}).from("./issues.md").to("./issues.pdf", function () {
      console.log("Done")
    })
    
  });
  
});