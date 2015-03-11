function setCookie(cname, cvalue, exdays) {
	localStorage.setItem(cname, cvalue);
}

function getCookie(cname) {
    if (localStorage.getItem(cname) === null) {
    	return "";
    }
    return localStorage.getItem(cname);
}
