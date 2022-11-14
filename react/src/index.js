

/*
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * BACKGROUND CANVAS
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * */

function calcDist(x, y, z){
	var ret = Math.sqrt( x * x + y * y + z * z );
	if( ret == 0 ){
		return 0.0000000001;
	}else{
		return ret;
	}
}

function calcDist2(x, y, z){
	var ret = Math.sqrt( x * x + y * y + z * z );
	return ret;
}

class Camera{
	constructor(x, y, z, screenX, screenY, screenZ ){
		this.x = x;
		this.y = y;
		this.z = z;
		this.screenX = screenX;
		this.screenY = screenY;
		this.screenZ = screenZ;
		this.angleX = 0;
		this.angleY = 0;
		this.angleZ = 0;
	}
	project( x, y, z ){
		x -= this.x;
		y -= this.y;
		z -= this.z;
		var cX = Math.cos( this.angleX );
		var cY = Math.cos( this.angleY );
		var cZ = Math.cos( this.angleZ );
		var sX = Math.sin( this.angleX );
		var sY = Math.sin( this.angleY );
		var sZ = Math.sin( this.angleZ );
		var x1 = x,
			y1 = y * cX + z * sX,
			z1 = y * -sX + z * cX;
		var x2 = x1 * cZ + y1 * -sZ,
			y2 = x1 * sZ + y1 * cZ,
			z2 = z1;
		var dX = x2 * cY + z2 * -sY,
			dY = y2,
			dZ = x2 * sY + z2 * cY;
		return {
			x: this.screenY / dY * dX + this.screenX,
			y: this.screenY / dY * dZ + this.screenZ,
			valid: this.screenY < dY
		};
	}
	pointCameraAtPoint( x, y, z ){
		x -= this.x;
		y -= this.y;
		z -= this.z;
		var angle = Math.atan2( z, y );
		if( 0 <= z ){
			this.angleX = angle;
		}else{
			this.angleX = Math.PI * 2 + angle;
		}
		angle = Math.atan2( x, calcDist( 0, y, z ) );
		if( 0 <= x ){
			this.angleZ = angle;
		}else{
			this.angleZ = Math.PI * 2 + angle;
		}
		this.angleY = 0;
	}
}

function drawSquare( ctx, p0, p1, p2, p3, color ){
	ctx.strokeStyle = color;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo( p0.x, ctx.canvas.clientHeight - p0.y );
	ctx.lineTo( p1.x, ctx.canvas.clientHeight - p1.y );
	ctx.lineTo( p2.x, ctx.canvas.clientHeight - p2.y );
	ctx.lineTo( p3.x, ctx.canvas.clientHeight - p3.y );
	ctx.lineTo( p0.x, ctx.canvas.clientHeight - p0.y );
	ctx.closePath();
	ctx.stroke();
}

class Sphere{
	constructor( position, velocity, mass, radius, color ){
		this.position = position;
		this.velocity = velocity;
		this.mass = mass;
		this.radius = radius;
		this.color = color;
		this.squares = [];
		var sqPerCircle = 4;
		for( var i = 0; i < sqPerCircle; i++ ){
			var theta1 = Math.PI * i / sqPerCircle;
			var theta2 = Math.PI * ( i + 1 ) / sqPerCircle;
			var x1 = Math.cos( theta1 ) * this.radius;
			var x2 = Math.cos( theta2 ) * this.radius;
			var y1 = Math.sin( theta1 ) * this.radius;
			var y2 = Math.sin( theta2 ) * this.radius;
			for( var r = 0; r < sqPerCircle; r++ ){
				var phi1 = 2 * Math.PI * r / sqPerCircle;
				var phi2 = 2 * Math.PI * ( r + 1 ) / sqPerCircle;
				this.squares.push( [ { x: x1, y: Math.cos( phi1 ) * y1, z: Math.sin( phi1 ) * y1 },
					{ x: x1, y: Math.cos( phi2 ) * y1, z: Math.sin( phi2 ) * y1 },
					{ x: x2, y: Math.cos( phi1 ) * y2, z: Math.sin( phi1 ) * y2 },
					{ x: x2, y: Math.cos( phi2 ) * y2, z: Math.sin( phi2 ) * y2 } ] );
			}
		}
	}
	draw( camera, ctx ){
		for( var i = 0; i < this.squares.length; i++ ){
			var square = [];
			for( var r = 0; r < 4; r++ ){
				square.push( camera.project( this.squares[ i ][ r ].x + this.position.x,
					this.squares[ i ][ r ].y + this.position.y,
					this.squares[ i ][ r ].z + this.position.z ) );
				if( !square[ r ].valid ){
					return;
				}
			}
			drawSquare( ctx, square[ 0 ], square[ 1 ],
				square[ 3 ], square[ 2 ], this.color );
		}
	}
	step( speed ){
		this.position.x += this.velocity.x * speed;
		this.position.y += this.velocity.y * speed;
		this.position.z += this.velocity.z * speed;
	}
}

