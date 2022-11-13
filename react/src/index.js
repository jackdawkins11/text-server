
let textBoxStyle = {
	padding: "10px",
	margin: "0px",
	outline: "none",
	border: "none",
	resize: "none",
	fontSize: "large",
	backgroundColor: "gainsboro"
}

function TextList(props){
	return props.texts.map( (text, idx) => {
		let textBoxStyleDarker =  Object.assign({}, textBoxStyle, {backgroundColor: "darkgrey"})
		let cBoxStyle = idx % 2 == 0 ? textBoxStyleDarker : textBoxStyle;
		return <p key={idx} style={cBoxStyle}> {text} </p>
	} );
}

class App extends React.Component {
	constructor(props){
		super(props);
		this.state = { value: '', texts: []} 
	}

    	componentDidMount(){
        	this.messageRefresher = setInterval( () => this.getMessages(), 500 );
    	}
    	componentWillUnmount(){
        	clearInterval( this.messageRefresher );
    	}

	handleChange(e){
		if( e.keyCode == 13 ){
		}else{
			this.setState( {value: e.target.value } )
		}
	}
	
	handleKeyUp(e){
		if( e.keyCode == 13 ){
			fetch("messages", {
      				method: "POST",
      				headers: { "Content-Type": "application/json" },
      				body: JSON.stringify({ message: this.state.value }),
    			})
			this.setState( {value: '' } )
		}else{
		}
	}

	getMessages(){
		fetch("messages", {method: "GET"} ).then( (r) => r.json() ).then( (r) => {
			this.setState({texts: r.map( (msg, idx) => { return msg.message } )})
		})
	}

	render() {
		return <div style={{display: "flex", flexDirection: "column", alignItems: "stretch" }}>
			<textarea value={this.state.value}
			onChange={ (e) => { this.handleChange(e) } }
			onKeyUp={ (e) => { this.handleKeyUp(e) } }
			style={textBoxStyle}
			placeholder={"Talk shit here..."}
			/>
			<TextList texts={this.state.texts} />
		</div>
	}
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( <App /> );
