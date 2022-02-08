const Answer = {
	sendQuestion: () => {
		$('#newQuestionForm').submit();

		$('#questionModal').modal('toggle');
		$('#newQuestion').val('');

		alert('Спасибо за Ваш вопрос / исправление!');
	},

	showAnswer: (data, question) => {
		const questionObject = data.find(item => item.question === question);
		const answerText = questionObject.answer || "";

		if (answerText) {
			$('#questionText').text(question);
			$('#answerText').html(answerText);

			const parts = location.pathname.split("/");
	
			let link = "/";
	
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

const createSlug = (input) => {
	let output = "";

	const lowercase = input.toLowerCase();

	for (let k = 0; k < lowercase.length; k++) {
		output += (LETTERS[lowercase[k]] || "");
	}

	return output;
};

$(document).ready(
	() => {
		$.getJSON(
			"questions.json",
			(data) => {
				$("#question").autocomplete({
					source: (search, response) => {
						response(data.filter(
							(questionObject) => 
								questionObject.question.toLowerCase().indexOf(search.term.toLowerCase()) !== -1
							
						).map(
							(questionObject) => ({
								label: questionObject.question.toLowerCase(), value: questionObject.question
							})
						));
					},
					minLength: 2,
					select: (event, ui) => {
						if (ui.item.value.length) {
							Answer.showAnswer(data, ui.item.value);
						}
					}
				});

				const results = (/\?q=(.*)/g).exec(window.location.search);
				const questionSlug = (results !== null) ? results[1] || 0 : false;

				if (questionSlug) {
					const questionObject = data.find((item) => 
						createSlug(item.question) === questionSlug
					);

					Answer.showAnswer(data, questionObject.question);
				}
			}
		);

		$('#answerModal').on(
			'hidden.bs.modal', 
			() => {
				$('#question').val('');
			}
		);
	}
);