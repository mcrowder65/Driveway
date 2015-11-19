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
});
var formStyle = 
{
  textAlign: 'center'
};
var signIn = React.createClass
({
  getInitialState: function() 
  {
    return {userName: ''}, {password: ''};
  },
  handleChange: function(event) 
  {
    if(event.target.name == "userName")
    {
      this.setState({userName: event.target.value});
      console.log(event.target.value);
    }
    else if(event.target.name == "password")
    {
      this.setState({password: event.target.value});
      console.log(event.target.value)
    }
  },
  handleClick: function(event)
  {
    if(this.state.password != this.state.confirmPassword)
    {
       alert("PASSWORDS ARE DIFFERENT");
    }
    else if(this.state.password.length < 8)
    {
      alert("Your password must be greater than 7 characters");
    }
  },
  render: function() {
    var userName = this.state.userName;
    var password = this.state.password;
    return (
       <div style={formStyle}>
          Username: <br/><input type="text" name="userName" value ={userName} onChange={this.handleChange}/><br/><br/>
          Password: <br/><input type="password" name="password" value ={password} onChange={this.handleChange}/><br/>
          <br/><a href='#'>Forgot your password? </a> <br/>
          <br/><button onClick={this.handleClick}>
            SIGN IN
            </button>
      </div>


      );
  }
});


var signUp = React.createClass
({
  getInitialState: function() 
  {
    return {email: ''}, {username: ''}, {password: ''}, {confirmPassword: ''};
  },
  handleChange: function(event) 
  {
  	
  	if(event.target.name == "email")
  	{
  		this.setState({email: event.target.value});
      	//console.log(event.target.value);
  	}
  	else if(event.target.name == "username")
  	{
  		this.setState({username: event.target.value});
      	//console.log(event.target.value);
  	}
  	else if(event.target.name == "password")
  	{
		this.setState({password: event.target.value});
      	//console.log(event.target.value);	
  	}
    else if(event.target.name == "confirmPassword")
    {
      	this.setState({confirmPassword: event.target.value});
      	////console.log(event.target.value);
    }
  },
  register: function()
  {
  	if(this.state.password !== this.state.confirmPassword)
    {
    	console.log("password: " + this.state.password);
		console.log("confirmPassword: " + this.state.confirmPassword);
        alert("PASSWORDS ARE DIFFERENT");
    }
    else if(this.state.password.length < 8)
    {
      alert("Your password must be greater than 7 characters");
    }
  	auth.register(this.state.email, this.state.username, this.state.password);
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
	         <input type="radio">
	          I agree to the <a href="terms.html">terms of service</a>
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
		console.log("password: " + password);
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
            	console.log("success");
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
          <Route name="signUp" path="/signUp" component={signUp} />

          <Route name="signIn" path="/signIn" component={signIn}/>
        </Route>
      </Router>
);

ReactDOM.render(routes, document.body);
