// Initializing variables
var PRIV_KEY = "e7137b2aa0e213d118f0a029e3afe15cc0d29847";
var PUBLIC_KEY = "d6b46e6c9c347142b41298a810dd7dd7";
var score = 0;

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
		characterInfo(data);
	})
	.fail(function(err){
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
	});
}

/**
 * [checkAnswer - Check if answer is right and update score]
 * @param  {string} name - Caracter name
 * @return {[type]} void
 */
function checkAnswer(name) {
	$('.send-name').click(function(e){
		var answer = $('.character-name').val();

		e.preventDefault();
		if ( answer.toLowerCase() === name.toLowerCase() ) {
			score++;
			$('.score').html(score);
		} else {
			score--;
			if ( score < 0 ) { score = 0; }
			$('.score').html(score);
		}
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
})();