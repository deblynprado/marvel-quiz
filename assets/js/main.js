// Initializing variables
var PRIV_KEY = "e7137b2aa0e213d118f0a029e3afe15cc0d29847";
var PUBLIC_KEY = "d6b46e6c9c347142b41298a810dd7dd7";
var score = 0;
var topCharacters = 10;
var appAddress = 'https://deblynprado.github.io/marvel-quiz/';

function loadScore(score) {
	var score = this.score;
	$('.score').html(score);
	return;
}

function whatsShare(score) {
	var score = this.score;
	$('.whatsapp-share').click(function(e){		
		e.preventDefault();
		$(this).attr('href', 'whatsapp://send?text=Just finished my Marvel Quiz! My score is: ' + score + '. Try on ' + appAddress);
		window.location = $(this).attr('href');
	});
}

/**
 * [generateCharID - Generates a random ID to get charaters on API]
 * @return void
 */
function generateCharID() {
	var minID = 1009210; // Lower ID that I found on API
	var maxID = 1009742; // Higher ID that I found on API
	var charId = Math.floor(Math.random()*(minID-maxID+1)+minID);
	getCharacter(charId);
}

/**
 * [getCharacter - Connects on Marvel's API and get character info based on the ID received]
 * @param  {int} id - Charater ID on Marvel's API
 * @return {obj} - Return a object containing Character personal info
 */
function getCharacter(id) {
	var ts = Date.now();
	var hash = CryptoJS.MD5(ts + PRIV_KEY + PUBLIC_KEY).toString();
	var characterId = id;                                                                           
	var url = 'https://gateway.marvel.com/v1/public/characters/' + characterId + '?ts=' + ts + '?apikey=' + PUBLIC_KEY + '?hash=' + hash;

	$.getJSON(url, {
		ts: ts,
		apikey: PUBLIC_KEY,
		characters: characterId
	})
	.done(function(data) {
		$('.loading').css('display', 'none');
		$('.content').css('display', 'inline-block');
		topCharacters--;
		if (topCharacters >= 0) {
			characterInfo(data);
		} else {
			$('.content').css('display', 'none');
			$('.game-over').css('display', 'inline-block');
		}
	})
	.fail(function(err){
		$('.content').css('display', 'none');
		$('.loading').css('display', 'inline-block');
		generateCharID();
		// console.log(err);
	});
};

/**
 * [nextChar - Cleanup page and call method to show a new character on screen]
 * @return void
 */
function nextChar() {
	$('.next').click(function(e){
		e.preventDefault();		
		$('.character-name').removeAttr('disabled');
		$('.tip-name').html('');
		$('.character-name').val('');
		$('.answer-area').removeClass('right-answer wrong-answer');
		$('.get-tip').removeClass('blocked');
		$('.send-name').removeClass('blocked');
		generateCharID();
	});
}

/**
 * [answerTip Show the name of character on screen]
 * @param  {string} name - Charancter name
 * @return void
 */
function answerTip(name) {
	$('.get-tip').click(function(e) {
		e.preventDefault();
		$('.tip-name').html(name);
		$('.character-name').attr('disabled', 'disabled');
		$('.send-name').addClass('blocked');
	});
}

/**
 * [checkAnswer - Check if answer is right and update score]
 * @param  {string} name - Caracter name
 * @return {[type]} void
 */
function checkAnswer(name) {
	$('.character-name').focus(function(){
		$(this).parent().removeClass('wrong-answer');
	});

	$('.send-name').click(function(e){
		var answer = $('.character-name').val();

		e.preventDefault();
		if ( answer.toLowerCase() === name.toLowerCase() ) {
			score++;
			loadScore(score);
			$('.answer-area').addClass('right-answer');
			$('.get-tip').addClass('blocked');
			$('.send-name').addClass('blocked');
		} else {
			score--;
			if ( score < 0 ) { score = 0; }
			loadScore(score);
			$('.answer-area').addClass('wrong-answer');
		}

		whatsShare(score);
	});
}

/**
 * [characterInfo - Filter the entire Character Object and get info that we need]
 * @param  {obj} - characterData Object returned from API
 * @return {string} - Character name
 */
function characterInfo(characterData) {
	var character = characterData.data.results[0];
	var thumbnail = character.thumbnail.path + '.' + character.thumbnail.extension;
	var name = character.name;
	$('.character-photo').attr( 'src', thumbnail );

	answerTip(name);
	checkAnswer(name);
	return name;
}

$(function() {
	generateCharID();
	nextChar();
	whatsShare();
	loadScore();
})();