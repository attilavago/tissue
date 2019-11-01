const Octokit = require("@octokit/rest");
const dotenv = require('dotenv');
const fs = require('fs');
const markdownpdf = require("markdown-pdf");
const classy = require('remarkable-classy');

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
  fs.writeFile('issues.json', JSON.stringify(data,null, 4), function (err) {
    if (err) throw err;
    console.log('Issues saved to issues.json!');
    
    findIssueCategory(data, "P").forEach(function (issue) {
      if(data.length !== 0){
        writeHeading('\n# Positive Findings\r');
      }
      let title = `${issue.body.split('\r')[0]}`;
      // # Keyboard on Desktop,Mobile,Tablet
      let titleWithLabels = `\n#${issue.body.split('\r')[0]} ${findLabel(issue.labels).length !== 0 ? 'on' : ''} ${findLabel(issue.labels)} (P)`;
      let body = issue.body.substring(title.length + 1);
      fs.appendFileSync(`${issueLabel}-issues.md`, `${titleWithLabels} ${body}`);
    });
  
    findIssueCategory(data, "H").forEach(function (issue) {
      if(data.length !== 0){
        writeHeading('\n# High Impact\r');
      }
      let title = `${issue.body.split('\r')[0]}`;
      // # Keyboard on Desktop,Mobile,Tablet
      let titleWithLabels = `\n#${issue.body.split('\r')[0]} ${findLabel(issue.labels).length !== 0 ? 'on' : ''} ${findLabel(issue.labels)} (H)`;
      let body = issue.body.substring(title.length + 1);
      fs.appendFileSync(`${issueLabel}-issues.md`, `${titleWithLabels} ${body}`);
    });
  
    findIssueCategory(data, "M").forEach(function (issue) {
      if(data.length !== 0){
        writeHeading('\n# Medium Impact\r');
      }
      let title = `${issue.body.split('\r')[0]}`;
      // # Keyboard on Desktop,Mobile,Tablet
      let titleWithLabels = `\n#${issue.body.split('\r')[0]} ${findLabel(issue.labels).length !== 0 ? 'on' : ''} ${findLabel(issue.labels)} (M)`;
      let body = issue.body.substring(title.length + 1);
      fs.appendFileSync(`${issueLabel}-issues.md`, `${titleWithLabels} ${body}`);
    });
  
    findIssueCategory(data, "L").forEach(function (issue) {
      if(data.length !== 0){
        writeHeading('\n# Low Impact\r');
      }
      let title = `${issue.body.split('\r')[0]}`;
      // # Keyboard on Desktop,Mobile,Tablet
      let titleWithLabels = `\n#${issue.body.split('\r')[0]} ${findLabel(issue.labels).length !== 0 ? 'on' : ''} ${findLabel(issue.labels)} (L)`;
      let body = issue.body.substring(title.length + 1);
      fs.appendFileSync(`${issueLabel}-issues.md`, `${titleWithLabels} ${body}`);
    });
  
    findIssueCategory(data, "O").forEach(function (issue) {
      if(data.length !== 0){
        writeHeading('\n# Observations\r');
      }
      let title = `${issue.body.split('\r')[0]}`;
      // # Keyboard on Desktop,Mobile,Tablet
      let titleWithLabels = `\n#${issue.body.split('\r')[0]} ${findLabel(issue.labels).length !== 0 ? 'on' : ''} ${findLabel(issue.labels)} (O)`;
      let body = issue.body.substring(title.length + 1);
      fs.appendFileSync(`${issueLabel}-issues.md`, `${titleWithLabels} ${body}`);
    });
  
    const options = {
      cssPath: './issues.css',
      paperBorder: '1cm',
      remarkable: {
        html: true,
        breaks: true,
        plugins: [ classy ],
      }
    }
  
    markdownpdf(options).from(`${issueLabel}-issues.md`).to(`${issueLabel}-issues.pdf`, function () {
      console.log("PDF saved!")
    })
    
  });
  
});