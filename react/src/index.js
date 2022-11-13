
function TextList(props){
	return props.texts.map( (text, idx) => {
		return <p key={idx}> {text} </p>
	} );
}

class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			value: '',
			texts: ["Hello from text 1", "Hello from text 2", "hello text3", ""]
		}
	}

	handleChange(e){
		if( e.keyCode == 13 ){
		}else{
			this.setState( {value: e.target.value } )
		}
	}
	
	handleKeyUp(e){
		if( e.keyCode == 13 ){
			this.setState( {texts: this.state.texts.concat( this.state.value ), value: ''} )
		}else{
		}
	}

	render() {
		return <div style={{display: "flex", flexDirection: "column" }}>
			<textarea value={this.state.value}
			onChange={ (e) => { console.log(e ); this.handleChange(e) } }
			onKeyUp={ (e) => { console.log(e ); this.handleKeyUp(e) } }
			/>
			<TextList texts={this.state.texts} />
		</div>
	}
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( <App /> );
