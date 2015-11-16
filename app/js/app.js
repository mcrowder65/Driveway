var Router = ReactRouter.Router;
var Link = ReactRouter.Link;
var Route = ReactRouter.Route;
var App = React.createClass({
  render: function() {
    return (
      <div>
        <nav className="navbar navbar-default" role="navigation">
          
              <div className="nav navbar-nav navbar-left">
                <a className="navbar-brand" href="/">Home</a>
                <a className="navbar-brand" href="/">About Us</a>
                <a className="navbar-brand" href="/">FAQ</a>

              </div>
              <div className="nav navbar-nav navbar-right" id="bs-example-navbar-collapse-1">
                <a className="navbar-brand" href="/">Log in</a>
                
                <li><Link to="signUp">Sign up</Link></li>
                
              </div>
            
        </nav>

        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
});

var Home = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Home</h1>
        <p>Put your home page here</p>
      </div>
    );
  }
});
var formStyle = 
{
  textAlign: 'center'
};
var signUp = React.createClass({

  render: function() {
    return (
      <div style={formStyle}>
        <form>

          Username: <br/><input type="text" name="userName" /><br/><br/>
          Password: <br/><input type="text" name="password" /><br/>
          Confirm Password: <br/><input type="text" name="confirmPassword" /><br/><br/>
          <input type="radio">
          I agree to the <a href='#'>terms of service</a>
          </input><br/><br/>
          <button>
            SIGN UP
            </button>
        </form>
      </div>
    );
  }
});



// Run the routes
var routes = (
      <Router>
        <Route name="app" path="/" component={App}>
          <Route name="signUp" path="/signUp" component={signUp} />
          <Route path="*" component={Home}/>
        </Route>
      </Router>
);

ReactDOM.render(routes, document.body);

