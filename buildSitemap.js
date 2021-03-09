const fs = require('fs');

const questions = require('./questions.json');

const LETTERS = {
    "а": "a", "б": "b", "в": "v", "г": "g",
    "д": "d", "е": "e", "ё": "yo", "ж": "zh",
    "з": "z", "и": "i", "й": "yi", "к": "k",
    "л": "l", "м": "m", "н": "n", "о": "o",
    "п": "p", "р": "r", "с": "s", "т": "t", 
	"у": "u", "ф": "f", "х": "j", "ц": "c",
	"ч": "ch", "ш": "sh", "щ": "sch", "ъ": "",
	"ы": "y", "ь": "", "э": "e", "ю": "yu",
	"я": "ya", "?": "", " ": "-"
};

const SITE_ROOT = "https://www.spain-answer.xyz/"

const createSlug = function(input) {
	var output = "";

	var lowercase = input.toLowerCase();

	for (var k = 0; k<lowercase.length; k++) {
		var char = LETTERS[lowercase[k]] || "";

		output += char;
	}

	return output;
};

const array = ["<?xml version=\"1.0\" encoding=\"UTF-8\"?>", "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">"];

const lastMod = new Date().toISOString().split('T')[0];

questions.forEach(question => {
    array.push("<url>");
    array.push(`<loc>${SITE_ROOT}${createSlug(question.question)}</loc>`);
    array.push(`<lastmod>${lastMod}</lastmod>`);
    array.push('</url>');
});

array.push("<url>");
array.push(`<loc>${SITE_ROOT}</loc>`);
array.push(`<lastmod>${lastMod}</lastmod>`);
array.push('</url>');

array.push("</urlset>");

fs.writeFileSync('./sitemap.xml',array.join('\n'));
