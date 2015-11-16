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
function hello()
{
  console.log('hello');
}
var signUp = React.createClass
({
  getInitialState: function() 
  {
    return {userName: ''}, {password: ''}, {confirmPassword: ''};
  },
  handleChange: function(event) 
  {
    if(event.target.name == "userName")
    {
      this.setState({userName: event.target.value});
      console.log("userName");
      console.log(event.target.value);
    }
    else if(event.target.name == "password")
    {
      this.setState({password: event.target.value});
      console.log("password");
      console.log(event.target.value)
    }
    else if(event.target.name == "confirmPassword")
    {
      this.setState({confirmPassword: event.target.value});
      console.log("confirmPassword");
      console.log(event.target.value);
    }
    else
    {
      console.log("*************************************************************************");
      console.log("*************************************************************************");
      console.log("*************************************************************************");
      console.log("*************************************************************************");
      console.log("*************************************************************************");
      console.log("*************************************************************************");
      console.log("*************************************************************************");
      console.log("*************************************************************************");
      console.log("THIS SHOULDN'T BE APPEARING");
      console.log("*************************************************************************");
      console.log("*************************************************************************");
      console.log("*************************************************************************");
      console.log("*************************************************************************");
      console.log("*************************************************************************");
      console.log("*************************************************************************");
      console.log("*************************************************************************");
      console.log("*************************************************************************");

    }

    //console.log(event);
  },
  render: function() {
    var userName = this.state.userName;
    var password = this.state.password;
    var confirmPassword = this.state.confirmPassword;
    return (
       <div style={formStyle}>
        <form method="POST">
          Username: <br/><input type="text" name="userName" value ={userName} onChange={this.handleChange}/><br/><br/>
          Password: <br/><input type="text" name="password" value ={password} onChange={this.handleChange}/><br/>
          Confirm Password: <br/><input type="text" name="confirmPassword" value ={confirmPassword} onChange={this.handleChange}/><br/><br/>
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

