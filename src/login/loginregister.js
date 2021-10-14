
const usernameTxt = document.querySelector("#username")
const passwordTxt = document.querySelector("#password")
const checkPasswordTxt = document.querySelector("#Cpassword")
const infoLbl = document.querySelector("#info")

function submit() {

	if (passwordTxt.value === checkPasswordTxt.value)
		getDBkey("login","submitCallback")
	else
		infoLbl.innerText = "The 2 passwords do not match."

}

function submitCallback(users) {
	users = JSON.parse(users)
	users[usernameTxt.value] = CryptoJS.SHA256(passwordTxt.value).toString()

	setDBkey("login", users)
	window.location.replace("http://localhost/loginlogin.html")
}