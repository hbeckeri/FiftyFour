/*
 * Please see the included README.md file for license terms and conditions.
 */

/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false app:false, dev:false, cordova:false */

var id;
// Start Stop Restart Pause and Resume Game

function resizeCanvas() {
	canvas = document.getElementById("myCanvas");
	canvas.style.height = window.innerHeight + "px";
	canvas.style.width = window.innerWidth + "px";
	console.log("here");
}

function startDots() {
	var lastTime = 0;
	var vendors = [ 'ms', 'moz', 'webkit', 'o' ];
	for ( var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]
				+ 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x]
				+ 'CancelAnimationFrame']
				|| window[vendors[x] + 'CancelRequestAnimationFrame'];
	}
	dots.init();
}
function stopDots() {
	//Cocoon.Ad.showInterstitial();
	
	var username = getCookie("username");
	dots.gamesPlayed = getCookie("gamesPlayed");
	dots.averageScore = getCookie("averageScore");
	dots.averageScore *= (dots.gamesPlayed);
	dots.averageScore += dots.score;
	dots.gamesPlayed++;
	dots.averageScore /= dots.gamesPlayed;
	setCookie("averageScore", dots.averageScore);
	setCookie("gamesPlayed", dots.gamesPlayed);
	$.post("http://fiftyfour.me/updateScore.php", {
		username : username,
		highScore : dots.highScore,
		score : dots.score,
		uuid : dots.uuid,
		gamesPlayed : dots.gamesPlayed,
		averageScore : Math.round(parseFloat(dots.averageScore) * 100) / 100,
	});
	if (dots.requestId) {
		window.cancelAnimationFrame(dots.requestId);
	}
	dots.requestId = 0;
	// clearTimeout(dots.loop);
	removeDotsListeners();
	setCookie("highScore", dots.highScore.toString());
	$('#pauseModal').modal('hide');
	$('#gameOverModal').modal('hide');
	
	removeCanvas();
	createStartMenu();
}

function restartDots() {
	stopDots();
	playDots();
}

function pauseDots() {
	removeDotsListeners();
	dots.gamePaused = true;
	dots.render();
	$('#pauseModal').modal({
		backdrop : 'static',
		keyboard : false
	});
	$('#pauseModal').modal('show');
}

function resumeDots() {
	$('#pauseModal').modal('hide');
	dots.gamePaused = false;
	addDotsListeners();
}

function makeId() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16)
				.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4()
			+ s4() + s4();
}
// Username Modals (maybe move these to another file)
function editUsername() {

	$('#editUsernameModal').modal({
		backdrop : 'static',
		keyboard : false
	});
	$('#editUsernameModal').modal('show');
	var textfield = document.getElementById("usernameInput");
	var formGroup = document.getElementById("editUsernameFormGroup");
	var label = document.getElementById("usernameLabel");
	var average = document.getElementById("averageScore");
	var games = document.getElementById("gamesPlayed");
	var high = document.getElementById("highScore");
	var on = document.getElementById("tutorialOn");
	var off = document.getElementById("tutorialOff");

	if (getCookie("showTutorial") === "") {
		setCookie("showTutorial", "true");
	}
	if (getCookie("showTutorial") === "true") {
		off.setAttribute("class", "btn btn-default");
		on.setAttribute("class", "btn btn-success disabled");
	} else {
		off.setAttribute("class", "btn btn-danger disabled");
		on.setAttribute("class", "btn btn-default");
	}

	if (getCookie("averageScore") === null) {
		setCookie("averageScore", 0);
	}
	if (getCookie("gamesPlayed") === null) {
		setCookie("gamesPlayed", 0);
	}
	if (getCookie("highScore") === null) {
		setCookie("highScore", 0);
	}
	average.innerHTML = "Average Score: "
			+ Math.round(parseFloat(getCookie("averageScore")) * 100) / 100;
	games.innerHTML = "Games Played: " + getCookie("gamesPlayed");
	high.innerHTML = "High Score: " + getCookie("highScore");
	label.innerHTML = "Username";
	textfield.setAttribute("value", getCookie("username"));
	formGroup.setAttribute("class", "form-group has-success");
}

