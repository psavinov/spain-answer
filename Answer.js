var Answer = {
	sendQuestion: function() {
		$('#newQuestionForm').submit();

		$('#questionModal').modal('toggle');
		$('#newQuestion').val('');

		alert('Спасибо за Ваш вопрос / исправление!');
	},

	showAnswer: function(data, question) {
		var answerText = data[question];

		if (answerText) {
			$('#questionText').text(question);
			$('#answerText').html(answerText);
			$('#permalink').attr('href', '/?q=' + createSlug(question));
	
			$('#answerModal').modal('toggle');
	
			$('#question').val('');
		}
	}
};

var LETTERS = {
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

var createSlug = function(input) {
	var output = "";

	var lowercase = input.toLowerCase();

	for (var k = 0; k<lowercase.length; k++) {
		var char = LETTERS[lowercase[k]] || "";

		output += char;
	}

	return output;
};

$(document).ready(
	function() {
		$.getJSON(
			"questions.json",
			function(data) {
				$("#question").autocomplete({
					source: function (search, response) {
						response(Object.keys(data).filter(
							function(key) {
								return key.toLowerCase().indexOf(search.term.toLowerCase()) != -1;
							}
						).map(
							function(value) {
								return {label: value.toLowerCase(), value: value};
							}
						));
					},
					minLength: 2,
					select: function(event, ui) {
						if (ui.item.value.length) {
							Answer.showAnswer(data, ui.item.value);
						}
					}
				});

				var results = (/\?q=(.*)/g).exec(window.location.search);
				var questionSlug = (results !== null) ? results[1] || 0 : false;

				if (questionSlug) {
					var question = Object.keys(data).find(function(item) {
						return createSlug(item) === questionSlug;
					});

					Answer.showAnswer(data, question);
				}
			}
		);

		$('#answerModal').on(
			'hidden.bs.modal', 
			function() {
				$('#question').val('');
			}
		);
	}
);