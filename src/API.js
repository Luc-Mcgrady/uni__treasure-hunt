
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

function* _entriesOf(object) {
	for (i in object) 
		yield [i, object[i]]
}

function getURL(URI, callback, params={}) {

	URI += "?"
	params = [..._entriesOf(params)] // Gets [a, b] for everything in params
		.map((([key, value]) => 
		{return `${key}=${value}`})) // Then for each of them put it in this string
	
	URI += params.join("&")
	
	return genericAPI({
		"action": "getURI",
		"uri": URI,
		"callback": callback
	})

}