class Simulation {

	//init simul data
	constructor( ctx ){
		this.camera = new Camera( 0, -80000, 0,
			ctx.canvas.width / 2, ctx.canvas.width / 2, ctx.canvas.height / 2 );
		//this.camera.pointCameraAtPoint(0, 0, 0);
		this.boxSize = 50000;
		this.precision = 2;
		this.speed = 200;
		this.spheres = [];
		for( var i = 0; i < 100; i++ ){
			this.spheres.push( new Sphere(
				{ x: Math.random() * 2 * this.boxSize - this.boxSize,
					y: Math.random() * 2 * this.boxSize - this.boxSize,
					z: Math.random() * 2 * this.boxSize - this.boxSize },
				{ x: Math.random() - 0.5,
					y: Math.random() - 0.5,
					z: Math.random() - 0.5 },
				1,
				this.boxSize / 20,
				"#"+((1<<24)*Math.random()|0).toString(16) ));
			if( !this.noCollisions() ){
				this.spheres.pop();
				i--;
			}
		}
	}

	noCollisions(){
		for( var i = 0; i < this.spheres.length; i++ ){
			if( this.preciseOutOfBounds( this.spheres[ i ] ) ){
				return false;
			}
			for( var r = 0; r < this.spheres.length; r++ ){
				if( r == i ){
					continue;
				}
				if( this.preciseContains( this.spheres[ i ], this.spheres[ r ] ) ){
					return false;
				}
			}
		}
		return true;
	}
	preciseOutOfBounds( sphere ){
		return this.boxSize <= sphere.position.x + sphere.radius
			|| this.boxSize <= sphere.position.y + sphere.radius
			|| this.boxSize <= sphere.position.z + sphere.radius
			|| sphere.position.x - sphere.radius < -this.boxSize
			|| sphere.position.y - sphere.radius < -this.boxSize
			|| sphere.position.z - sphere.radius < -this.boxSize;
	}

	preciseContains( a, b ){
		var x = a.position.x - b.position.x,
			y = a.position.y - b.position.y,
			z = a.position.z - b.position.z;
		return calcDist2( x, y, z ) < a.radius + b.radius;
	}

