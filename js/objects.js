/*
 * Please see the included README.md file for license terms and conditions.
 */

/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false app:false, dev:false, cordova:false */
var btnPressed;
var body;
var mainPage, leadPage, btnGroup, btnPlay, btnSettings, btnStats, btnBack;
var canvas;
var btnPlayText, btnSettingsText, btnStatsText;
var table, tableHead, tableBody, trh, tr1, tr2, tr3, tr4, tr5, tr6, tr7,
tr8, tr9, tr10, thN, thU, thS, trY, tdNY, tdUY, tdUS;
var tdN1, tdU1, tdS1, tdN2, tdU2, tdS2, tdN3, tdU3, tdS3, 
tdN4, tdU4, tdS4, tdN5, tdU5, tdS5, tdN6, tdU6, tdS6, tdN7, tdU7,
tdS7, tdN8, tdU8, tdS8, tdN9, tdU9, tdS9, tdN10, tdU10, tdS10;
var allBtn, dayBtn, weekBtn, monthBtn, statBtnGroup, tableDiv, backDiv;
//var audioId;

function createObjects() {
	//audioId = document.createElement("audio");
	//audioId.setAttribute("id", "audiotag1");
	//audioId.setAttribute("src", "www/button-3.wav");
	//audioId.setAttribute("preload", "auto");
	// Main Elements
	body = document.getElementById("body");
	
	// starup DOM
	mainPage = document.createElement("div");
	leadPage = document.createElement("div");
	tableDiv = document.createElement("div");
	table = document.createElement("table");
	tableHead = document.createElement("thead")
	tableBody = document.createElement("tbody");
	trh = document.createElement("tr");
	trY = document.createElement("tr");
	tr1 = document.createElement("tr");
	tr2 = document.createElement("tr");
	tr3 = document.createElement("tr");
	tr4 = document.createElement("tr");
	tr5 = document.createElement("tr");
	tr6 = document.createElement("tr");
	tr7 = document.createElement("tr");
	tr8 = document.createElement("tr");
	tr9 = document.createElement("tr");
	tr10 = document.createElement("tr");
	thN = document.createElement("th");
	thU = document.createElement("th");
	thS = document.createElement("th");
	tdNY = document.createElement("td");
	tdUY = document.createElement("td");
	tdSY = document.createElement("td");
	tdN1 = document.createElement("td");
	tdU1 = document.createElement("td");
	tdS1 = document.createElement("td");
	tdN2 = document.createElement("td");
	tdU2 = document.createElement("td");
	tdS2 = document.createElement("td");
	tdN3 = document.createElement("td");
	tdU3 = document.createElement("td");
	tdS3 = document.createElement("td");
	tdN4 = document.createElement("td");
	tdU4 = document.createElement("td");
	tdS4 = document.createElement("td");
	tdN5 = document.createElement("td");
	tdU5 = document.createElement("td");
	tdS5 = document.createElement("td");
	tdN6 = document.createElement("td");
	tdU6 = document.createElement("td");
	tdS6 = document.createElement("td");
	tdN7 = document.createElement("td");
	tdU7 = document.createElement("td");
	tdS7 = document.createElement("td");
	tdN8 = document.createElement("td");
	tdU8 = document.createElement("td");
	tdS8 = document.createElement("td");
	tdN9 = document.createElement("td");
	tdU9 = document.createElement("td");
	tdS9 = document.createElement("td");
	tdN10 = document.createElement("td");
	tdU10 = document.createElement("td");
	tdS10 = document.createElement("td");
	
	usernameGroup = document.createElement("div");
	backDiv = document.createElement("div");
	btnEditUsername = document.createElement("button");
	btnBack = document.createElement("button");
	title = document.createElement("h1");
	btnGroup = document.createElement("div");
	statBtnGroup = document.createElement("div");
	leadPage = document.createElement("div");
	btnPlay = document.createElement("button");
	btnStats = document.createElement("button");
	allBtn = document.createElement("button");
	dayBtn = document.createElement("button");
	weekBtn = document.createElement("button");
	monthBtn = document.createElement("button");
	// game DOM
	gamePage = document.createElement("div");
	canvas = document.createElement("canvas");
	// TODO add ad DOM

	// DOM id's
	mainPage.setAttribute("id", "mainpage");
	leadPage.setAttribute("id", "leadpage");
	usernameGroup.setAttribute("id", "usernameGroup");
	backDiv.setAttribute("id", "usernameGroup");
	btnEditUsername.setAttribute("id", "btnEditUsername");
	title.setAttribute("id", "title");
	btnGroup.setAttribute("id", "btnGroup");
	btnBack.setAttribute("id", "btnBack");
	statBtnGroup.setAttribute("id", "statBtnGroup");
	tableDiv.setAttribute("id", "tablediv");
	table.setAttribute("id", "table");
	tableHead.setAttribute("id", "tablehead");
	tableBody.setAttribute("id", "tableBody");
	btnPlay.setAttribute("id", "btnPlay");
	btnStats.setAttribute("id", "btnStats");
	gamePage.setAttribute("id", "gamePage");
	canvas.setAttribute("id", "myCanvas");
	allBtn.setAttribute("id", "allbtn");
	dayBtn.setAttribute("id", "daybtn");
	weekBtn.setAttribute("id", "weekbtn");
	monthBtn.setAttribute("id", "monthbtn");

	usernameGroup.setAttribute("class", "btn-group");
	backDiv.setAttribute("class", "btn-group");
	mainPage.setAttribute("class", "upage vertical-col left");
	leadPage.setAttribute("class", "upage vertical-col left");
	btnEditUsername.setAttribute("class", "btn btn-default");
	btnGroup.setAttribute("class", "btn-group");
	statBtnGroup.setAttribute("class", "btn-group");
	btnPlay.setAttribute("class", "btn btn-default");
	allBtn.setAttribute("class", "btn btn-default");
	dayBtn.setAttribute("class", "btn btn-default");
	weekBtn.setAttribute("class", "btn btn-default");
	btnBack.setAttribute("class", "btn btn-default");
	monthBtn.setAttribute("class", "btn btn-default");
	btnStats.setAttribute("class", "btn btn-default");
	table.setAttribute("class", "table table-striped  ");
	trY.setAttribute("class", "info");
	trh.setAttribute("class", "success");
	
	tr1.setAttribute("class", "active");
	tr3.setAttribute("class", "active");
	tr5.setAttribute("class", "active");
	tr7.setAttribute("class", "active");
	tr9.setAttribute("class", "active");
	

	// btnGroup.setAttribute("data-uib", "twitter%20bootstrap/button_group");
	// btnPlay.setAttribute("data-uib", "twitter%20bootstrap/button");
	// btnStats.setAttribute("data-uib", "twitter%20bootstrap/button");
	
	allBtn.appendChild(document.createTextNode("All Time"));
	dayBtn.appendChild(document.createTextNode("Daily"));
	weekBtn.appendChild(document.createTextNode("Weekly"));
	monthBtn.appendChild(document.createTextNode("Monthly"));
	
	//Table creation
	thN.appendChild(document.createTextNode("#"));
	thU.appendChild(document.createTextNode("UserName"));
	thS.appendChild(document.createTextNode("Score"));
	trh.appendChild(thN);
	trh.appendChild(thU);
	trh.appendChild(thS);
	tableHead.appendChild(trh);
	tdNY.appendChild(document.createTextNode("..."));
	tdUY.appendChild(document.createTextNode("This is you"));
	tdSY.appendChild(document.createTextNode("12"));
	trY.appendChild(tdNY);
	trY.appendChild(tdUY);
	trY.appendChild(tdSY);
	tableBody.appendChild(trY);
	tdN1.appendChild(document.createTextNode("1"));
	tdU1.appendChild(document.createTextNode("Traver Clifford"));
	tdS1.appendChild(document.createTextNode("1023"));
	tr1.appendChild(tdN1);
	tr1.appendChild(tdU1);
	tr1.appendChild(tdS1);
	tableBody.appendChild(tr1);
	tdN2.appendChild(document.createTextNode("2"));
	tdU2.appendChild(document.createTextNode("Bob"));
	tdS2.appendChild(document.createTextNode("34"));
	tr2.appendChild(tdN2);
	tr2.appendChild(tdU2);
	tr2.appendChild(tdS2);
	tableBody.appendChild(tr2);
	tdN3.appendChild(document.createTextNode("3"));
	tdU3.appendChild(document.createTextNode("Andy"));
	tdS3.appendChild(document.createTextNode("25"));
	tr3.appendChild(tdN3);
	tr3.appendChild(tdU3);
	tr3.appendChild(tdS3);
	tableBody.appendChild(tr3);
	tdN4.appendChild(document.createTextNode("4"));
	tdU4.appendChild(document.createTextNode("Todd"));
	tdS4.appendChild(document.createTextNode("16"));
	tr4.appendChild(tdN4);
	tr4.appendChild(tdU4);
	tr4.appendChild(tdS4);
	tableBody.appendChild(tr4);
	tdN5.appendChild(document.createTextNode("5"));
	tdU5.appendChild(document.createTextNode("Ethan"));
	tdS5.appendChild(document.createTextNode("14"));
	tr5.appendChild(tdN5);
	tr5.appendChild(tdU5);
	tr5.appendChild(tdS5);
	tableBody.appendChild(tr5);
	tdN6.appendChild(document.createTextNode("6"));
	tdU6.appendChild(document.createTextNode("Bill"));
	tdS6.appendChild(document.createTextNode("11"));
	tr6.appendChild(tdN6);
	tr6.appendChild(tdU6);
	tr6.appendChild(tdS6);
	tableBody.appendChild(tr6);
	tdN7.appendChild(document.createTextNode("7"));
	tdU7.appendChild(document.createTextNode("Tom"));
	tdS7.appendChild(document.createTextNode("8"));
	tr7.appendChild(tdN7);
	tr7.appendChild(tdU7);
	tr7.appendChild(tdS7);
	tableBody.appendChild(tr7);
	tdN8.appendChild(document.createTextNode("8"));
	tdU8.appendChild(document.createTextNode("Gil"));
	tdS8.appendChild(document.createTextNode("7"));
	tr8.appendChild(tdN8);
	tr8.appendChild(tdU8);
	tr8.appendChild(tdS8);
	tableBody.appendChild(tr8);
	tdN9.appendChild(document.createTextNode("9"));
	tdU9.appendChild(document.createTextNode("Hank"));
	tdS9.appendChild(document.createTextNode("5"));
	tr9.appendChild(tdN9);
	tr9.appendChild(tdU9);
	tr9.appendChild(tdS9);
	tableBody.appendChild(tr9);
	tdN10.appendChild(document.createTextNode("10"));
	tdU10.appendChild(document.createTextNode("Harry"));
	tdS10.appendChild(document.createTextNode("0"));
	tr10.appendChild(tdN10);
	tr10.appendChild(tdU10);
	tr10.appendChild(tdS10);
	tableBody.appendChild(tr10);
	
	btnPlay.setAttribute("onclick", "playDots");
	btnStats.setAttribute("onclick", "openStats()");
	btnBack.setAttribute("onclick", "goBack()");
	btnEditUsername.setAttribute("onClick", "editUsername");

	btnPlay.setAttribute("onclick", "playDots()");
	btnStats.setAttribute("onclick", "openStats()");
	btnBack.setAttribute("onclick", "goBack()");
	btnEditUsername.setAttribute("onClick", "editUsername()");
	btnBack.appendChild(document.createTextNode("Back"));

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
//	btnGroup.appendChild(btnStats);

	btnPlay.appendChild(btnPlayText);
//	btnStats.appendChild(btnStatsText);

	mainPage.appendChild(usernameGroup);
	mainPage.appendChild(title);
	mainPage.appendChild(btnGroup);
	body.appendChild(mainPage);
}
function createLeadPage() {
	backDiv.appendChild(btnBack);
	leadPage.appendChild(backDiv);
	statBtnGroup.appendChild(allBtn);
	statBtnGroup.appendChild(dayBtn);
	statBtnGroup.appendChild(weekBtn);
	statBtnGroup.appendChild(monthBtn);
	leadPage.appendChild(statBtnGroup);
	table.appendChild(tableHead);
	table.appendChild(tableBody);
	tableDiv.appendChild(table);
	leadPage.appendChild(tableDiv);
	body.appendChild(leadPage);
}
function createCanvas() {
	body.appendChild(canvas);
}
function removeStartMenu() {
	body.removeChild(mainPage);
}
function removeLeadPage() {
	body.removeChild(leadPage);
}
function removeCanvas() {
	body.removeChild(canvas);
}
