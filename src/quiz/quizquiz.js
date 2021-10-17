class Question extends React.Component {

	constructor(props) {
		super(props)
		
		this.state = {"revealed": false}
		this.props.parentList.onReveal.push((() => {
			return this
		}).bind(this))

		this.value = "";
	}

	onChange(e) {
		this.value = e.target.value
	}

	correct() { 
		return this.value == this.props.answer
	}

	renderInput(className) {
		return React.createElement("input", {
			"key": 4,
			"type": "text",
			"onChange": this.onChange.bind(this),
			"className": className,
			"disabled": this.state.revealed
		});
	}

	render() {
		let tBoxClass = ""
		if (this.state.revealed)
			 tBoxClass = this.correct() ? "correct" : "incorrect"

		return React.createElement("div", {"className":"Question"}, [
				React.createElement("img", {"src": this.props.img,"key": 1}),
				React.createElement("p",{"key": 2}, this.props.question ),
				this.renderInput(tBoxClass)
			]
		)
	}
}

var radioId = 0
class RadioQuestion extends Question {
	renderInput(className) {
		let radioElements = []
		
		const radioGroup = radioId;

		for (const [i,possible] of this.props.possible.entries()) {
			radioElements.push(
				React.createElement("div", null, [ // div so the labels dont get disconnected on overflow
					React.createElement("input", {
						"type":"radio",
						"id":radioId, 
						"key":-i, 
						"value":possible, 
						"name":radioGroup,
						"onChange": this.onChange.bind(this),
						"disabled": this.state.revealed 
					}),
					React.createElement("label", {"htmlFor":radioId++}, possible)
					]
				)
			)	
		}
		
		return React.createElement("form",{"className": className},radioElements)
	}
}

class QuestionList extends React.Component {

	constructor(props) {
		super(props)

		this.state = {"revealed": false}
		this.questions = []
		
		this.onReveal = []
		this.score = 0
	}

	check() {
		for (const func of this.onReveal) {
			const question = func()

			this.score += question.correct()
			question.setState({"revealed":true})
		}
		this.onReveal = []
		this.setState({"revealed": true});
	}

	submit() {
		const score = {
			"action": "goto",
			"where": "leaderboard",
			"startvalue": this.score
		}
		
		window.AppInventor.setWebViewString(JSON.stringify(score));
		this.submit = () => {}
	}

	static *renderQuestions( questions, list ) {
		for (const question of questions) {
			const qtype = question.possible ? RadioQuestion : Question
			yield React.createElement(qtype, {...question, "parentList": list})	
		}
	}

	render() {
		const labeltext = this.state.revealed ? `Your score is: ${ this.score }/${ questions.length }` : "Press the button to check your answers"

		const submit_type = this.state.revealed ? "Submit to leaderboard" : "Submit"
		const submit_func = this.state.revealed ? this.submit.bind(this) : this.check.bind(this)

		return [
			...this.renderQuestions(this.props.questions, this) ,
			React.createElement("p",null,labeltext),
			React.createElement("input", {"type": "submit","key": 3, "onClick": submit_func, "value": submit_type}),
		]
	}
}