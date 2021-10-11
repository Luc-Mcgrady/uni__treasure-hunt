
class Question extends React.Component {

	constructor(props) {
		super(props)
		
		this.state = props

		this.in = React.createElement("input", {"key": 4, "type": "text", "onChange": this.onChange.bind(this)});
		this.value = "";
	}

	submit(e) {
		this.setState({"question": this.value})
	}

	onChange(e) {
		this.value = e.target.value
	}

	render() {
		return [
				React.createElement("img", {"src": this.state.img,"key": 1}),
				React.createElement("p",{"key": 2}, this.state.question ),
				this.in,
				React.createElement("input", {"type": "submit","key": 3, "onClick": this.submit.bind(this)})
			]
	}
}

const container = document.getElementById("question")
ReactDOM.render(
	React.createElement(Question, {"question": "hello world"})
	, container
)