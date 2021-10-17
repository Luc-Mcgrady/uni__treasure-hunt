
/* 
props.catagories
{
	question:
	possible: [
		Catagory (name, amounts[value...])...
	]
}
*/

class Catagory extends String { // Workaround so that I can store the catagory amounts without a seperate object or anything crazy

	constructor (name, amounts) {
		super(name)

		this.amount = amounts
	}
}

class RadioOption extends RadioQuestion {
	onChange(e) {
		super.onChange(e)

		if (this.props.onChange !== undefined)
			this.props.onChange(this)
	}
}

class QuizPickerList extends React.Component {

	constructor (props) {
		super(props)
		this.onReveal = []

		this.state = {"quiz": null}
	}

	submit() {
		const quiz = this.onReveal[0]() // Gets what quiz is wanted
		const amount = this.onReveal[1]() // Gets the amount that is wanted
		
		console.log(quiz.value,amount.value)
	}

	render() {

		const quizes = {
			"question":"What quiz do you want", 
			"possible": this.props.catagories, 
			"parentList": this,
			"onChange": option => {this.setState({"quiz": option.value})}
		}
		
		if (this.state.quiz != null) {
			const picked = this.onReveal[0]().value // Gets the answer to the first question
			var amounts =
			React.createElement(RadioOption,
				{
					"question": "How many question do you want", 
					"possible": this.props.catagories.find(element => {return element == picked}).amount, 
					"parentList": this
				}
			)
		}

		return [
			React.createElement(RadioOption,quizes),
			amounts,
			React.createElement("input", {"type": "submit","key": 3, "onClick": this.submit.bind(this), "value": "Play the quiz"})
		]
	}

}

function formatCatagoryData(catagories) {

	catagories = catagories.split('\n')  // Splits into lines
	catagories = catagories.slice(1) // Remove OK
	catagories = catagories.map(line => {return JSON.parse(`[${line}]`)}) // Parses into array
	catagories = catagories.map(lineArr => {return new Catagory(lineArr[0], lineArr.slice(1))})

	return catagories

}

const DEBUGCATAGORIES = `"OK","Okay"
"baby","5","10","15"
"education","5","10","15"
"medical","5","10","15"
"money","5","10","15"
"space","5","10","15"`