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


console.log(json);