	calculateCrash( a, b ){
		var x1 = a.position.x,
			y1 = a.position.y,
			z1 = a.position.z,
			vX1 = a.velocity.x,
			vY1 = a.velocity.y,
			vZ1 = a.velocity.z,
			x2 = b.position.x,
			y2 = b.position.y,
			z2 = b.position.z,
			vX2 = b.velocity.x,
			vY2 = b.velocity.y,
			vZ2 = b.velocity.z,
			m1 = a.mass,
			m2 = b.mass;
		var dot1 = ( vX1 - vX2 ) * ( x1 - x2 )
			+ ( vY1 - vY2 ) * ( y1 - y2 )
			+ ( vZ1 - vZ2 ) * ( z1 - z2 );
		var dot2 = ( vX2 - vX1 ) * ( x2 - x1 )
			+ ( vY2 - vY1 ) * ( y2 - y1 )
			+ ( vZ2 - vZ1 ) * ( z2 - z1 );
		var length1Squared = Math.pow( x1 - x2, 2 )
			+ Math.pow( y1 - y2, 2 )
			+ Math.pow( z1 - z2, 2 );
		var length2Squared = Math.pow( x2 - x1, 2 )
			+ Math.pow( y2 - y1, 2 )
			+ Math.pow( z2 - z1, 2 );
		var multiple1 = ( dot1 / length1Squared ) * 2 * m2 / ( m1 + m2 );
		var multiple2 = ( dot2 / length2Squared ) * 2 * m1 / ( m1 + m2 );
		a.velocity.x = ( vX1 - ( x1 - x2 ) * multiple1 );
		a.velocity.y = ( vY1 - ( y1 - y2 ) * multiple1 );
		a.velocity.z = ( vZ1 - ( z1 - z2 ) * multiple1 );
		b.velocity.x = ( vX2 - ( x2 - x1 ) * multiple2 );
		b.velocity.y = ( vY2 - ( y2 - y1 ) * multiple2 );
		b.velocity.z = ( vZ2 - ( z2 - z1 ) * multiple2 );
	}

	step( sphere ){
		var x = sphere.position.x;
		var y = sphere.position.y;
		var z = sphere.position.z;
		var vx = sphere.velocity.x;
		var vy = sphere.velocity.y;
		var vz = sphere.velocity.z;
		if( vx == 0 && vy == 0 && vz == 0 ){
			return;
		}
		const NOCRASH = 0;
		const XWALL = 1;
		const YWALL = 2;
		const ZWALL = 3;
		const OTHERSPHERE = 4;
		var crashType = NOCRASH;
		var crashSphere = null;
		var crashC = 0;
		var dv = calcDist2( vx, vy, vz );
		var nvx = vx / dv;
		var nvy = vy / dv;
		var nvz = vz / dv;
		for( var i = 0; i < this.spheres.length; i++ ){
			var other = this.spheres[ i ];
			if( other == sphere ){
				continue;
			}
			var bx = other.position.x - x;
			var by = other.position.y - y;
			var bz = other.position.z - z;
			var c1 = ( bx * vx + by * vy + bz * vz ) / dv;
			if( c1 < 0 ){
				continue;
			}
			var pvx = c1 * nvx;
			var pvy = c1 * nvy;
			var pvz = c1 * nvz;
			var d1 = calcDist2( pvx - bx, pvy - by, pvz - bz );
			var R = sphere.radius + other.radius;
			if( R < d1 ){
				continue;
			}
			var d2 = Math.sqrt( R * R - d1 * d1 );
			var c2 = c1 - d2;
			if( crashType == NOCRASH || c2 < crashC ){
				crashType = OTHERSPHERE;
				crashSphere = other;
				crashC = c2;
			}
		}
		var c = -(x+this.boxSize) / nvx;
		if( 0 < c ){
			var theta = Math.acos( calcDist( 0, nvy, nvz ) / calcDist( nvx, nvy, nvz ) );
			var d = sphere.radius / Math.sin( theta );
			c -= d;
			if( crashType == NOCRASH || c < crashC ){
				crashType = XWALL;
				crashC = c;
			}
		}
		c = -(y+this.boxSize) / nvy;
		if( 0 < c ){
			var theta = Math.acos( calcDist( nvx, 0, nvz ) / calcDist( nvx, nvy, nvz ) );
			var d = sphere.radius / Math.sin( theta );
			c -= d;
			if( crashType == NOCRASH || c < crashC ){
				crashType = YWALL;
				crashC = c;
			}
		}
		c = -(z+this.boxSize) / nvz;
		if( 0 < c ){
			var theta = Math.acos( calcDist( nvx, nvy, 0 ) / calcDist( nvx, nvy, nvz ) );
			var d = sphere.radius / Math.sin( theta );
			c -= d;
			if( crashType == NOCRASH || c < crashC ){
				crashType = ZWALL;
				crashC = c;
			}
		}
		c = (this.boxSize-x) / nvx;
		if( 0 < c ){
			var theta = Math.acos( calcDist( 0, nvy, nvz ) / calcDist( nvx, nvy, nvz ) );
			var d = sphere.radius / Math.sin( theta );
			c -= d;
			if( crashType == NOCRASH || c < crashC ){
				crashType = XWALL;
				crashC = c;
			}
		}
		c = (this.boxSize-y) / nvy;
		if( 0 < c ){
			var theta = Math.acos( calcDist( nvx, 0, nvz ) / calcDist( nvx, nvy, nvz ) );
			var d = sphere.radius / Math.sin( theta );
			c -= d;
			if( crashType == NOCRASH || c < crashC ){
				crashType = YWALL;
				crashC = c;
			}
		}
		c = (this.boxSize-z) / nvz;
		if( 0 < c ){
			var theta = Math.acos( calcDist( nvx, nvy, 0 ) / calcDist( nvx, nvy, nvz ) );
			var d = sphere.radius / Math.sin( theta );
			c -= d;
			if( crashType == NOCRASH || c < crashC ){
				crashType = ZWALL;
				crashC = c;
			}
		}
		if( crashC <= this.speed ){
			sphere.step( crashC );
			if( crashType == OTHERSPHERE ){
				this.calculateCrash( sphere, crashSphere );
			}else if( crashType == XWALL ){
				sphere.velocity.x *= -1;
			}else if( crashType == YWALL ){
				sphere.velocity.y *= -1;
			}else if( crashType == ZWALL ){
				sphere.velocity.z *= -1;
			}
		}else{
			sphere.step( this.speed );
		}
	}

