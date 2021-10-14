
const usernameTxt = document.querySelector("#username")
const passwordTxt = document.querySelector("#password")
const infoLbl = document.querySelector('#info')

function submit() {
	getDBkey("login", "loginCallback")

	return false
}

var fails = 0;
function loginCallback(users) {
	users = JSON.parse(users)

	if (users[usernameTxt.value] === passwordTxt.value) {
		window.location.replace("http://localhost/root.html")
		setDBkey("username", usernameTxt.value)
	}
	else {
		infoLbl.innerText = `Failed to authenticate ${++fails} time(s)`
	}
}