class Question extends React.Component {

	constructor(props) {
		super(props)
		
		this.state = {"revealed": false}
		this.props.parentList.onReveal.push((() => {
			this.setState({"revealed":true})
			return this.correct()
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

		this.name = ""
	}

	check() {
		for (const func of this.onReveal)
			this.score += func()
		this.onReveal = []
		this.setState({"revealed": true});
	}

	submit() {
		if (this.name == "")
			return

		const score = {
			"action": "goto",
			"where": "leaderboard",
			"startvalue": 
			{
				"name":this.name,
				"score":this.score
			}
		}
		
		window.AppInventor.setWebViewString(JSON.stringify(score));
		this.submit = () => {}
	}

	render() {
		let questions = []
		
		for (const question of this.props.questions) {

			const qtype = question.possible ? RadioQuestion : Question
			questions.push(React.createElement(qtype, {...question, "parentList": this}))	
		}
		
		const labeltext = this.state.revealed ? `Your score is: ${ this.score }/${ questions.length }` : "Press the button to check your answers"

		function onChange(e) {
			this.name = e.target.value
		}

		const onRevealed =  this.state.revealed ? [
			React.createElement("br"),
			React.createElement("span", null, "Name:"),
			React.createElement("input", {"type": "text", "onChange": onChange.bind(this)}),
			React.createElement("br"),
			React.createElement("input", {"type": "submit", "value": "Submit to leaderboard", "onClick": this.submit.bind(this)})
		] : [];

		return [
			...questions ,
			React.createElement("p",null,labeltext),
			React.createElement("input", {"type": "submit","key": 3, "onClick": this.check.bind(this), "disabled":this.state.revealed}),
			...onRevealed
		]
	}
}

const container = document.getElementById("questions")
ReactDOM.render(
	React.createElement(QuestionList, {"questions": questions})
	, container
)