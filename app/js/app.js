
var React   = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var IndexRoute = require('react-router').IndexRoute;
var ParkingMap = require('./components/parkingMap.js');
var RouteHandler = Router.RouteHandler;
var Redirect = Router.Redirect;
var signedIn = true;

var App = React.createClass({
   contextTypes: 
    {
        router: React.PropTypes.func
    },
  render: function() 
  {
    console.log(localStorage);
    if(!localStorage.username)
    {
      console.log("not signed in");
      return(
        <div>
          <nav className="navbar navbar-default" role="navigation">
            <div className="nav navbar-nav navbar-left">                
              <Link className="navbar-brand" to="">Home</Link>                  
              <Link className="navbar-brand" to="/aboutUs">About us</Link>              
              <Link className="navbar-brand" to="/faq">FAQ</Link>   
              <Link className="navbar-brand" to="/map">Map</Link>  
              <Link className="navbar-brand" to="/pay">Pay</Link> 
            </div>
            <div className="nav navbar-nav navbar-right" id="bs-example-navbar-collapse-1">
              <li><Link to="signIn">Sign in</Link></li>
              <li><Link to="signUp">Sign up</Link></li>
            </div>
          </nav>
          <div className="container">
            {this.props.children}
          </div>
        </div>
      );
    }
    else
    {
      console.log("signed in");
      return(
        <div>
            <nav className="navbar navbar-default" role="navigation">
              <div className="nav navbar-nav navbar-left">                
                <Link className="navbar-brand" to="">Home</Link>                  
                <Link className="navbar-brand" to="/aboutUs">About us</Link>              
                <Link className="navbar-brand" to="/faq">FAQ</Link>   
                <Link className="navbar-brand" to="/map">Map</Link>  
                <Link className="navbar-brand" to="/pay">Pay</Link> 
              </div>
              <div className="nav navbar-nav navbar-right" id="bs-example-navbar-collapse-1">
                <li><Link to="profile">Profile</Link></li>
                <li><Link to="logOut">Log out</Link></li>
              </div>
            </nav>
            <div className="container">
              {this.props.children}
            </div>
          </div>
      );
    }
    
  }
});
var Home = React.createClass
({
   contextTypes: {
        router: React.PropTypes.func
    },
  render: function() {
    return (
      <h1>Home</h1>
    );
  }
});
var AboutUs = React.createClass
({
   contextTypes: {
        router: React.PropTypes.func
    },
  render: function() {
    return (
      <h1>About Us</h1>
    );
  }
});

var FAQ = React.createClass
({
   contextTypes: {
        router: React.PropTypes.func
    },
  render: function() {
    return (
      <h1>FAQ</h1>
    );
  }
});

var data = {event: {lat: 40.4122994, lon: -111.75418}, parking: []}
var MapHolder = React.createClass({
   contextTypes: {
        router: React.PropTypes.func
    },
  render: function() {
    return (
      <ParkingMap data={data}/>
    );
  }
});
var profile = React.createClass
({
   contextTypes: 
   {
      router: React.PropTypes.func
   },
  getInitialState: function() 
  {
    return {username: ''}, {password: ''};
  },
  handleChange: function(event) 
  {
  },
  handleClick: function(event)
  {

  },
  showValues: function()
  {
    return localStorage.username + " " + localStorage.email;
  },
  render: function() {
      return (
       <div style={formStyle}>
        <p>username: {localStorage.username}</p>
        <p>email: {localStorage.email}</p>
        
      </div>
      );
  }
});
var logOut = React.createClass
({
   contextTypes: {
        router: React.PropTypes.func
    },
  getInitialState: function() 
  {
    return {username: ''}, {password: ''};
  },
  handleChange: function(event) 
  {
  },
  handleClick: function(event)
  {
    delete localStorage.username;
    delete localStorage.email;
    console.log(localStorage);
    location.reload();
  },
  render: function() {
    return (
       <div style={formStyle}>
          <p> Click <button onClick={this.handleClick}> here</button> to log out </p>
      </div>


      );
  }
});

var formStyle = 
{
  textAlign: 'center'
};
var signIn = React.createClass
({
   contextTypes: {
        router: React.PropTypes.func
    },
  getInitialState: function() 
  {
    return {username: ''}, {password: ''};
  },
  handleChange: function(event) 
  {
    if(event.target.name == "username")
      this.setState({username: event.target.value});
    else if(event.target.name == "password")
      this.setState({password: event.target.value});
  },
  handleClick: function(event)
  {
    signInAuthorization.login(this.state.username, this.state.password);
    if(signedIn == true)
    {
      localStorage.username = this.state.username;
      location.reload();
    }
          
  },
  render: function() {
    var username = this.state.username;
    var password = this.state.password;
    return (
       <div style={formStyle}>
          Username: <br/><input type="text" name="username" value ={username} onChange={this.handleChange}/><br/><br/>
          Password: <br/><input type="password" name="password" value ={password} onChange={this.handleChange}/><br/>
          <br/><a href='/randomHTMLFiles/forgottenPassword.html'>Forgot your password? </a> <br/>
          <br/><button onClick={this.handleClick}>
            SIGN IN
            </button>
      </div>


      );
  }
});

