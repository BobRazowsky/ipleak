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
		getFlag(data.countryCode);
		getLocalIP();
		//initMap();
		browser.browserAction.setBadgeText({text: data.countryCode});
	});
}

function getFlag(countryCode) {
	

	// getJSON("http://www.geognos.com/api/en/countries/flag/" + countryCode + ".png", function(data) {
	// 	console.log(data);
		document.getElementById("flag").src = "http://www.geognos.com/api/en/countries/flag/" + countryCode + ".png";
	//});
}

function getLocalIP() {
	getIPs(function(ip) {
		console.log(ip);
		if(!!ip) {
			document.getElementById("localIP").innerHTML = ip;
		} else {
			document.getElementById("localIP").innerHTML = "No web rtc leaks!";
		}
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


// WEB RTC TEST
// from https://github.com/diafygi/webrtc-ips

//get the IP addresses associated with an account
function getIPs(callback){
    var ip_dups = {};

    //compatibility for firefox and chrome
    var RTCPeerConnection = window.RTCPeerConnection
        || window.mozRTCPeerConnection
        || window.webkitRTCPeerConnection;
    var useWebKit = !!window.webkitRTCPeerConnection;

    //bypass naive webrtc blocking using an iframe
    if(!RTCPeerConnection){
        //NOTE: you need to have an iframe in the page right above the script tag
        //
        //<iframe id="iframe" sandbox="allow-same-origin" style="display: none"></iframe>
        //<script>...getIPs called in here...
        //
        var win = iframe.contentWindow;
        RTCPeerConnection = win.RTCPeerConnection
            || win.mozRTCPeerConnection
            || win.webkitRTCPeerConnection;
        useWebKit = !!win.webkitRTCPeerConnection;
    }

    //minimal requirements for data connection
    var mediaConstraints = {
        optional: [{RtpDataChannels: true}]
    };

    var servers = {iceServers: [{urls: "stun:stun.services.mozilla.com"}]};

    //construct a new RTCPeerConnection
    var pc = new RTCPeerConnection(servers, mediaConstraints);

    function handleCandidate(candidate){
        //match just the IP address
        var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
        var ip_addr = ip_regex.exec(candidate)[1];

        //remove duplicates
        if(ip_dups[ip_addr] === undefined)
            callback(ip_addr);

        ip_dups[ip_addr] = true;
    }

    //listen for candidate events
    pc.onicecandidate = function(ice){

        //skip non-candidate events
        if(ice.candidate)
            handleCandidate(ice.candidate.candidate);
    };

    //create a bogus data channel
    pc.createDataChannel("");

    //create an offer sdp
    pc.createOffer(function(result){

        //trigger the stun server request
        pc.setLocalDescription(result, function(){}, function(){});

    }, function(){});

    //wait for a while to let everything done
    setTimeout(function(){
        //read candidate info from local description
        var lines = pc.localDescription.sdp.split('\n');

        lines.forEach(function(line){
            if(line.indexOf('a=candidate:') === 0)
                handleCandidate(line);
        });
    }, 5000);
}
