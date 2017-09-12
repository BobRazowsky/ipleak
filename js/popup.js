var apiKey = "AIzaSyAjVDotm8EmgZNby4xSEDxcf5oHh4OmNik";

window.browser = (function () {
	return window.msBrowser ||
		window.browser ||
		window.chrome;
})();

function getJSON(url, callback){
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.onload = function(){
		if(request.status >= 200 && request.status < 400){

			var data = JSON.parse(request.responseText);
			callback(data, request);
		}
	};
	request.onerror = function() {};
	request.send();
}

function getData() {
	/*getJSON("https://ipleak.net/json", function(data) {
		console.log(data);
		document.getElementById("ip").innerHTML = data.ip;
		document.getElementById("country").innerHTML = data.country_code + " / " + data.country_name;
		createMap({"lo" : data.longitude, "la" : data.latitude, "country" : data.country_name});
		//initMap();
		browser.browserAction.setBadgeText({text: data.country_code});
	});*/

	getJSON("http://ip-api.com/json", function(data) {
		console.log(data);
		document.getElementById("ip").innerHTML = data.query;
		document.getElementById("country").innerHTML = data.countryCode + " / " + data.country;
		document.getElementById("isp").innerHTML = data.isp;
		createMap({"lo" : data.lon, "la" : data.lat, "country" : data.country});
		//initMap();
		browser.browserAction.setBadgeText({text: data.country_code});
	});
}

/*function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 4,
		center: {lat: -33, lng: 151},
		disableDefaultUI: true
	});
}*/

function createMap(data) {
	var map = document.getElementById("map");
	map.src = "https://www.google.com/maps/embed/v1/view?key=" + apiKey + "&center=" + data.la + "," + data.lo + "&zoom=8";
	map.onload = function() {
		console.log("map loaded");
	};
}

getData();