	draw(ctx){
		ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
		for( var i = 1; i < this.spheres.length; i++ ){
			var r = i;
			while( 0 < r && calcDist2( this.spheres[ r - 1 ].position.x - this.camera.x,
				this.spheres[ r - 1 ].position.y - this.camera.y,
				this.spheres[ r - 1 ].position.z - this.camera.z ) <
				calcDist2( this.spheres[ r ].position.x - this.camera.x,
					this.spheres[ r ].position.y - this.camera.y,
					this.spheres[ r ].position.z - this.camera.z ) ){
				var tmp = this.spheres[ r ];
				this.spheres[ r ] = this.spheres[ r - 1 ];
				this.spheres[ r - 1 ] = tmp;
				r--;
			}
		}
		for( var i = 0; i < this.spheres.length; i++ ){
			this.spheres[ i ].draw( this.camera, ctx );
		}
	}
}

//We need to request animation frame to update the simulation and canvas...
//this.state should be the size of the window.. no state for now
class BackgroundCanvas extends React.Component {
	constructor(props){
		super(props)
		//We need access to the canvas
		this.canvasRef = React.createRef()
	}

	//This starts the simulation
	componentDidMount(){
		//Get the dom node
		let canvas = this.canvasRef.current

		//Set its size to the size of the window
		canvas.width = window.innerWidth
		canvas.height = window.innerHeight

		this.simulation = new Simulation( canvas.getContext('2d') );

		requestAnimationFrame(this.animate.bind(this))
	}

	animate(){
		this.updatePos();
		this.simulation.draw( this.canvasRef.current.getContext('2d' ) );
		requestAnimationFrame( this.animate.bind(this) );
	}

	//modifies simulation
	updatePos(){
		for( var i = 0; i < this.simulation.spheres.length; i++ ){
			this.simulation.step( this.simulation.spheres[ i ] );
		}
	}

	render(){
		//Render the canvas
		return <canvas ref={this.canvasRef}
		style={{
			backgroundColor: "#2e2e2e",
				position: "fixed",
				zIndex: -100,
				top: 0,
				left: 0
		}}
			></canvas>
	}
}

/*
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *MMMMMMM AAAAAAAAA IIIIIIIII NNNNNNNNN APPPPPPP
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * */

let textBoxStyle = {
	padding: "10px",
	margin: "0px",
	outline: "none",
	border: "none",
	resize: "none",
	fontSize: "large",
	backgroundColor: "gainsboro",
	opacity: "0.7"
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


/*
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *   	RENDER
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( <div> <BackgroundCanvas /> <App /> </div> );
