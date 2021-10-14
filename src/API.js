
function genericAPI(req) {
	window.AppInventor.setWebViewString(JSON.stringify(req))
}

// Callback as an top level functions name instead of an anonymous!!
function getDBkey(key, callback) { 
	const req = {
		"action": "getDB",
		"key": key,
		"callback": callback,
	}
	genericAPI(req)
}

function setDBkey(key, value) { 
	const req = {
		"action": "setDB",
		"key": key,
		"value": value
	}
	genericAPI(req)
}