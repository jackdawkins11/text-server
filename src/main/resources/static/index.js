var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var textBoxStyle = {
	padding: "10px",
	margin: "0px",
	outline: "none",
	border: "none",
	resize: "none",
	fontSize: "large",
	backgroundColor: "gainsboro"
};

function TextList(props) {
	return props.texts.map(function (text, idx) {
		var textBoxStyleDarker = Object.assign({}, textBoxStyle, { backgroundColor: "darkgrey" });
		var cBoxStyle = idx % 2 == 0 ? textBoxStyleDarker : textBoxStyle;
		return React.createElement(
			"p",
			{ key: idx, style: cBoxStyle },
			" ",
			text,
			" "
		);
	});
}

var App = function (_React$Component) {
	_inherits(App, _React$Component);

	function App(props) {
		_classCallCheck(this, App);

		var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

		_this.state = {
			value: '',
			texts: []
		};
		return _this;
	}

	_createClass(App, [{
		key: "handleChange",
		value: function handleChange(e) {
			if (e.keyCode == 13) {} else {
				this.setState({ value: e.target.value });
			}
		}
	}, {
		key: "handleKeyUp",
		value: function handleKeyUp(e) {
			var _this2 = this;

			if (e.keyCode == 13) {
				fetch("messages", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ message: this.state.value })
				}).then(function (r) {
					fetch("messages", { method: "GET" }).then(function (r) {
						return r.json();
					}).then(function (r) {
						console.log(r);
						_this2.setState({ texts: r.map(function (msg, idx) {
								return msg.message;
							}), value: '' });
					});
				});
			} else {}
		}
	}, {
		key: "render",
		value: function render() {
			var _this3 = this;

			return React.createElement(
				"div",
				{ style: { display: "flex", flexDirection: "column", alignItems: "stretch" } },
				React.createElement("textarea", { value: this.state.value,
					onChange: function onChange(e) {
						_this3.handleChange(e);
					},
					onKeyUp: function onKeyUp(e) {
						_this3.handleKeyUp(e);
					},
					style: textBoxStyle,
					placeholder: "Talk shit here..."
				}),
				React.createElement(TextList, { texts: this.state.texts })
			);
		}
	}]);

	return App;
}(React.Component);

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App, null));