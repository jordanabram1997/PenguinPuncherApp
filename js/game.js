var settings;
 // localStorage.removeItem("clickerSettings")
$(document).ready(function(){
	
	loadData();
	setEverything();
	setupUpgrades();
	setupPPS();

	$(".js-clicker").on("mousedown", function(){
		settings.score = settings.score + settings.ppc;
		settings.experience = settings.experience + 1;

		settings.level = figureOutLevel();

		setEverything();
		saveData();
		ga('send', 'event', 'Penguin', 'click');
	})

	$(".game-container__upgrades").on("click", ".upgrade-item", function(){
		var upgrade = data.upgrades[$(this).data("id")];

		if (settings.score>=upgrade.price) {

			//Remove Price from Current Score
			settings.score = settings.score - upgrade.price;

			settings.ppc = settings.ppc + upgrade.ppc;
			settings.pps = settings.pps + upgrade.pps;
			setEverything();
			saveData();
			ga('send', 'event', 'Upgrade', 'click',upgrade.title);
		}

	})

});


function saveData(){
	localStorage.setItem('clickerSettings', JSON.stringify(settings));
}

function loadData(){
	var defaultSettings = {
		score: 0,
		ppc: 1,
		pps: 0,
		level:1,
		experience:0
	};

	settings = JSON.parse(localStorage.getItem('clickerSettings')) || defaultSettings;

	settings = $.extend(defaultSettings, settings);
}

function setEverything(){
	$(".js-score").html(numberWithCommas(Math.floor(settings.score))); 
	$(".js-ppc").html(numberWithCommas(settings.ppc));
	$(".js-pps").html(numberWithCommas(settings.pps));
	$(".js-level").html(numberWithCommas(settings.level));
	$(".js-experience").html(numberWithCommas(settings.experience));
	$(".js-progress").width(getExperiencePercentage());
}


Handlebars.registerHelper('addCommas', function(number) {
  return numberWithCommas(number);
});


function setupUpgrades(){
	var source   = $("#upgrade-template").html();
	var template = Handlebars.compile(source);
	var html    = template(data);

	$(".js-updates-output").html(html);
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function experienceNeeded(neededLevel) {
	var experienceNeeded = 25 * neededLevel * neededLevel - 25 * neededLevel;

	return experienceNeeded;
}

function figureOutLevel() {
	// http://stackoverflow.com/questions/6954874/php-game-formula-to-calculate-a-level-based-on-exp
	var level = (25 + Math.sqrt(25 * 25 - 4 * 25 * (-settings.experience) ))/ (2 * 25)

	return Math.floor(level);
}

function getExperiencePercentage() {

	var percentage = ( (settings.experience - experienceNeeded(settings.level)) / (experienceNeeded(settings.level + 1) - experienceNeeded(settings.level))) * 100;

	return percentage + "%"
}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

function setupPPS(){
	requestAnimFrame(setupPPS);

	// Update code here
	var update = settings.pps / 60;

	settings.score = settings.score + update;
	setEverything();		
	saveData();
}