var Answer = {
	sendQuestion: function() {
		$('#newQuestionForm').submit();

		$('#questionModal').modal('toggle');
		$('#newQuestion').val('');

		alert('Спасибо за Ваш вопрос / исправление!');
	},

	showAnswer: function(data, question) {
		var questionObject = data.find(item => item.question === question);
		var answerText = questionObject.answer || "";

		if (answerText) {
			$('#questionText').text(question);
			$('#answerText').html(answerText);

			var parts = location.pathname.split("/");
	
			var link = "/";
	
			if (parts.length === 3) {
				link += parts[1] + "/";
			} 
	
			link += createSlug(question);

			$('#permalink').attr('href', link);
	
			$('#answerModal').modal('toggle');
	
			$('#question').val('');

			if (gtag) {
				gtag('event', 'page_view', {
					page_title: question,
					page_location: 'http://spain-answer.xyz' + link,
					page_path: link,
					send_to: 'G-RV7NR0PTD7'
				});
			}
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
						response(data.filter(
							function(questionObject) {
								return questionObject.question.toLowerCase().indexOf(search.term.toLowerCase()) != -1;
							}
						).map(
							function(questionObject) {
								return {label: questionObject.question.toLowerCase(), value: questionObject.question};
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
					var questionObject = data.find(function(item) {
						return createSlug(item.question) === questionSlug;
					});

					Answer.showAnswer(data, questionObject.question);
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