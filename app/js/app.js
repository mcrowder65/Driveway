
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
var transitionTo = Router.transitionTo;
var profileDriveways = '';
var allDriveways = [];
var userDriveways = [];

function get(parameter)
{ 
  var url = window.location.href;
  var index = url.indexOf(parameter);
  if(index == -1)
    return null;
  index += parameter.length + 1; //if the word we're looking for is address, get a index
                                 //then add address.length +1 to get start of value 
   
  var i = index;
  while(url[i] != '?' && url[i] != '&')
  {
    if(i > url.length)
      break;
    i++;
  }
  return url.substring(index, i);
} 
var App = React.createClass({
  render: function() 
  {
    console.log(localStorage);
    drivewayDAO.getAll();
    if(!localStorage.username)
    {
      return(
        <div>
          <nav className="navbar navbar-default" role="navigation">
            <div className="nav navbar-nav navbar-left">                
              <Link className="navbar-brand" to="/home">Home</Link>                  
              <Link className="navbar-brand" to="/aboutUs">About us</Link>              
              <Link className="navbar-brand" to="/allDriveways">All driveways</Link>   
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
      drivewayDAO.get(localStorage.username);
      return(
        <div>
            <nav className="navbar navbar-default" role="navigation">
              <div className="nav navbar-nav navbar-left">                
                <Link className="navbar-brand" to="">Home</Link>                  
                <Link className="navbar-brand" to="/aboutUs">About us</Link>              
                <Link className="navbar-brand" to="/allDriveways">All driveways</Link>   
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
  render: function() {
    return (
      <h1>Home</h1>
    );
  }
});
var AboutUs = React.createClass
({
  render: function() {
    return (
      <h1>About Us</h1>
    );
  }
});

var allDriveways = React.createClass
({
  render: function() 
  {
    return (
     <div>
      <p>{allDriveways} </p>
      </div>
    );
  }
});

var data = {event: {lat: 40.4122994, lon: -111.75418}, parking: []}
var MapHolder = React.createClass({
  render: function() {
    return (
      <ParkingMap data={data}/>
    );
  }
});

var profile = React.createClass
({
  render: function() 
  {
      return (
       <div>
        <p>username: <br/>{localStorage.username}</p>
        <p>email: <br/>{localStorage.email}</p>
        <p>Addresses: <br/>{userDriveways}</p>
        <Link to="/driveway">Would you like to add a driveway?</Link>
      </div>
      );
  }
});
var driveway = React.createClass
({
  getInitialState: function() 
  {
    var tempAddress = get('address');
    if(tempAddress)
    {
      var address = tempAddress;
      var numCars = get('numCars');
      var zip = get('zip');
      var state = get('state');
      var city = get('city');
      drivewayDAO.erase(localStorage.username, address, numCars, zip, state, city);
      return {address: address, numCars: numCars, zip: zip, city: city, state: state, editing: true};
    }
    else
        return {address: '', numCars: '1', zip:'', city: '', state:'AL', editing: false, time: []};
  },
  handleChange: function(event) 
  {
    if(event.target.name == 'address')
      this.setState({address: event.target.value});
    else if(event.target.name == 'numCars')
      this.setState({numCars: event.target.value});
    else if(event.target.name == 'zip')
      this.setState({zip: event.target.value});
    else if(event.target.name == 'state')
      this.setState({state: event.target.value});
    else if(event.target.name =='city')
      this.setState({city: event.target.value});
  },
  handleClick: function(event)
  {
    drivewayDAO.add(localStorage.username, this.state.address, this.state.numCars, this.state.city, this.state.zip, this.state.state);
  },
  addNewTime: function()
  {
     var node = document.getElementById("time");
var textnode = document.createTextNode("Water");         // Create a text node
node.appendChild(textnode);                              // Append the text to <li>
document.getElementById("time").appendChild(node); 
  },
  remove: function()
  {
    location.href="/#/profile";
  },
  render: function() 
  {
    var address = this.state.address;
    var numCars = this.state.numCars;
    var zip = this.state.zip;
    var state = this.state.state;
    var city = this.state.city;
    
    console.log('Address: ' + address);
    console.log('numCars: ' + numCars);
    console.log('zip: ' + zip);
    console.log('state: ' + state);
    console.log('city: ' + city);
    if(!this.state.editing)
    {
      return (
      <div>
          Street address: <br/><input type="text" name="address" value={address} onChange={this.handleChange}/><br/><br/>
          City: <br/><input type="text" name="city" value={city} onChange={this.handleChange}/><br/><br/>
          State: <br/><select name="state" value={state} onChange={this.handleChange}>
                        <option value="AL">Alabama</option>
                        <option value="AK">Alaska</option>
                        <option value="AZ">Arizona</option>
                        <option value="AR">Arkansas</option>
                        <option value="CA">California</option>
                        <option value="CO">Colorado</option>
                        <option value="CT">Connecticut</option>
                        <option value="DE">Delaware</option>
                        <option value="DC">District Of Columbia</option>
                        <option value="FL">Florida</option>
                        <option value="GA">Georgia</option>
                        <option value="HI">Hawaii</option>
                        <option value="ID">Idaho</option>
                        <option value="IL">Illinois</option>
                        <option value="IN">Indiana</option>
                        <option value="IA">Iowa</option>
                        <option value="KS">Kansas</option>
                        <option value="KY">Kentucky</option>
                        <option value="LA">Louisiana</option>
                        <option value="ME">Maine</option>
                        <option value="MD">Maryland</option>
                        <option value="MA">Massachusetts</option>
                        <option value="MI">Michigan</option>
                        <option value="MN">Minnesota</option>
                        <option value="MS">Mississippi</option>
                        <option value="MO">Missouri</option>
                        <option value="MT">Montana</option>
                        <option value="NE">Nebraska</option>
                        <option value="NV">Nevada</option>
                        <option value="NH">New Hampshire</option>
                        <option value="NJ">New Jersey</option>
                        <option value="NM">New Mexico</option>
                        <option value="NY">New York</option>
                        <option value="NC">North Carolina</option>
                        <option value="ND">North Dakota</option>
                        <option value="OH">Ohio</option>
                        <option value="OK">Oklahoma</option>
                        <option value="OR">Oregon</option>
                        <option value="PA">Pennsylvania</option>
                        <option value="RI">Rhode Island</option>
                        <option value="SC">South Carolina</option>
                        <option value="SD">South Dakota</option>
                        <option value="TN">Tennessee</option>
                        <option value="TX">Texas</option>
                        <option value="UT">Utah</option>
                        <option value="VT">Vermont</option>
                        <option value="VA">Virginia</option>
                        <option value="WA">Washington</option>
                        <option value="WV">West Virginia</option>
                        <option value="WI">Wisconsin</option>
                        <option value="WY">Wyoming</option>
                      </select> <br/> <br/>
          Zip code: <br/><input type="text" name="zip" value={zip} onChange={this.handleChange}/><br/><br/>
          Number of Cars: <br/><select name="numCars" value={numCars} onChange={this.handleChange}>
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                      </select>

          <br/><br/>
          Day: <space> </space> <select name="day" id="day">
                                  <option value=""> </option>
                                  <option value="monday"> Monday</option>
                                  <option value="tuesday"> Tuesday</option>
                                  <option value="wednesday"> Wednesday</option>
                                  <option value="thursday"> Thursday</option>
                                  <option value="friday"> Friday</option>
                                  <option value="saturday"> Saturday</option>
                                  <option value="sunday"> Sunday</option>
                                  </select> <space></space>
          Times available: <space> </space>
                      <select name="time" id="time">
                        <option value="-"></option>
                        <option value="5:00 AM">5:00 AM</option>
                        <option value="5:15 AM">5:15 AM</option>
                        <option value="5:30 AM">5:30 AM</option>
                        <option value="5:45 AM">5:45 AM</option>
                       
                        <option value="6:00 AM">6:00 AM</option>
                        <option value="6:15 AM">6:15 AM</option>
                        <option value="6:30 AM">6:30 AM</option>
                        <option value="6:45 AM">6:45 AM</option>
                       
                        <option value="7:00 AM">7:00 AM</option>
                        <option value="7:15 AM">7:15 AM</option>
                        <option value="7:30 AM">7:30 AM</option>
                        <option value="7:45 AM">7:45 AM</option>
                       
                        <option value="8:00 AM">8:00 AM</option>
                        <option value="8:15 AM">8:15 AM</option>
                        <option value="8:30 AM">8:30 AM</option>
                        <option value="8:45 AM">8:45 AM</option>
                       
                        <option value="9:00 AM">9:00 AM</option>
                        <option value="9:15 AM">9:15 AM</option>
                        <option value="9:30 AM">9:30 AM</option>
                        <option value="9:45 AM">9:45 AM</option>
                       
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="10:15 AM">10:15 AM</option>
                        <option value="10:30 AM">10:30 AM</option>
                        <option value="10:45 AM">10:45 AM</option>
                       
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="11:15 AM">11:15 AM</option>
                        <option value="11:30 AM">11:30 AM</option>
                        <option value="11:45 AM">11:45 AM</option>
                       
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="12:15 PM">12:15 PM</option>
                        <option value="12:30 PM">12:30 PM</option>
                        <option value="12:45 PM">12:45 PM</option>
                       
                        <option value="1:00 PM">1:00 PM</option>
                        <option value="1:15 PM">1:15 PM</option>
                        <option value="1:30 PM">1:30 PM</option>
                        <option value="1:45 PM">1:45 PM</option>
                       
                        <option value="2:00 PM">2:00 PM</option>
                        <option value="2:15 PM">2:15 PM</option>
                        <option value="2:30 PM">2:30 PM</option>
                        <option value="2:45 PM">2:45 PM</option>
                       
                        <option value="3:00 PM">3:00 PM</option>
                        <option value="3:15 PM">3:15 PM</option>
                        <option value="3:30 PM">3:30 PM</option>
                        <option value="3:45 PM">3:45 PM</option>
                       
                        <option value="4:00 PM">4:00 PM</option>
                        <option value="4:15 PM">4:15 PM</option>
                        <option value="4:30 PM">4:30 PM</option>
                        <option value="4:45 PM">4:45 PM</option>
                       
                        <option value="5:00 PM">5:00 PM</option>
                        <option value="5:15 PM">5:15 PM</option>
                        <option value="5:30 PM">5:30 PM</option>
                        <option value="5:45 PM">5:45 PM</option>
                       
                        <option value="6:00 PM">6:00 PM</option>
                        <option value="6:15 PM">6:15 PM</option>
                        <option value="6:30 PM">6:30 PM</option>
                        <option value="6:45 PM">6:45 PM</option>
                       
                        <option value="7:00 PM">7:00 PM</option>
                        <option value="7:15 PM">7:15 PM</option>
                        <option value="7:30 PM">7:30 PM</option>
                        <option value="7:45 PM">7:45 PM</option>
                       
                        <option value="8:00 PM">8:00 PM</option>
                        <option value="8:15 PM">8:15 PM</option>
                        <option value="8:30 PM">8:30 PM</option>
                        <option value="8:45 PM">8:45 PM</option>
                       
                        <option value="9:00 PM">9:00 PM</option>
                        <option value="9:15 PM">9:15 PM</option>
                        <option value="9:30 PM">9:30 PM</option>
                        <option value="9:45 PM">9:45 PM</option>
                       
                        <option value="10:00 PM">10:00 PM</option>
                        <option value="10:15 PM">10:15 PM</option>
                        <option value="10:30 PM">10:30 PM</option>
                        <option value="10:45 PM">10:45 PM</option>
                       
                        <option value="11:00 PM">11:00 PM</option>
                        <option value="11:15 PM">11:15 PM</option>
                        <option value="11:30 PM">11:30 PM</option>
                        <option value="11:45 PM">11:45 PM</option>
                      </select><space> </space>
          <button onClick={this.addNewTime}> Add another time</button>
          <div id="time">

          </div>
            <br/><br/><button onClick={this.handleClick}>
            Submit
            </button>
          </div>
      

      );
    }
    else
    {
      return (
      <div>
          <p>You must follow through with this edit, if you do not want to edit anything,
        just click submit again; otherwise, your address will be deleted.</p>
          Street address: <br/><input type="text" name="address" value={address} onChange={this.handleChange}/><br/><br/>
          City: <br/><input type="text" name="city" value={city} onChange={this.handleChange}/><br/><br/>
          State: <br/><select name="state" value={state} onChange={this.handleChange}>
                        <option value="AL">Alabama</option>
                        <option value="AK">Alaska</option>
                        <option value="AZ">Arizona</option>
                        <option value="AR">Arkansas</option>
                        <option value="CA">California</option>
                        <option value="CO">Colorado</option>
                        <option value="CT">Connecticut</option>
                        <option value="DE">Delaware</option>
                        <option value="DC">District Of Columbia</option>
                        <option value="FL">Florida</option>
                        <option value="GA">Georgia</option>
                        <option value="HI">Hawaii</option>
                        <option value="ID">Idaho</option>
                        <option value="IL">Illinois</option>
                        <option value="IN">Indiana</option>
                        <option value="IA">Iowa</option>
                        <option value="KS">Kansas</option>
                        <option value="KY">Kentucky</option>
                        <option value="LA">Louisiana</option>
                        <option value="ME">Maine</option>
                        <option value="MD">Maryland</option>
                        <option value="MA">Massachusetts</option>
                        <option value="MI">Michigan</option>
                        <option value="MN">Minnesota</option>
                        <option value="MS">Mississippi</option>
                        <option value="MO">Missouri</option>
                        <option value="MT">Montana</option>
                        <option value="NE">Nebraska</option>
                        <option value="NV">Nevada</option>
                        <option value="NH">New Hampshire</option>
                        <option value="NJ">New Jersey</option>
                        <option value="NM">New Mexico</option>
                        <option value="NY">New York</option>
                        <option value="NC">North Carolina</option>
                        <option value="ND">North Dakota</option>
                        <option value="OH">Ohio</option>
                        <option value="OK">Oklahoma</option>
                        <option value="OR">Oregon</option>
                        <option value="PA">Pennsylvania</option>
                        <option value="RI">Rhode Island</option>
                        <option value="SC">South Carolina</option>
                        <option value="SD">South Dakota</option>
                        <option value="TN">Tennessee</option>
                        <option value="TX">Texas</option>
                        <option value="UT">Utah</option>
                        <option value="VT">Vermont</option>
                        <option value="VA">Virginia</option>
                        <option value="WA">Washington</option>
                        <option value="WV">West Virginia</option>
                        <option value="WI">Wisconsin</option>
                        <option value="WY">Wyoming</option>
                      </select> <br/> <br/>
          Zip code: <br/><input type="text" name="zip" value={zip} onChange={this.handleChange}/><br/><br/>
          Number of Cars: <br/><select name="numCars" value={numCars} onChange={this.handleChange}>
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                      </select>
        <br/><br/><button onClick={this.handleClick}>
        Submit
        </button>
        <text>     </text>
        <button onClick={this.remove}>
        Delete</button>
      </div>

      );
    }
    
  }

});


var drivewayDAO = 
{
  erase: function(username, address, numCars, zip, state, city)
  {
    var url = "/api/users/deleteDriveway";
    $.ajax
    ({
        url: url,
        dataType: 'json',
        type: 'POST',
        data: 
        {
            username: username,
            address: address,
            numCars: numCars,
            zip: zip,
            city: city,
            state: state
        },
        success: function(res) 
        { 
        }.bind(this),
        error: function()
        {
        }.bind(this)

      });
  },
  add: function(username, address, numCars, city, zip, state)
  {

    var url = "/api/users/addDriveway";
    $.ajax
    ({
        url: url,
        dataType: 'json',
        type: 'POST',
        data: {
            username: username,
            address: address,
            numCars: numCars,
            zip: zip,
            city: city,
            state: state
        },
        success: function(res) 
        {
          if(res.username == localStorage.username)
            location.href = '/#/profile';
          else
            alert('This address already exists.');
          
        }.bind(this),
        error: function()
        {
        }.bind(this)

    });
  },

  get: function(username)
  {
    var url = "/api/users/getDriveways";
    $.ajax
    ({
        url: url,
        dataType: 'json',
        type: 'POST',
        data: {
            username: localStorage.username,
        },
        success: function(res) 
        { 
          userDriveways = [];
          for(var i = 0; i < res.driveway.length; i++)
          {
            var temp = res.driveway[i];
            var tempDriveway = temp.address + ' ' + temp.city + ', ' + temp.state + ' ' + temp.zip + ' - ' + temp.numCars + ' car(s)';
            var link = '/driveway?address=' + temp.address + '?city=' + temp.city + '?state=' + temp.state + '?zip=' + temp.zip + '?numCars=' + temp.numCars;
            userDriveways.push(React.createElement(Link, {to: link}, "Edit/Delete ") );
            userDriveways.push(tempDriveway);
            userDriveways.push(React.createElement("br", null));
          }
        }.bind(this),
        error: function()
        {
          console.log("failure");
        }.bind(this)
    });

  },
  getAll: function()
  {
    var url = "/api/users/getAllDriveways";
    $.ajax
    ({
        url: url,
        dataType: 'json',
        type: 'POST',
        data: {
        },
        success: function(res) 
        { 
          allDriveways = [];
          for(var i = 0; i < res.driveway.length; i++)
          {
            var temp = res.driveway[i];
            var tempString = ' ' + temp.address + ' ' + temp.city + ', ' + temp.state + ' ' + temp.zip + ' - ' + temp.numCars + ' car(s)';
            if(temp.username != localStorage.username)
            {
              allDriveways.push(tempString);
              allDriveways.push(React.createElement("br", null));
            }
          }
        }.bind(this),
        error: function()
        {
          console.log("failure");
        }.bind(this)
    });
  }
};
var logOut = React.createClass
({
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
    location.href = '/#/home';
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
      location.href='/#/profile';
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
          console.log("localStorage.email: " + localStorage.email);
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
              location.href='/#/signIn';
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
        <Route name="app" path="/" component={App} handler={App}>
          <IndexRoute component={Home} />
          <Route name="home" path="/home" component={Home}/>
          <Route name="aboutUs" path="/aboutUs" component={AboutUs} /> 
          <Route name="allDriveways" path="/allDriveways" component={allDriveways} /> 
          <Route name="pay" path="/pay" component={PaymentPage} />
          <Route name="map" path="/map" component={MapHolder} /> 
          <Route name="driveway" path="/driveway" component={driveway} />
          <Route name="signUp" path="/signUp" component={signUp} />
          <Route name="signIn" path="/signIn" component={signIn}/>
          <Route name="logOut" path="/logOut" component={logOut}/>
          <Route name="profile" path="/profile" component={profile}/>
        </Route>
      </Router>
);

ReactDOM.render(routes, document.getElementById('content'));

