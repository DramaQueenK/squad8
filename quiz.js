
// 1
var questions = [
	[
		"¿Qué es Laboratoria?",
		"Industria Farmaceútica",
		"Incubadora de Negocios",
		"Centro de Formación Técnica",
		"Empresa Social",
		3
	],
	[
		"¿En qué ciudades está ubicada Laboratoria?",
		"Santiago, Lima, São Paulo",
		"Bogóta, Santiago, São Paulo",
		"Montevideo, Lima, Santiago",
		"México Df, Santiago, Lima, São Paulo",
		3
	],
	[
		"¿Cuál es el perfil de las Egresadas?",
		"BackEnd",
		"FrontEnd Developers / UX Designers",
		"Full Stack",
		"Ninguno de los anteriores",
		1
	],
	[
		"¿Quién puede postular a Laboratoria?",
		"Mujeres mayores de 18 años",
		"Personas que sepan Programar",
		"Chilenas",
		"Todos pueden postular",
		0
	],
	[
		"¿Cuánto tiempo dura el Bootcamp?",
		"1 año",
		"4 meses",
		"6 meses",
		"8 meses",
		2
	],
];

// 2
var questionTemplate = _.template(" \
	<div class='card question'><span class='question'><%= question %></span> \
      <ul class='options'> \
        <li> \
          <input type='radio' name='question[<%= index %>]' value='0' id='q<%= index %>o1'> \
          <label for='q<%= index %>o1'><%= a %></label> \
        </li> \
        <li> \
          <input type='radio' name='question[<%= index %>]' value='1' id='q<%= index %>o2'> \
          <label for='q<%= index %>o2'><%= b %></label> \
        </li> \
        <li> \
          <input type='radio' name='question[<%= index %>]' value='2' id='q<%= index %>o3'> \
          <label for='q<%= index %>o3'><%= c %></label> \
        </li> \
        <li> \
          <input type='radio' name='question[<%= index %>]' value='3' id='q<%= index %>o4'> \
          <label for='q<%= index %>o4'><%= d %></label> \
        </li> \
      </ul> \
    </div> \
    ");


// 3
var points,
	pointsPerQuestion,
	currentQuestion,
	questionTimer,
	timeForQuestion = 8, // seconds
	timeLeftForQuestion; 

// 4
$(function() {

	// 
	$('button.start').click(start);
	$('.play_again button').click(restart);


	function restart() {
		points = 0;
		pointsPerQuestion = 1;
		currentQuestion = 0;
		timeLeftForQuestion = timeForQuestion;

		$('.finish.card').hide();
		$('div.start').show();
		$('.times_up').hide();

		generateCards();
		updateTime();
		updatePoints();


		document.getElementById("nombretxt").value = "";
		document.getElementById("nombreTemp").value = "";
		document.getElementById("NombreFinish").innerHTML = "";

		$("#nombretxt").focus();

	}

	// 
	function start() {
		var n = document.getElementById("nombretxt").value;

		if ( n == "") {
			alert("NOMBRE VACIO!");
			return;
		}

		document.getElementById("nombreTemp").value = n;
		document.getElementById("NombreFinish").innerHTML = n;


		$('div.start').fadeOut(200, function() {
			moveToNextQuestion();
		});

		
	}

	// 
	function generateCards() {
		$('.questions').html('');
		for (var i = 0; i < questions.length; i++) {
			var q = questions[i];
			var html = questionTemplate({
				question: q[0],
				index: i,
				a: q[1],
				b: q[2],
				c: q[3],
				d: q[4]
			});
			$('.questions').append(html);
		};
		$('.question.card input').change(optionSelected);
	}

	// 
	function moveToNextQuestion() {
		currentQuestion += 1;
		if (currentQuestion > 1) {
			$('.question.card:nth-child(' + (currentQuestion-1) + ')').hide();
		}
		showQuestionCardAtIndex(currentQuestion);
		setupQuestionTimer();
	}

	// 
	function setupQuestionTimer() {
		if (currentQuestion > 1) {
			clearTimeout(questionTimer);
		}
		timeLeftForQuestion = timeForQuestion;
		questionTimer = setTimeout(countdownTick, 1000);
	}

	// 
	function showQuestionCardAtIndex(index) { // staring at 1
		var $card = $('.question.card:nth-child(' + index + ')').show();
	}

	// 
	function countdownTick() {
		timeLeftForQuestion -= 1;
		updateTime();
		if (timeLeftForQuestion == 0) { 
			return finish();
		}
		questionTimer = setTimeout(countdownTick, 1000);
	}

	// 
	function updateTime() {
		$('.countdown .time_left').html(timeLeftForQuestion + 's');
	}

	// 
	function updatePoints() {
		$('.points span.points').html(points + ' aciertos');
	}

	// 
	function optionSelected() {
		var selected = parseInt(this.value);
		var correct = questions[currentQuestion-1][5];

		if (selected == correct) {
			points += pointsPerQuestion;
			updatePoints();
			correctAnimation();
		} else {
			wrongAnimation();
		}

		if (currentQuestion == questions.length) {
			clearTimeout(questionTimer);
			return finish();
		}
		moveToNextQuestion();
	}

	
	function correctAnimation() {
		animatePoints('right');
	}

	// 
	function wrongAnimation() {
		animatePoints('wrong');
	}

	// 
	
	function animatePoints(cls) {
		$('header .points').addClass('animate ' + cls);
		setTimeout(function() {
			$('header .points').removeClass('animate ' + cls);
		}, 500);
	}

	// 
	function finish() {
		if (timeLeftForQuestion == 0) {
			$('.times_up').show();
		}
		$('p.final_points').html(points + ' respuestas correctas');
		$('.question.card:visible').hide();
		$('.finish.card').show();



	}

	// 
	restart();

});