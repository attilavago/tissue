const cheerio = require('cheerio');
const fs = require('fs')
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, './wcag21summary.html'), 'utf8')
const $ = cheerio.load(html);

const json = [];

json.push({category: 'principle1', title: $('#principle1').text()});
json.push({category: 'principle2', title: $('#principle2').text()});
json.push({category: 'principle3', title: $('#principle3').text()});
json.push({category: 'principle4', title: $('#principle4').text()});

$('.panel-body-principle').each(function (i, elem) {
  json[i].description = $(this).text().trim();
});

json[0].guidelines = [];
json[1].guidelines = [];
json[2].guidelines = [];
json[3].guidelines = [];

$('.principle:nth-child(1) > .guidelines > .guideline > .panel-heading').each(function (i, elem) {
  //console.log($(this.children[0].children[1]).text());
  json[0].guidelines.push({id: $(this.children[0].children[1]).text(), title: $(this.children[0]).text().trim(), description: $(this.children[1]).text().trim()});
});

$('.principle:nth-child(2) > .guidelines > .guideline > .panel-heading').each(function (i, elem) {
  json[1].guidelines.push({id: $(this.children[0].children[1]).text(), title: $(this.children[0]).text().trim(), description: $(this.children[1]).text().trim()});
});

$('.principle:nth-child(3) > .guidelines > .guideline > .panel-heading').each(function (i, elem) {
  json[2].guidelines.push({id: $(this.children[0].children[1]).text(), title: $(this.children[0]).text().trim(), description: $(this.children[1]).text().trim()});
});

$('.principle:nth-child(4) > .guidelines > .guideline > .panel-heading').each(function (i, elem) {
  json[3].guidelines.push({id: $(this.children[0].children[1]).text(), title: $(this.children[0]).text().trim(), description: $(this.children[1]).text().trim()});
});

console.log(JSON.stringify(json,null, 4));