function updateUsername() {
	var textfield = document.getElementById("usernameInput");
	var formGroup = document.getElementById("editUsernameFormGroup");
	var label = document.getElementById("usernameLabel");
	var name = textfield.value.toString();

	if (name.length <= 16 && name.length >= 4) {
		setCookie("username", name);
		btnEditUsername.innerHTML = "Username: " + getCookie("username");
		formGroup.setAttribute("class", "form-group has-success");
		label.innerHTML = "Username";
	} else if (name.length < 4) {
		formGroup.setAttribute("class", "form-group has-error");
		label.innerHTML = "Username - too short";
	} else if (name.length > 16) {
		formGroup.setAttribute("class", "form-group has-error");
		label.innerHTML = "Username - too long";
	}

}

function cancelEditUsername() {

	var textfield = document.getElementById("usernameInput");
	var formGroup = document.getElementById("editUsernameFormGroup");

	var name = textfield.value.toString();
	if (name.length <= 16 && name.length >= 4) {
		$('#editUsernameModal').modal('hide');
	}

}

function toggleTutorial() {
	var on = document.getElementById("tutorialOn");
	var off = document.getElementById("tutorialOff");
	if (getCookie("showTutorial") === "true") {
		setCookie("showTutorial", "false");
		off.setAttribute("class", "btn btn-danger disabled");
		on.setAttribute("class", "btn btn-default");
	} else {
		setCookie("showTutorial", "true");
		off.setAttribute("class", "btn btn-default");
		on.setAttribute("class", "btn btn-success disabled");
	}
}

var dots = {
	// game status
	gameOver : null,
	gameStarted : null,
	gamePaused : null,

	// game counters
	lives : null,
	score : null,
	highScore : 0,

	// game variables
	nextBubble : null,
	nextColor : null,
	entities : [],
	scoreWidth : null,
	highWidth : null,
	measureScore : null,
	measureHigh : null,
	audio: null,
	audio2: null,
	audio3: null,
	audio4: null,

	// canvas
	canvas : null,
	ctx : null,

	// canvas size
	RATIO : null,
	WIDTH : 1080,
	HEIGHT : 1755,
	currentWidth : null,
	currentHeight : null,
	scale : 1,
	offsetTop : 0,
	offsetLeft : 0,

	// device information
	device : null,
	android : null,
	ios : null,
	uuid : null,
	gamesPlayed : null,
	averageScore : null,
};