var signInAuthorization =
{
  login: function(username, password)
  {
    var url = "/api/users/login";
    $.ajax
    ({
        url: url,
        dataType: 'json',
        type: 'POST',
        data: 
        {
            username: username,
            password: password
        },
        headers: {'Authorization': localStorage},
        success: function(res) 
        {
          localStorage.email = res.email;
          signedIn = true;
        }.bind(this),
        error: function()
        {
          console.log("failure");
        }.bind(this)

    });
    },
};

var PaymentPage = React.createClass
({
  contextTypes: 
  {
    router: React.PropTypes.func
  },
  render: function() {
    return (
      <h1>Payment</h1>
    );
  }
});

var signUp = React.createClass
({
   contextTypes: {
        router: React.PropTypes.func
    },
  getInitialState: function() 
  {
    return {email: ''}, {username: ''}, {password: ''}, {confirmPassword: ''};
  },
  handleChange: function(event) 
  {
  	if(event.target.name == "email")
  		this.setState({email: event.target.value});
  	else if(event.target.name == "username")
  		this.setState({username: event.target.value});
  	else if(event.target.name == "password")
		  this.setState({password: event.target.value});
    else if(event.target.name == "confirmPassword")
      this.setState({confirmPassword: event.target.value});
  },
  register: function()
  {
  	if(this.state.password !== this.state.confirmPassword)
    {
        alert("PASSWORDS ARE DIFFERENT");
    }
    else if(this.state.password.length < 8)
    {
      alert("Your password must be greater than 7 characters");
    }
    else if(!this.terms)
      alert("You need to accept the terms and conditions");
    else
        auth.register(this.state.email, this.state.username, this.state.password);
  },
  handleTerms: function()
  {
    this.terms = !this.terms;
    if(this.terms)
      document.getElementById('terms').checked = true;
    else
      document.getElementById('terms').checked = false;
  },
  render: function() {
  	var email = this.state.email;
    var username = this.state.username;
    var password = this.state.password;
    var confirmPassword = this.state.confirmPassword;
    return (

	       <div style={formStyle}>
	       	  Email: <br/><input type="text" name="email" value={email} onChange={this.handleChange}/><br/><br/>
	          Username: <br/><input type="text" name="username" value ={username} onChange={this.handleChange}/><br/><br/>
	          Password: <br/><input type="password" name="password" value ={password} onChange={this.handleChange}/><br/>
	          Confirm Password: <br/><input type="password" name="confirmPassword" value ={confirmPassword} onChange={this.handleChange}/><br/><br/>
	         <input type="radio" onClick={this.handleTerms} id="terms"> 
	            I agree to the <a href="randomHTMLFiles/terms.html">terms and conditions</a>
	          </input><br/><br/>
	          <input type="submit" value="SIGN UP" onClick={this.register}/> 
	      </div>


      );
  }
});

var auth =
{
	register: function(email, username, password)
	{
		console.log("email: " + email);
		console.log("username: " + username);
		var url = "/api/users/register";
        $.ajax
        ({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: {
                email: email,
                username: username,
                password: password
            },
            success: function(res) 
            {
              console.log("before success statement");
            	console.log("success");
              console.log("res email: " + res.email);

            }.bind(this),
            error: function()
            {
            	console.log("failure");
            }.bind(this)

		});
    },
};

// Run the routes
var routes = (
      <Router>
        <Route name="app" path="/" component={App}>
          <IndexRoute component={Home} />
          <Route name="aboutUs" path="aboutUs" component={AboutUs} /> 
          <Route name="faq" path="faq" component={FAQ} /> 
          <Route name="pay" path="pay" component={PaymentPage} />
          <Route name="map" path="map" component={MapHolder} /> 
          
          <Route name="signUp" path="/signUp" component={signUp} />
          <Route name="signIn" path="/signIn" component={signIn}/>
          <Route name="logOut" path="/logOut" component={logOut}/>
          <Route name="profile" path="/profile" component={profile}/>
        </Route>
      </Router>
);

ReactDOM.render(routes, document.getElementById('content'));
