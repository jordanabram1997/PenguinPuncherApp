var userScore = 0;
$('.js-clicker').on('click', function(){
	userScore++;
	$('.js-score').html(userScore);
});