// init
dots.init = function() {
	// game status
	dots.gameOver = false;
	dots.gameStarted = false;
	dots.gamePaused = false;

	// game counters
	dots.lives = 1;
	dots.score = 0;
	if (getCookie("highScore") != "") {
		dots.highScore = parseInt(getCookie("highScore"));
	}

	// game variables
	dots.nextBubble = 120;
	dots.audio = new Audio('button-3.mp3');
	dots.audio2 = new Audio('button-11.wav');
	dots.audio3 = new Audio('button-2.wav');
	dots.nextColor = Math.round(Math.random() * 3);
	dots.scoreWidth = 0;
	dots.highWidth = 0;
	dots.measureScore = false;
	dots.measureHigh = false;
	if (getCookie("showTutorial") === "") {
		setCookie("showTutorial", "true");
	}
	// canvas
	dots.canvas = document.getElementById("myCanvas");
	dots.ctx = dots.canvas.getContext("2d");

	// canvas size
	dots.RATIO = dots.WIDTH / dots.HEIGHT;
	dots.currentWidth = dots.WIDTH;
	dots.currentHeight = dots.HEIGHT;
	dots.canvas.width = dots.currentWidth;
	dots.canvas.height = dots.HEIGHT;

	// device information
	dots.device = navigator.userAgent.toLowerCase();
	dots.android = dots.device.indexOf("android") > -1 ? true : false;
	dots.ios = (dots.device.indexOf("iphone") > -1 || dots.device
			.indexOf("ipad") > -1) ? true : false;
	if (getCookie("uuid") == "") {
		setCookie("uuid", makeId());
	}
	dots.uuid = getCookie("uuid");
	if (getCookie("gamesPlayed") == "") {
		setCookie("gamesPlayed", 0);
	}
	dots.gamesPlayed = getCookie("gamePlayed");
	if (getCookie("averageScore") == "") {
		setCookie("averageScore", 0);
	}
	dots.averageScore = getCookie("averageScore");

	// resize, create player and clear the screen
	dots.resize();
	player = new dots.player();
	dots.draw.clear();

	// start game loop
	dots.loop();
};
// resize
dots.resize = function() {
	dots.currentHeight = window.innerHeight - 50;
	dots.currentWidth = dots.currentHeight * dots.RATIO;

	dots.canvas.style.width = dots.currentWidth + 1 + "px";
	dots.canvas.style.height = dots.currentHeight + "px";
	dots.scale = dots.currentHeight / dots.HEIGHT;
	dots.offsetLeft = dots.canvas.offsetLeft;
	dots.offsetTop = dots.canvas.offsetTop;
	window.setTimeout(function() {
		window.scrollTo(0, 1);
	}, 1);
};
// update
dots.update = function() {
	var i;
	dots.nextBubble -= 1;
	if (dots.gameStarted) {
		player.update();
		if (dots.nextBubble < 0) {
			var color = 'white';
			switch (dots.nextColor) {
			case 0:
				color = '#62C462';
				break;
			case 1:
				color = '#57BEDD';
				break;
			case 2:
				color = '#ED5753';
				break;
			case 3:
				color = '#EE8E06';
				break;
			}
			dots.nextColor += 1;
			if (dots.nextColor > 3) {
				dots.nextColor = 0;
			}
			switch (Math.round(Math.random() * 3)) {
			case 0:
				dots.entities.push(new dots.bubbleRight(color));
				break;
			case 1:
				dots.entities.push(new dots.bubbleLeft(color));
				break;
			case 2:
				dots.entities.push(new dots.bubbleUp(color));
				break;
			case 3:
				dots.entities.push(new dots.bubbleDown(color));
				break;
			}

			dots.nextBubble = (Math.random() * 60) + 10;
		}

		for (i = 0; i < dots.entities.length; i += 1) {
			dots.entities[i].update();
			dots.input.tapped = false;
			if (dots.entities[i].type === 'bubble') {
				var hit = dots.collides(dots.entities[i], {
					x : player.x,
					y : player.y,
					r : 35
				});
			}
			if (hit) {
				dots.lives -= 1;
				if (dots.lives <= 0) {
					dots.gameOver = true;
				}
				dots.entities[i].remove = true;
				hit = false;
				for ( var j = 0; j < 30; j += 1) {
					var size = (Math.random() * 5) + 1;
					dots.entities.push(new dots.explodeParticle(
							dots.entities[i].x, dots.entities[i].y, size, size,
							dots.entities[i].color));
				}
			}

			if (dots.entities[i].remove) {
				dots.entities.splice(i, 1);
			}
		}
	} else {
		if (dots.nextBubble < 0) {
			dots.gameStarted = true;
			dots.nextBubble = 50;
		}
	}
};
// render
dots.render = function() {
	dots.draw.clear();
	if (dots.gameStarted) {
		player.render();
		var i;
		for (i = 0; i < dots.entities.length; i += 1) {
			dots.entities[i].render();
		}
	} else {
		addDotsListeners();
		player.render();
		if (dots.nextBubble > 40) {
			// numbers
			dots.draw.text(Math.round(dots.nextBubble / 40),
					(dots.WIDTH / 2) - 30, ((dots.HEIGHT) / 4), 90, '#fff');
			if (getCookie("showTutorial") === "true") {
				dots.draw.rect((dots.WIDTH / 2) + 1, 0, 2, dots.HEIGHT,
						'#7E858B');
				// score
				dots.draw.handText("Score", (dots.WIDTH / 2) - 50,
						(dots.HEIGHT / 14) + 100, 60, 'white');
				dots.draw.arrowText('p', (dots.WIDTH / 2) - 90,
						(dots.HEIGHT / 14) + 85, 100, 'white');
				// high score
				dots.draw.handText("High Score", 25, (dots.HEIGHT / 14) + 150,
						60, 'white');
				dots.draw.arrowText('r', 20, (dots.HEIGHT / 14) + 75, 100,
						'white');
				// instructions
				dots.draw.handText("jump left", 100, (dots.HEIGHT / 2), 60,
						'white');
				dots.draw.handText("jump right", dots.WIDTH - 350,
						(dots.HEIGHT / 2), 60, 'white');
				// player
				dots.draw.arrowText('S', (dots.WIDTH / 2) - 130,
						(dots.HEIGHT / 2) + 70, 100, 'white');
				dots.draw.handText("me", (dots.WIDTH / 2) - 130,
						(dots.HEIGHT / 2) + 120, 60, 'white');
				// jump boosts
				dots.draw.arrowText('I', 30, dots.HEIGHT - 40, 100, 'white');
				dots.draw.handText("jump boost", 70, dots.HEIGHT - 30, 60,
						'white');
			}
		} else if (dots.nextBubble < 49) {
			dots.nextBubble = 0;
		}
	}
	// corner boosts
	// bottom left
	dots.draw.rect(0, dots.HEIGHT - 10, 70, 10, '#62C462');
	dots.draw.rect(0, dots.HEIGHT - 70, 10, 70, '#62C462');
	// bottom right
	dots.draw.rect(dots.WIDTH - 70, dots.HEIGHT - 10, 70, 10, '#62C462');
	dots.draw.rect(dots.WIDTH - 10, dots.HEIGHT - 70, 10, 70, '#62C462');

	dots.draw.rect(0, 0, dots.WIDTH, (dots.HEIGHT) / 14, 'black');
	dots.draw.circle(dots.WIDTH / 2, 58, 60, 'white');
	dots.measureScore = true;
	dots.draw.text(dots.score, (dots.WIDTH / 2) - (dots.scoreWidth / 2), 85,
			50, '#000');
	dots.measureScore = false;
	dots.draw.circle(61, 58, 60, 'white');
	dots.measureHigh = true;
	dots.draw.text(dots.highScore, (dots.highWidth / 2) + 15, 85, 50, 'black');
	dots.measureHigh = false;

	// Center cross
	// dots.draw.rect((dots.WIDTH / 2) + 1, 0, 2, dots.HEIGHT, '#7E858B');
	// dots.draw.rect(0, (dots.HEIGHT / 2) - 1, dots.WIDTH, 2, '#7E858B');

	if (dots.gamePaused) {
		dots.draw.triangle(dots.WIDTH - 50, 60, 40, '#fff');
	} else {
		dots.draw.rect(dots.WIDTH - 60, 30, 20, 70, '#fff');
		dots.draw.rect(dots.WIDTH - 100, 30, 20, 70, '#fff');
	}
};
// loop
dots.loop = function() {
	if (!dots.gameOver) {
		dots.requestId = window.requestAnimationFrame(dots.loop);
		// setTimeout(dots.loop, 17);
	}
	if (!dots.gamePaused) {
		dots.update();
		dots.render();

		if (dots.gameOver) {
			for ( var i = 0; i < dots.entities.length; i += 0) {
				dots.entities[i].remove = true;
				dots.entities.splice(i, 1);
			}
			// navigator.notification.alert("Score: ", stopdots(), "dots",
			// "Ok");
			document.getElementById("scoreHeading").innerHTML = "Score: "
					+ dots.score;
			document.getElementById("highScoreHeading").innerHTML = "High Score: "
					+ dots.highScore;
			
			$('#gameOverModal').modal({
				backdrop : 'static',
				keyboard : false
			});
			$('#gameOverModal').modal('show');
			
		}
	}
};
// draw
dots.draw = {
	clear : function() {
		dots.ctx.clearRect(0, 0, dots.WIDTH, dots.HEIGHT);
		// dots.draw.rect(0,0, dots.currentWidth,dots.currentHeight ,
		// 'black');
	},
	rect : function(x, y, width, height, color) {
		dots.ctx.fillStyle = color;
		dots.ctx.fillRect(x, y, width, height);
	},
	circle : function(x, y, radius, color) {
		dots.ctx.fillStyle = color;
		dots.ctx.beginPath();
		dots.ctx.arc(x + 5, y + 5, radius, 0, Math.PI * 2, true);
		dots.ctx.closePath();
		dots.ctx.fill();
	},
	triangle : function(x, y, a, color) {
		dots.ctx.fillStyle = color;
		dots.ctx.beginPath();
		dots.ctx.moveTo(x, y);
		dots.ctx.lineTo(x - a, y - a);
		dots.ctx.lineTo(x - a, y + a);
		dots.ctx.lineTo(x, y);
		dots.ctx.fill();
	},
	text : function(string, x, y, size, color) {
		dots.ctx.font = "bold " + size + "px Exo";
		if (dots.measureScore === true) {
			dots.scoreWidth = dots.ctx.measureText(string).width;
		}
		if (dots.measureHigh === true) {
			dots.highWidth = dots.ctx.measureText(string).width;
		}
		dots.ctx.fillStyle = color;
		dots.ctx.fillText(string, x, y);
	},
	handText : function(string, x, y, size, color) {
		dots.ctx.font = "bold " + size + "px Hand";
		dots.ctx.fillStyle = color;
		dots.ctx.fillText(string, x, y);
	},
	arrowText : function(string, x, y, size, color) {
		dots.ctx.font = "bold " + size + "px Arrow";
		dots.ctx.fillStyle = color;
		dots.ctx.fillText(string, x, y);
	}
};
// input
dots.input = {
	x : 0,
	y : 0,
	tapped : false,

	set : function(data) {
		this.x = (data.pageX - dots.offsetLeft) / dots.scale;
		this.y = (data.pageY - dots.offsetTop) / dots.scale;
		this.tapped = true;
		if (dots.input.y < (dots.HEIGHT) / 14 && dots.input.tapped) {
			if (dots.gamePaused) {
				this.tapped = false;
				resumeDots();
			} else {
				this.tapped = false;
				pauseDots();
			}

		} else if (!dots.gameStarted) {
			this.tapped = false;
			if (dots.input.y < (dots.HEIGHT) / 14 && dots.input.tapped) {
				if (dots.gamePaused) {
					this.tapped = false;
					resumeDots();
				} else {
					this.tapped = false;
					pauseDots();
				}
			}
		}
	}
};
// collides
dots.collides = function(a, b) {
	// distance formula ( (x1-x2)^2 - (y1-y2)^2 )^(1/2)
	var distanceSquared = (((a.x - b.x) * (a.x - b.x)) + ((a.y - b.y) * (a.y - b.y)));
	var radiiSquared = (a.r + b.r) * (a.r + b.r);

	if (distanceSquared < radiiSquared) {
		return true;
	} else {
		return false;
	}
};

