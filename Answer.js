var Answer = {
	sendQuestion: function() {
		$('#newQuestionForm').submit();

		$('#questionModal').modal('toggle');
		$('#newQuestion').val('');

		alert('Спасибо за Ваш вопрос / исправление!');
	}
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
						if (ui.item.value.length > 0) {
							var answerText = data[ui.item.value];

							$('#questionText').text(ui.item.value);
							$('#answerText').html(answerText);

							$('#answerModal').modal('toggle');

							$('#question').val('');
						}
					}
				});
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