var PRIV_KEY = "e7137b2aa0e213d118f0a029e3afe15cc0d29847";
var PUBLIC_KEY = "d6b46e6c9c347142b41298a810dd7dd7";
var score = 0;

function getCharacter(id) {
	var ts = Date.now();
	var hash = CryptoJS.MD5(ts + PRIV_KEY + PUBLIC_KEY).toString();
	var characterId = id; // wolverine                                                                             
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
	// the error codes are listed on the dev site
	console.log(err);
});
};

function characterInfo(characterData) {
	console.log(characterData);
	var character = characterData.data.results[0];
	var thumbnail = character.thumbnail.path + '.' + character.thumbnail.extension;
	var name = character.name;
	$('.character-photo').attr( 'src', thumbnail );


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
	return name;
}

function checkAnswer() {
}

$(function() {
	getCharacter(1009718);
})();