// ENTITIES
dots.player = function() {
	this.type = 'player';
	this.speed;
	this.r = 35;
	this.x = dots.WIDTH / 2;
	this.y = dots.HEIGHT / 2;
	this.vx = (Math.random() * 2 > 1) ? 1 : -1;
	this.vy = -15;
	this.color = '#9C27B0';
	this.remove = false;
	this.firstMove = false;

	this.update = function() {
		if (dots.input.tapped) {
			dots.audio.play();
			if (this.vy > 10) {
				this.vy = -13;
			} else {
				this.vy = -20;
			}
			dots.input.tapped = false;
			if (dots.input.x < dots.WIDTH / 2) {
				this.vx = -10;
			} else if (dots.input.x > (dots.WIDTH / 2)) {
				this.vx = 10;
			}
			for ( var i = 0; i < 5; i += 1) {
				dots.entities.push(new dots.thrustParticle(this.x, this.y,
						this.color, this.vx, this.vy));
			}
		}
		// right
		if (this.x > dots.WIDTH - (this.r + 4)) {
			this.x = dots.WIDTH - (this.r + 4);
			this.vx = (-9 / 10) * (this.vx);
			dots.audio2.play();
		}
		// left
		else if (this.x < this.r) {
			this.x = this.r;
			this.vx = (-9 / 10) * (this.vx);
			dots.audio2.play();
		}
		// top
		else if (this.y < this.r + ((1 / 14) * dots.HEIGHT)) {
			this.y = this.r + 1 + ((1 / 14) * (dots.HEIGHT));
			this.vy = (-6 / 10) * (this.vy);
			dots.audio2.play();

		}
		// bottom
		else if (this.y > (dots.HEIGHT) - (this.r + 4)) {
			// console.log("here");
			var i = 0;
			if (this.x <= 70 || this.x >= dots.WIDTH - 70) {
				this.vy = 45;
				dots.audio3.play();
				i = 1;
			}
			if (i === 0) {
				dots.audio2.play();
			}
			this.y = dots.HEIGHT - (this.r + 4);
			this.vy = (-6 / 10) * (this.vy);
			this.vx = (95 / 100) * this.vx;
			if (Math.abs(this.vx) < .5) {
				this.vx = 0;
			}
			if (Math.abs(this.vx) < .5) {
				this.vy = 0;
			}
		} else {
			this.vy += .7;
		}
		this.y += this.vy;
		this.x += this.vx;
	}

	this.render = function() {
		dots.draw.circle(this.x, this.y, this.r, this.color);
	}

}
// bubbleUp
dots.bubbleUp = function(color) {
	this.type = 'bubble';
	this.speed = (Math.random() * 12) + 10;
	this.r = (Math.random() * 45) + 75;
	this.waveSize = (Math.random() * 7) + 6 + this.r;
	this.x = (Math.random() * (dots.WIDTH - (2 * this.r) - (2 * this.waveSize)))
			+ ((this.waveSize) + (this.r));
	this.xConstant = this.x;
	this.y = dots.HEIGHT + (this.r * 2) + 5;
	this.color = color;

	this.remove = false;
	this.offScreen = false;

	this.update = function() {
		var time = new Date().getTime() * 0.003;
		this.y -= this.speed;
		this.x = (this.waveSize * Math.sin(time)) + this.xConstant;
		if (this.y < (-2 * this.r) - 5 && !this.offScreen) {
			this.remove = true;
			this.offScreen = true;
			dots.score += 1;
			if (dots.score > dots.highScore) {
				dots.highScore = dots.score;
			}
		}
	};

	this.render = function() {
		dots.draw.circle(this.x, this.y, this.r, this.color);
	};
};
// bubbleDown
dots.bubbleDown = function(color) {
	this.type = 'bubble';
	this.speed = (Math.random() * 12) + 10;
	this.r = (Math.random() * 60) + 70;
	this.waveSize = (Math.random() * 7) + 6 + this.r;
	this.x = (Math.random() * (dots.WIDTH - (2 * this.r) - (2 * this.waveSize)))
			+ ((this.waveSize) + (this.r));
	this.xConstant = this.x;
	this.y = -(this.r * 2) - 5;
	this.color = color;

	this.remove = false;
	this.offScreen = false;

	this.update = function() {
		var time = new Date().getTime() * 0.003;
		this.y += this.speed;
		this.x = (this.waveSize * Math.sin(time)) + this.xConstant;
		if (this.y > dots.HEIGHT + (2 * this.r) + 5 && !this.offScreen) {
			this.remove = true;
			this.offScreen = true;
			dots.score += 1;
			if (dots.score > dots.highScore) {
				dots.highScore = dots.score;
			}
		}
	};

	this.render = function() {
		dots.draw.circle(this.x, this.y, this.r, this.color);
	};
};
// bubbleRight
dots.bubbleRight = function(color) {
	this.type = 'bubble';
	this.speed = (Math.random() * 12) + 10;
	this.r = (Math.random() * 60) + 70;
	this.waveSize = (Math.random() * 7) + 6 + this.r;
	this.y = (Math.random() * ((10 / 14) * (dots.HEIGHT) - (2 * this.r) - (2 * this.waveSize)))
			+ ((this.waveSize) + (this.r) + ((dots.HEIGHT) / 14));
	this.yConstant = this.y;
	this.x = -(2 * this.r) - 5;
	this.color = color;

	this.offScreen = false;
	this.remove = false;

	this.update = function() {
		var time = new Date().getTime() * 0.003;
		this.x += this.speed;
		this.y = (this.waveSize * Math.sin(time)) + this.yConstant;
		if (this.x > dots.WIDTH + (2 * this.r) + 5 && !this.offScreen) {
			this.offScreen = true;
			this.remove = true;
			dots.score += 1;
			if (dots.score > dots.highScore) {
				dots.highScore = dots.score;
			}
		}
	};

	this.render = function() {
		dots.draw.circle(this.x, this.y, this.r, this.color);
	};
};
// bubbleLeft
dots.bubbleLeft = function(color) {
	this.type = 'bubble';
	this.speed = (Math.random() * 12) + 10;
	this.r = (Math.random() * 60) + 70;
	this.waveSize = (Math.random() * 7) + 6 + this.r;
	this.y = (Math.random() * ((10 / 14) * (dots.HEIGHT) - (2 * this.r) - (2 * this.waveSize)))
			+ ((this.waveSize) + (this.r) + ((dots.HEIGHT) / 14));
	this.yConstant = this.y;
	this.x = dots.WIDTH + (2 * this.r) + 5;
	this.color = color;

	this.remove = false;
	this.offScreen = false;

	this.update = function() {
		var time = new Date().getTime() * 0.003;
		this.x -= this.speed;
		this.y = (this.waveSize * Math.sin(time)) + this.yConstant;
		if (this.x < (-2 * this.r) - 5 && !this.offScreen) {
			this.remove = true;
			this.offScreen = true;
			dots.score += 1;
			if (dots.score > dots.highScore) {
				dots.highScore = dots.score;
			}
		}
	};

	this.render = function() {
		dots.draw.circle(this.x, this.y, this.r, this.color);
	};
};
// thrust particle
dots.thrustParticle = function(x, y, color, dirX, dirY) {
	this.x = x;
	this.y = y;
	this.width = (Math.random() * 10) + 10;
	this.height = (Math.random() * 10) + 10;
	this.color = color;
	this.opacity = 1;
	this.fade = (Math.random() * 0.05) + 0.05;

	this.waveSize = (Math.random() * 2.25);
	this.dirX = -1 * dirX;
	this.dirY = -1 * dirY;
	this.vx = ~~(Math.random() * 1) * this.dirX;
	this.vy = ~~(Math.random() * 3) * this.dirY;

	this.remove = false;

	this.update = function() {
		var time = new Date().getTime() * 0.002;
		this.x += (this.waveSize * Math.sin(time)) + this.vx;
		// this.x = this.vx;
		this.y += (this.waveSize * Math.sin(time)) + this.vy;
		this.opacity -= this.fade;
		this.remove = (this.opacity < 0) ? true : false;
	};

	this.render = function() {
		dots.draw.rect(this.x, this.y, this.width, this.height, this.color);
	};
};
// explode particle (has not been converted to 1080p)
dots.explodeParticle = function(x, y, width, height, color) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.color = color;
	this.opacity = 1;
	this.fade = (Math.random() * 0.05) + 0.01;

	this.waveSize = (Math.random() * 2);
	this.dirX = (Math.random() * 2 > 1) ? 1 : -1;
	this.dirY = (Math.random() * 2 > 1) ? 1 : -1;
	this.vx = ~~(Math.random() * 4) * this.dirX;
	this.vy = ~~(Math.random() * 4) * this.dirY;

	this.remove = false;

	this.update = function() {
		var time = new Date().getTime() * 0.002;
		this.x += (this.waveSize * Math.sin(time)) + this.vx;
		// this.x = this.vx;
		this.y += (this.waveSize * Math.sin(time)) + this.vy;
		this.opacity -= this.fade;
		this.remove = (this.opacity < 0) ? true : false;
	};

	this.render = function() {
		dots.draw.rect(this.x, this.y, this.width, this.height, this.color);
	};
};