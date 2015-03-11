/*
 * Please see the included README.md file for license terms and conditions.
 */

/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false app:false, dev:false, cordova:false */

var hidden, visibilityChange; 
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof document.mozHidden !== "undefined") {
  hidden = "mozHidden";
  visibilityChange = "mozvisibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}

Cocoon.Ad.banner.on("shown" , function(){
    console.log("Banner shown!");
});
Cocoon.Ad.banner.on("ready" , function(){
    Cocoon.Ad.setBannerLayout(Cocoon.Ad.BannerLayout.BOTTOM_CENTER);
    Cocoon.Ad.showBanner();
});
Cocoon.Ad.banner.on("hidden" , function(){
    console.log("Banner hidden!");
});

function gameClickEvent(event) {
	if (!dots.gameOver) {
		dots.input.set(event);
	}
}

function gameTouchEvent(event) {
	if (!dots.gameOver) {
		dots.input.set(event.touches[0]);
	}
}

function addDotsListeners() {
	window.addEventListener("resize", dots.resize, false);
	if (dots.android || dots.ios) {
		window.addEventListener("touchstart", gameTouchEvent, false);
	} else {
		window.addEventListener("click", gameClickEvent, false);
	}
	document.addEventListener(visibilityChange, handleVisibilityChange, false);
    
}

function removeDotsListeners() {
	if (dots.android || dots.ios) {
		window.removeEventListener("touchstart", gameTouchEvent, false);
	} else {
		window.removeEventListener("click", gameClickEvent, false);
	}
	document.removeEventListener(visibilityChange, handleVisibilityChange, false);
}

function addHomeListeners() {
	window.addEventListener("DOMContentLoaded", function(e) {
		FastClick.attach(document.body);
	}, false);
	window.addEventListener("touchstart", function(e) {
		e.preventDefualt();
	}, false);
	window.addEventListener("touchmove", function(e) {
		e.preventDefault();
	}, false);
}

function handleVisibilityChange() {
	if (document[hidden]) {
	    pauseDots();
	}
}
