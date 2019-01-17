$( document ).ready(function() {
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	var game = (function() {
		var canvas;
		var score = 0;
		var running = 0;
		var levelSpeed = 4000;
		var chickens = [];
		var chickenCount = 12;
		var hypes = [
			"Cock-a-Doodle-Doo",
			"Fry me baby one more time",
			"You are TOO prepared!",
			"Le job est kilé",
			"The way of the chicken",
			"#RoastedLife",
			"Lord of the Wings",
			"Resurrection pending...",
			"Crème de la crème",
			"No chicken rules forever",
			"Eggstraordinary",
			"A chicken made it to the water"			
		];

		levelIncrease = function()
		{
			if (levelSpeed <= 400) {
				levelSpeed = 400;
				console.log(levelSpeed);
			} else {
				levelSpeed -= 240;
				console.log(levelSpeed);
			}
		}

		createClickHandler = function(i)
		{
			return function() {
				var chicken = chickens[i];
				if (chicken.state == "alive")
				{
					score++;
					$(".score").html(score);
					chicken.state = "dead";
					chicken.element.removeClass("visible").addClass("dead");
					chicken.whack.addClass("visible");
					chicken.whackTtl = 150; //whack image display time
					chicken.timer = levelSpeed; //getRandomInt(1000, 4000); //the amount of time the chickens reappear after all of them have been clicked or dead
					var numb = 0;
					numb = parseInt($("#highscore").text());
					if ( isNaN(numb) ) 
					{
						return numb = 0;
					}
					console.log(num);
					if ( numb < score )
					{
						window.localStorage.setItem("highScore", score);
						$("#highscore").html(score);
					} else 
					{
						$("#highscore").html(window.localStorage.getItem("highScore"));
					}
				}
			};
		};

		resetHighscore = function() {
			var resetZero = 0;
			window.localStorage.setItem("highScore", resetZero);
			$("#highscore").html(window.localStorage.getItem("highScore"));
			$("#highscore-2").html(window.localStorage.getItem("highScore"));
		};
		
		
		init = function(parentId)
		{
			canvas = $("#" + parentId);
			for (var i = 0; i < chickenCount; i++)
			{				
				// Create chicken container
				var chickenContainer = $("<div class=\"chicken_container\"/>",  {id:"chickenContainer_"+i });
				chickenContainer.appendTo(canvas);
		  
				// Create image
				var chickenImg = $("<img></img>", {id: "chicken_"+i, class:"chicken hidden", src:"images/chicken.jpg"})
				chickenImg.bind("dragstart", function(){ return false; });
				chickenImg.click(createClickHandler(i));					
				chickenImg.appendTo(chickenContainer);
							
				// Add a hype
				var chickenhype = $("<div class='hype'>" + hypes[i] + "</div>",  {id:"chickenHype"+i });
				chickenhype.appendTo(chickenContainer);

				// Add the whack =)
				var whackImg = $("<img></img>", {id: "Whack_" + 1, class:"whack", src:"images/whack.png"});
				whackImg.appendTo(chickenContainer);
				
				// Create the chicken
				var chicken = {
					id: i,
					state: "dead",
					element: chickenImg,
					whack: whackImg,
					whackTtl: 0,
					timer: getRandomInt(0, 6000) //the amount of chickens that appear and after how long they reapear
				};
				chickens.push(chicken);
			}
	  };

	  start = function()
	  {
		running = 1;
		delta = 0;
		lastFrameTimeMs = 0;
		requestAnimationFrame(gameloop);    
	  };  
	  
	  stop = function()
	  {
		running = 0;
	  };
	  
	  resetScore = function()
	  {
	  	$(".score").html(0);
		score = 0;
		levelSpeed = 4000;
		timestep = 1000 / 25;
	  };

	  update = function(step)
	  {
		for (var i=0; i<chickenCount; i++)
		{
			var chicken = chickens[i];

			// Hide the whack
			if (chicken.whackTtl > 0)
			{
				chicken.whackTtl -= step;
				if (chicken.whackTtl <= 0)
				{
					chicken.whack.removeClass("visible");
					chicken.whackTtl = 0;
				}
			}

			// chicken lifetime events
			chicken.timer -=step;
			if (chicken.timer <= 0)
			{				
				if (chicken.state == "dead")
				{
					$("#chicken_" + chicken.id).attr("src", "images/chicken.jpg");
					chicken.state = "alive";
					chicken.element.removeClass("hidden").removeClass("dead").addClass("visible");
					chicken.timer = getRandomInt(500, 1000); //sets the speed of which the chicken hides					
				} else {
					chicken.state = "dead";
					chicken.element.removeClass("visible").addClass("hidden");
					chicken.timer = levelSpeed; //getRandomInt(500, 3000);	//the amount of time the chicken reappears in the same div							
				}								
			}			
		}
	  };
	  
	  
	  
	  var timestep = 1000 / 25;
	  var lastFrameTimeMs = 0;
	  var delta = 0;

	  gameloop = function(timestamp)
	  {
		delta += timestamp - lastFrameTimeMs;    
		lastFrameTimeMs = timestamp;    
		while(delta >= timestep)
		{
			update(timestep);
			delta =- timestep;
		}    
		
		if (running)
			requestAnimationFrame(gameloop);
	  };
	  
	  
		
	  return {
		initialize : init,
		start : start,
		stop: stop,
		resetScore : resetScore
	  };
	  
	})();	

	$("#startgame").click(function() {
		startTimer(fragmentTime, displayMinute, displaySecond);
		increaseLevel = setInterval(levelIncrease, 10000);
		$("#scorescreen").hide();
		$("#header").show();
		game.initialize("canvas");
		game.start();
	});

	$("#restartgame").click(function() {
		location.reload();
	});
	
	$(".chicken").click(function() {
		$(this).removeClass("visible").addClass("hidden");
	});	

	$("#header").hide();
	$(".restart").hide();	
	$("#highscore").html(window.localStorage.getItem("highScore"));
	
	

	function startTimer(duration, displayMinute, displaySecond) {
		var timer = duration, displayMinute, displaySecond;
		var timeIntervalID = setInterval(function () {

		minutes = parseInt(timer / 60, 10)
		seconds = parseInt(timer % 60, 10);

		minutes = minutes < 10 ? "0" + minutes : minutes;
		seconds = seconds < 10 ? "0" + seconds : seconds;

		displayMinute.textContent = minutes;
		displaySecond.textContent = seconds;

		if (--timer < 0) {
			timer = 0;
			if (timer == 0) {
			clearInterval(timeIntervalID);
			clearInterval(increaseLevel);
			game.stop();
			$("#header").hide();
			$(".main-description").hide();
			$("#canvas").hide();
			$("#scorescreen").show(1000);
			$(".restart").show();
			$("#highscore-2").html(window.localStorage.getItem("highScore"));
			}
		}

		}, 1000);
	}

var increaseLevel;	
var fragmentTime;
var minutes = $('span.minute').text();
var seconds = $('span.second').text();
minutes = parseInt(minutes);
seconds = parseInt(seconds);

if (isNaN(minutes)) {
minutes = 00;
}

if (isNaN(seconds)) {
seconds = 00;
}

if (minutes == 60) {
minutes = 59;
}

if (seconds == 60) {
seconds = 59;
}

fragmentTime = (60 * minutes) + (seconds);
displayMinute = document.querySelector('span.minute');
displaySecond = document.querySelector('span.second');
	
});
