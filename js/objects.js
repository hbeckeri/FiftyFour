/*
 * Please see the included README.md file for license terms and conditions.
 */

/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false app:false, dev:false, cordova:false */
var btnPressed;
var body;
var mainPage, btnGroup, btnPlay, btnSettings, btnStats;
var canvas;
var btnPlayText, btnSettingsText, btnStatsText;

function createObjects() {
	// Main Elements
	body = document.getElementById("body");
	// starup DOM
	mainPage = document.createElement("div");
	usernameGroup = document.createElement("div");
	btnEditUsername = document.createElement("button");
	title = document.createElement("h1");
	btnGroup = document.createElement("div");
	btnPlay = document.createElement("button");
	btnStats = document.createElement("button");
	// game DOM
	gamePage = document.createElement("div");
	canvas = document.createElement("canvas");

	// DOM id's
	mainPage.setAttribute("id", "mainpage");
	usernameGroup.setAttribute("id", "usernameGroup");
	btnEditUsername.setAttribute("id", "btnEditUsername");
	title.setAttribute("id", "title");
	btnGroup.setAttribute("id", "btnGroup");
	btnPlay.setAttribute("id", "btnPlay");
	btnStats.setAttribute("id", "btnStats");
	gamePage.setAttribute("id", "gamePage");
	canvas.setAttribute("id", "myCanvas");

	usernameGroup.setAttribute("class", "btn-group");
	mainPage.setAttribute("class", "upage vertical-col left");
	btnEditUsername.setAttribute("class", "btn btn-default");
	btnGroup.setAttribute("class", "btn-group");
	btnPlay.setAttribute("class", "btn btn-default");
	btnStats.setAttribute("class", "btn btn-default");

	// btnGroup.setAttribute("data-uib", "twitter%20bootstrap/button_group");
	// btnPlay.setAttribute("data-uib", "twitter%20bootstrap/button");
	// btnStats.setAttribute("data-uib", "twitter%20bootstrap/button");

	btnPlay.setAttribute("onclick", "playDots()");
	btnEditUsername.setAttribute("onClick", "editUsername()");

	btnEditUsernameText = document.createElement("i");
	btnPlayText = document.createElement("i");
	btnStatsText = document.createElement("i");

	//btnEditUsernameText.setAttribute("class", "glyphicon glyphicon-edit");
	btnPlayText.setAttribute("class", "glyphicon glyphicon-play");
	btnStatsText.setAttribute("class", "glyphicon glyphicon-signal");

	btnPlayText.setAttribute("data-position", "icon only");
	btnStatsText.setAttribute("data-position", "icon only");

	title.innerHTML = "FiftyFour";
	if (getCookie("username") == "") {
		var randName = "player" + Math.round(((Math.random() * 1000000) + 1)).toString();
		setCookie("username", randName, 365);
	}
	btnEditUsername.innerHTML = "Username: " + getCookie("username");
}
function createStartMenu() {
	usernameGroup.appendChild(btnEditUsername);
	//btnEditUsername.appendChild(btnEditUsernameText);

	btnGroup.appendChild(btnPlay);
	btnGroup.appendChild(btnStats);

	btnPlay.appendChild(btnPlayText);
	btnStats.appendChild(btnStatsText);

	mainPage.appendChild(usernameGroup);
	mainPage.appendChild(title);
	mainPage.appendChild(btnGroup);
	body.appendChild(mainPage);
}
function createCanvas() {
	body.appendChild(canvas);
}
function removeStartMenu() {
	body.removeChild(mainPage);
}
function removeCanvas() {
	body.removeChild(canvas);
}