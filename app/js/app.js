var React   = require('react');

var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var IndexRoute = require('react-router').IndexRoute;
var ReservationForm = require('./components/ReservationForm.js');
var RouteHandler = Router.RouteHandler;
var Redirect = Router.Redirect;
var CheckoutStrip = require('./components/StripePayment.js');
var signedIn = true;
var transitionTo = Router.transitionTo;
var History = require('react-router').History;
var { createHistory, useBasename } = require('history');
var ReactScriptLoaderMixin = require('react-script-loader').ReactScriptLoaderMixin;
var {Lifecycle, RouteContext} = require('react-router');
var history = useBasename(createHistory)({
    basename: '/transitions'
})
var geocoder = new google.maps.Geocoder();
var Button = require('react-button');
var profileDriveways = '';
var allDriveways = [];
var userDriveways = [];

function upperCaseFirstLetter(string)
{
  return string[0].toUpperCase() + string.substring(1, string.length);
}
function contains(array, json)
{
  for(var i = 0; i < array.length; i++)
  {
    var object = array[i];
    if(object.stateDay == json.stateDay && object.startTime == json.startTime && object.endTime == json.endTime)
      return true;
  }
  return false;
}
function stripChar(string, character)
{
  var charIndex = string.indexOf(character);
  var firstHalf = string.substring(0, charIndex);
  var secondHalf = string.substring(charIndex+1, string.length);

  if(character == ':' && firstHalf == '12')
    firstHalf = '0';
  return firstHalf + secondHalf;
}
function stripCharacter(string, character)
{
  var charIndex = string.indexOf(character);
  var firstHalf = string.substring(0, charIndex);
  var secondHalf = string.substring(charIndex+1, string.indexOf(' '));

  if(character == ':' && firstHalf == '12')
    firstHalf = '0';
  return firstHalf + secondHalf;
}
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
var navStyle =
{
  marginBottom: '0',
  paddingRight: '10px'
};

var App = React.createClass({
  render: function() 
  {
    drivewayDAO.getAll();

    if(!localStorage.username)
    {
      return(
        <div>
          <nav className="navbar navbar-default" role="navigation" id='navbar' style={navStyle}>
            <div className="nav navbar-nav navbar-left">                
              <Link className="navbar-brand" to="/home">Home</Link>                  
              <Link className="navbar-brand" to="/learn">Learn</Link>              
              <Link className="navbar-brand" to="/reserveparking">Reserve Parking</Link>                
              <Link className="navbar-brand" to="/lookup">Order Lookup</Link> 
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
            <nav className="navbar navbar-default" role="navigation" id='navbar' style={navStyle}>
              <div className="nav navbar-nav navbar-left">                
                <Link className="navbar-brand" to="">Home</Link>                  
                <Link className="navbar-brand" to="/learn">Learn</Link>              
                <Link className="navbar-brand" to="/reserveparking">Reserve Parking</Link>  
                <Link className="navbar-brand" to="/lookup">Order Lookup</Link> 
              </div>
              <div className="nav navbar-nav navbar-right" id="bs-example-navbar-collapse-1">
                <li><Link to="profile">Profile</Link></li>
                <li><Link to="" onClick={userDAO.logOut}>Log out</Link></li>
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
var footerStyle =
{
  paddingTop: '60px',
  backgroundColor: 'white',
  width: '50%',
  marginLeft: '25%',
};

var left = 
{
  textAlign: 'left'
};
var right = 
{
  textAlign: 'right'
};
var center = 
{
  textAlign: 'center'
};
var inputStyle =
{
  width: '50%',
  marginLeft: '25%'
}
var homeStyle =
{
  textAlign: 'center',
  fontFamily: '100 50px proxima-nova-1,proxima-nova-2,\'Proxima Nova\',HelveticaNeue,Helvetica,Arial,sans-serif',
  fontSize: '30',
  align: 'center',
  color: '#ECF3F7',
  left: '0',
  position: 'absolute'
};
var learnMoreStyle =
{
  width: '50%',
  marginLeft: '25%',
  textAlign: 'center'
};
var Home = React.createClass
({
  mixins: [History, Lifecycle, RouteContext],
  getInitialState: function() 
  {

    return {address:''};
  },
  goToMap: function()
  {

    location.href='/#/reserveparking?address=' + this.state.address;
  },
  handleChange: function(event)
  {

    this.setState({address: event.target.value});
  },
  goToLearn: function()
  {

    this.history.pushState(null, '/learn');
  },
  render: function() {
    var address = this.state.address;
    if(document.getElementById('navbar'))
    {
      document.getElementById('navbar').style.marginBottom ='0';
    }
    return (
    <div>
      <div  className="Intro bg-primary" style={homeStyle}>
      <br/>
      <br/>
        <p> <strong>Millions</strong> of driveways in one place.</p>
        <div className="row">
          <div className="input-group" style={inputStyle}>
            <input type="text" className="form-control" value={address} onChange={this.handleChange} placeholder="Search the address of an event"/>
            <span className="input-group-btn">
              <button className="btn btn-default" type="button" onClick={this.goToMap}>Go!</button>
            </span>
          </div>
        </div>
        <br/>
        <br/>
        <br/>

      </div>

      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>

      <div className="panel panel-primary" style={learnMoreStyle}>
        <div className="panel-body" > 
          <h2>Rent out your driveway</h2>
          <h4>Easy as 1...2...3...</h4>
          <button className="btn btn-primary" type="button" onClick={this.goToLearn}>
          Learn more
          </button>
        </div>
      </div>
    

    </div>

    );
  }
});
var picStyle=
{
  width:'100%',
  height:'100%'
};
var learn = React.createClass
({
  render: function() {
    if(document.getElementById('navbar'))
      document.getElementById('navbar').style.marginBottom ='';
    //this.forceUpdate();
    return (
      <div style={center}>
        <img src="pic.jpg" style={picStyle}/>

        <div className="jumbotron">
          <p> Imagine trying to find parking at this event?<br/>
              I am sure we can agree it would be a nightmare.<br/>
                                                             <br/>
              Now imagine living near this place and renting out<br/>
              your driveway and you making easy cash.<br/>
              <br/>
              Just throw up your driveway on your profile, your asking<br/>
              price, and times available, and we will do the rest. <br/>
          </p>
        </div>
      </div>
    );
  }
});

var allDriveways = React.createClass
({
  render: function() 
  {
    if(document.getElementById('navbar'))
      document.getElementById('navbar').style.marginBottom ='';
    //this.forceUpdate();
    return (
     <div>
      <p>{allDriveways} </p>
      </div>
    );
  }
});

var ReserveParking = React.createClass({
  render: function() {
    if(document.getElementById('navbar'))
      document.getElementById('navbar').style.marginBottom ='';
    return (
      <ReservationForm/>
    );
  }
});

var rightBluePanelStyle =
{
  width: '50%'
  //<p>Addresses: <br/>{userDriveways}</p>
  //<Link to="/driveway">Would you like to add a driveway?</Link>
};
var leftBluePanelStyle = 
{
  width: '50%'
};  

var rightPanel =
{
  width: '45%',
  float: 'right'
}
var leftPanel =
{
  width: '45%',
  float: 'left'
};
var profile = React.createClass
({
  renderReservations: function()
  {
    var reservations = userDAO.getUserReservations(localStorage.username);
    var displayArray = [];
    console.log(reservations.length);
    for(var i = 0; i < reservations.length; i++)
    {
      var reservation = reservations[i];
      var drivewayId = reservation.drivewayId;
      var driveway = drivewayDAO.queryID(drivewayId);
      console.log(driveway);
      var drivewayString = driveway.address + ' ' + driveway.city + 
      ', ' +  driveway.state + ' ' + driveway.zip;
      displayArray.push(React)
    } 
  },
  reroute: function()
  {
    location.href ='/#/driveway';
  },
  render: function() 
  {
    if(document.getElementById('navbar'))
      document.getElementById('navbar').style.marginBottom ='';
    navStyle =
    {
      marginBottom: '',
      paddingRight: '10px'
    };
    //this.forceUpdate();
    this.renderReservations();

      return (
       <div style={center}>
        <h2> {localStorage.username.toUpperCase()}</h2>
        <h4>{localStorage.email.toUpperCase()} </h4>
        <br/>
        <br/>
        <br/>
        <div className="panel panel-primary" style={leftPanel}>
          
          <div className="panel-heading" style={bluePanelHeaderStyle}>
            Driveways
          </div>
          <div className="panel-body" style={bluePanelBodyStyle}>
            {userDriveways}<br/>
            <button type="button" className="btn btn-primary" onClick={this.reroute}>Add driveway</button>
          </div>

        </div>
        <div className="panel panel-primary" style={rightPanel}>
          
          <div className="panel-heading" style={bluePanelHeaderStyle}>
            Reservations
          </div>
          <div className="panel-body" style={bluePanelBodyStyle}>
            {userDriveways}<br/>
            <button type="button" className="btn btn-primary" onClick={this.reroute}>Add driveway</button>
          </div>

        </div>
      </div>
      );
  }
});

var userDAO = 
{

  mixins: [History, Lifecycle],
  getUserReservations: function(username)
  {
    var url = '/api/users/getUserReservations';
    var returnValue = {};
    $.ajax
    ({
      url: url,
      dataType: 'json',
      type: 'POST',
      data:
      {
        username: username
      },
      async: false,
      success: function(res)
      {
        returnValue = res.reservations;
      }.bind(this),
      error: function(res)
      {

      }.bind(this)

    });
    return returnValue;
  },
  findEmail: function(email)
  {
    var url ="/api/users/findEmail";
    var returnValue = '';
    $.ajax
    ({
      url: url,
      dataType: 'json',
      type: 'POST',
      data: 
      {
        email: email
      },
      async: false,
      success: function(res)
      {
        returnValue = res.email;
        //email found!
      }.bind(this),
      error:function(res)
      {
        console.log(res.email);
      }.bind(this)

    });
    return returnValue;
  },
  register: function(email, username, password)
  {
    var returnError = '';
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
        async: false,
        success: function(res) 
        {
          userDAO.login(username, password);
          localStorage.username = username;
          location.href ='/#/profile';
          returnError = 'chicken poop';
        }.bind(this),
        error: function()
        {
          returnError = 'FAILED';
        }.bind(this)
    });
    
    return returnError;
  },
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
        async: false,
        headers: {'Authorization': localStorage},
        success: function(res) 
        {
          localStorage.email = res.email;
          console.log("signed in");
          signedIn = true;
        }.bind(this),
        error: function()
        {
          signedIn = false;
          
        }.bind(this)

    });
  },
  getID: function(username)
  {
    var url = "/api/users/getID";
    var id = '';
    $.ajax
    ({
      url: url,
      dataType: 'json',
      type: 'POST',
      data:
      {
        username: username
      },
      async: false,
      success: function(res)
      {
        id = res.id;
      }.bind(this),
      error: function()
      {
        id = 'nope';
      }.bind(this)

    });
    return id;
  },
  get: function(id)
  {
    var url = '/api/users/get';
    var json = {};
    $.ajax
    ({
      url: url,
      dataType: 'json',
      type: 'POST',
      data:
      {
        _id: id
      },
      async: false,
      success: function(res)
      {
        json.username = res.username;
        json.email = res.email;
      }.bind(this),
      failure: function()
      {
        console.log('failure');
      }.bind(this)
    });
    return json;
  },
  sendEmail: function(email, id)
  {
    var url = "/api/users/sendEmail";

    $.ajax
    ({
        url: url,
        dataType: 'json',
        type: 'POST',
        data: {
          email: email,
          id: id
        },
        async: false,
        success: function(res) 
        {
         console.log('sent email');
        }.bind(this),
        error: function()
        {
          console.log('failed email');
        }.bind(this)
    });
  },
  updatePassword: function(id, username, email, password)
  {
    var url = '/api/users/updatePassword';
    $.ajax
    ({
      url: url,
      dataType: 'json',
      type: 'POST',
      data:
      {
        _id: id,
        password: password
      },
      async: false,
      success: function(res)
      {
        console.log('changed password');
        userDAO.login(username, res.password);
        localStorage.username = username;
        console.log('username: ' + username);
        location.href ='/#/profile';
      }
    });
  },
  logOut: function()
  {
    delete localStorage.username;
    delete localStorage.email;
    //this.history.pushState(null,'/Home');
    location.href="/#/home";
  }
};
var driveway = React.createClass
({
  mixins: [History, Lifecycle],
  getInitialState: function() 
  {
    var id = get('_id');
    var allowNewTimes = false;
    if(id)
    {
      var obj = drivewayDAO.queryID(id);
      var address = obj.address;
      var username = obj.username;
      var zip = obj.zip;
      var city = obj.city;
      var times = obj.times;
      var numCars = obj.numCars;
      var state = obj.state;
      var fee = obj.fee;
      var displayTimes = [];

      for(var i = 0; i < times.length; i++)
      {
        displayTimes.push(React.createElement("br", null));
        var time = times[i];
        var startTime = time.startTime;
        var endTime = time.endTime;
        var stateDay = upperCaseFirstLetter(time.stateDay);
        var value = stateDay + 's from ' + startTime + ' to ' + endTime;
        
        var htmlID = stateDay+ ' ' + startTime + ' ' + endTime;
        displayTimes.push(value);
        displayTimes.push(React.createElement(Button, {onClick:this.deleteTime, id: htmlID}, 'Delete'));
      }
      return{ address: address, zip: zip, city: city, times: times, 
              numCars: numCars, state: state, startTime: '', endTime: '', 
              day: '', editing: true,  displayTimes: displayTimes, id: id, fee: fee, title: 'Edit your driveway!'};
    }
    else
        return {address: '', numCars: '1', zip:'', city: '', state:'', editing: false, 
                startTime: '', endTime: '', day: '', times: [], displayTimes: [], fee: fee, title: 'Add a new Driveway!'};
  },
  geocodeAddress: function(address){
    console.log('trying to geocode address');
    var geo;
    $.ajax({
        url: 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCwbk5pU1WPZPc24uCD6XZJ3OUBV127_bQ',
        data: {
            sensor: false,
            address: address
        },
        async: false,
        dataType:'json',
        success: function (data) {
            geo = data.results;
        }
    });
    if(geo[0] == null)
      return null;
    return geo[0].geometry.location;
  },
  handleChange: function(event) 
  {
    var dayBool = false;
    var startTimeBool = false;
    var endTimeBool = false;
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
    else if(event.target.name =='fee')
      this.setState({fee: event.target.value});
    else if(event.target.name == 'startTime')
    {
      this.setState({startTime: event.target.value});
      if(event.target.value != '')
        startTimeBool = true; //if the value was empty, then we don't want them to add another time!
    }
    else if(event.target.name == 'endTime')
    {
      this.setState({endTime: event.target.value});
      if(event.target.value != '')
        endTimeBool = true;
    }
    else if(event.target.name == 'day')
    {
      this.setState({day: event.target.value});
      if(event.target.value != '')
        dayBool = true; //if the value was empty, then we don't want them to add another time!
    }
    this.setState({allowNewTimes: false}); //set it to false initially to reset any previous hanging trues.
    //handle a finished time slot
    //since calling this.state.time or this.state.day doesn't return anything even after you set it, use
    //dayBool and timeBool indicating that we set it to something so you can set the allowNewTimes to true

    if(dayBool && this.state.startTime != '' && this.state.endTime != '') //dayBool = true
      this.setState({allowNewTimes: true});
    if(this.state.day != '' && startTimeBool && this.state.endTime != '') //startTimeBool = true
      this.setState({allowNewTimes: true});
    if(this.state.day != '' && this.state.startTime != '' && endTimeBool) //endTimeBool = true
      this.setState({allowNewTimes: true});
  },
  handleClick: function(event)
  {
    var fullAddress = this.state.address + ' ' + this.state.city + ', ' + this.state.state + this.state.zip;
    var location = this.geocodeAddress(fullAddress);
    if(location == null)
    {
      alert("That is not a correct address. Ensure that you have input a correct address.");
      return;
    }
    if(this.state.state == '')
    {
      alert('You must pick a state');
      return;
    }
    if(this.state.editing)
      drivewayDAO.update(this.state.id, this.state.address, this.state.numCars, this.state.city, 
                         this.state.zip, this.state.state, this.state.times, this.state.fee, location);
    else
      drivewayDAO.add(localStorage.username, this.state.address, this.state.numCars, this.state.city, 
                      this.state.zip, this.state.state, this.state.times, this.state.fee, location);
    this.history.pushState(null, '/profile');  
  },
  deleteTime: function(event)
  {//{stateDay, start, end};
    var currentID = event.currentTarget.id;


    var times = this.state.times;
    for(var i = 0; i < times.length; i++)
    {
      var time = times[i];
      var timeID = upperCaseFirstLetter(time.stateDay) + ' ' + time.startTime + ' ' + time.endTime;
      if(timeID == currentID)
      {
        times.splice(i, 1);
        break;
      }
    }

    this.setState({times: times});
    var displayTimes = this.state.displayTimes;
    displayTimes = [];

    for(var i = 0; i < times.length; i++)
    {

      displayTimes.push(React.createElement("br", null));
      var time = times[i];
      var startTime = time.startTime;
      var endTime = time.endTime;
      var stateDay = upperCaseFirstLetter(time.stateDay);
      var value = stateDay + 's from ' + startTime + ' to ' + endTime;
      
      var id = stateDay+ ' ' + startTime + ' ' + endTime;
      displayTimes.push(value);
      displayTimes.push(React.createElement(Button, {onClick:this.deleteTime, id: id, className: 'btn btn-primary', type: 'button'}, 'Delete'));
    }
    this.setState({displayTimes: displayTimes});
    this.forceUpdate();
  },
  endAfterStart: function()
  {
    var startTime = this.state.startTime;
    var endTime = this.state.endTime;

    var startPM = true;
    if(startTime.slice(-2) == 'AM')
      startPM = false;

    var endPM = true;
    if(endTime.slice(-2) == 'AM')
      endPM = false;
    //now we know if they're am or pm.

    if(!endPM && startPM) //endPM = AM and startPM = PM
      return false;
    if(endPM && !startPM) //endPM = PM and startPM = AM
      return true;
    
    startTime = parseInt(stripCharacter(startTime, ':'));
    endTime = parseInt(stripCharacter(endTime, ':'));
    
    if(endTime <= startTime)
      return false;
    return true;
  },
  addNewTime: function()
  {
      if(!this.state.allowNewTimes)
      {
        alert("You need to finish your first time before you add another.");
        return;
      }
      var stateDay = this.state.day;
      var startTime = this.state.startTime;           // for some reason webpack likes you to initialize
      var endTime = this.state.endTime;
      if(this.endAfterStart() == false)
      {
        alert("Pick correct times.");
        this.setState({endTime: ''});
        return;
      }
      var dayTimeObject = {startTime, endTime, stateDay}; // your variables before putting it into a json
      var times = this.state.times;
      if(contains(times, dayTimeObject))
      {
        alert("This selection already exists");
        this.setState({day: ''});
        this.setState({startTime: ''});
        this.setState({endTime: ''});
        return;
      }
      this.state.times.push(dayTimeObject);
      
      
      this.state.displayTimes = [];
      var displayTimes = this.state.displayTimes;
      for(var i = 0; i < times.length; i++)
      {
        displayTimes.push(React.createElement("br", null));
        
        stateDay = upperCaseFirstLetter(times[i].stateDay);
        var value = stateDay + 's from ' + times[i].startTime + ' to ' + times[i].endTime;
        var start = times[i].startTime;
        var end = times[i].endTime;
        var id = stateDay+ ' ' + start + ' ' + end;
        displayTimes.push(value);
        displayTimes.push(React.createElement(Button, {onClick:this.deleteTime, id: id, className: 'btn', type: 'button'}, 'Delete'));
      }

      this.state.displayTimes = displayTimes;
      this.setState({day: ''});
      this.setState({startTime: ''});
      this.setState({endTime: ''});
      this.forceUpdate();
  },
  remove: function()
  {
    drivewayDAO.erase(this.state.id);
    this.history.pushState(null, '/profile');
  },
  render: function() 
  {
    if(document.getElementById('navbar'))
      document.getElementById('navbar').style.marginBottom ='';
    //this.forceUpdate();
    var address = this.state.address;
    var numCars = this.state.numCars;
    var zip = this.state.zip;
    var state = this.state.state;
    var city = this.state.city;
    var day = this.state.day;
    var startTime = this.state.startTime;
    var endTime = this.state.endTime;
    var displayTimes = this.state.displayTimes;
    var fee = this.state.fee;
    var title = this.state.title;
    if(!this.state.editing)
    {
      return (
      <div>
        <div className="panel panel-primary" style={bluePanelStyle}>
          <div className="panel-heading" style={bluePanelHeaderStyle}>
           {title}
          </div>
          <div className="panel-body" style={bluePanelBodyStyle}>
            <div id="time">
              Street address: <br/><input type="text" name="address" value={address} onChange={this.handleChange}/><br/><br/>
              City: <br/><input type="text" name="city" value={city} onChange={this.handleChange}/><br/><br/>
              State: <br/><select name="state" value={state} onChange={this.handleChange}>
                            <option value="-"></option>
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
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                          </select><br/><br/>
              Fee: <br/><input type="text" name="fee" value={fee} onChange={this.handleChange}/><br/><br/>
              <p id="chosenTimes"> Chosen times: {displayTimes}</p>            
              Day: <space> </space> <select name="day" id="day" value={day} onChange={this.handleChange}>
                                      <option value=""> </option>
                                      <option value="monday"> Monday</option>
                                      <option value="tuesday"> Tuesday</option>
                                      <option value="wednesday"> Wednesday</option>
                                      <option value="thursday"> Thursday</option>
                                      <option value="friday"> Friday</option>
                                      <option value="saturday"> Saturday</option>
                                      <option value="sunday"> Sunday</option>
                                      </select> <space></space>
              
              Start time: <space> </space>
                          <select name="startTime" id="time" value={startTime} onChange={this.handleChange}>
                            <option value=""></option>
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
              End time: <space> </space>
                          <select name="endTime" id="endTime" value={endTime} onChange={this.handleChange}>
                            <option value=""></option>
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
              <button onClick={this.addNewTime} className="btn btn-primary" type="button"> Add time</button><br/><br/>
              </div>
              <div>
                <button id="submit" onClick={this.handleClick} type="button" className="btn btn-primary"> Submit </button>  
              </div>
          </div>
        </div>
      </div>
      

      );
    }
     return (
      <div className="panel panel-primary" style={bluePanelStyle}>
        <div className="panel-heading" style={bluePanelHeaderStyle}>
          {title}
        </div>
        <div className="panel-body" style={bluePanelBodyStyle}>
            <div id="time">
              Street address: <br/><input type="text" name="address" value={address} onChange={this.handleChange}/><br/><br/>
              City: <br/><input type="text" name="city" value={city} onChange={this.handleChange}/><br/><br/>
              State: <br/><select name="state" value={state} onChange={this.handleChange}>
                            <option value="-"></option>
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
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                          </select><br/><br/>
              Fee: <br/><input type="text" name="fee" value={fee} onChange={this.handleChange}/><br/><br/>
              <p id="chosenTimes"> Chosen times: {displayTimes}</p>            
              Day: <space> </space> <select name="day" id="day" value={day} onChange={this.handleChange}>
                                      <option value=""> </option>
                                      <option value="monday"> Monday</option>
                                      <option value="tuesday"> Tuesday</option>
                                      <option value="wednesday"> Wednesday</option>
                                      <option value="thursday"> Thursday</option>
                                      <option value="friday"> Friday</option>
                                      <option value="saturday"> Saturday</option>
                                      <option value="sunday"> Sunday</option>
                                      </select> <space></space>
              
              Start time: <space> </space>
                          <select name="startTime" id="time" value={startTime} onChange={this.handleChange}>
                            <option value=""></option>
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
              End time: <space> </space>
                          <select name="endTime" id="endTime" value={endTime} onChange={this.handleChange}>
                            <option value=""></option>
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
              <button onClick={this.addNewTime} type="button" className="btn btn-primary"> Add time</button><br/><br/>
              </div>
              <div>
                <button id="submit" onClick={this.handleClick} type="button" className="btn btn-primary"> Submit </button>  
                <text>     </text>
                <button onClick={this.remove} type="button" className="btn btn-primary">Delete</button>
              </div>
        </div>
      </div>

      );
    
  }

});

var drivewayDAO = 
{
  
  mixins: [History, Lifecycle],
  update: function(id, address, numCars, city, zip, state, times, fee, location)
  {
    var url = "/api/users/updateDriveway";
    $.ajax
    ({
      url: url,
      dataType: 'json',
      type: 'POST',
      data:
      {
        _id: id,
        address: address,
        numCars: numCars,
        city: city,
        zip: zip,
        state: state,
        times: times,
        fee: fee,
        location: location
      },
      async: false,
      success: function(res)
      {

      }.bind(this),
      error: function()
      {

      }.bind(this)
    });
  },
  queryID: function(id)
  {
    var url = "/api/users/queryID";
    var returnValue = {};
    $.ajax
    ({
      url: url,
      dataType: 'json',
      type: 'POST',
      data:
      {
        _id: id
      },
      async:false,
      success: function(res)
      {
        returnValue = res.driveway[0];
      }.bind(this),
      error: function()
      {
      }.bind(this)
    });
    return returnValue;
  },
  erase: function(id)
  {
    var url = "/api/users/deleteDriveway";
    $.ajax
    ({
        url: url,
        dataType: 'json',
        type: 'POST',
        data: 
        {
          _id: id
        },
        async:false,
        success: function(res) 
        { 
        }.bind(this),
        error: function()
        {
        }.bind(this)

      });
  },
  add: function(username, address, numCars, city, zip, state, times, fee, location)
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
            state: state,
            times: times,
            fee: fee,
            location
        },
        async:false,
        success: function(res) 
        {
          if(res.username == localStorage.username)
            location.href='/#/profile';
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
        async:false,
        success: function(res) 
        { 
          userDriveways = [];

          for(var i = 0; i < res.driveway.length; i++)
          {
            var temp = res.driveway[i];
            var tempDriveway = temp.address + ' ' + temp.city + ', ' + temp.state + ' ' + temp.zip + ' - ' + temp.numCars + ' car(s)';
            var link = '/driveway?_id='+ res.driveway[i]._id;
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
        async:false,
        success: function(res) 
        { 
          allDriveways = [];
          for(var i = 0; i < res.driveway.length; i++)
          {
            var temp = res.driveway[i];
            var address= temp.address;
            var city = temp.city;
            var state = temp.state;
            var zip = temp.zip;
            var numCars = temp.numCars;
            var times = temp.times;
            var fee = temp.fee;
            var json = {address, city, state, zip, numCars, times, fee};
            if(temp.username != localStorage.username)
            {
              allDriveways.push(json);
              allDriveways.push(React.createElement("br", null));
            }
          }
        }.bind(this),
        error: function()
        {
        }.bind(this)
    });
  }
};
var logOut = React.createClass
({
  mixins: [History, Lifecycle],
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
    this.history.pushState(null,'/Home');
  },
  render: function() {
    if(document.getElementById('navbar'))
      document.getElementById('navbar').style.marginBottom ='';
    //this.forceUpdate();
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
var errorStyle =
{
  width: '50%',
  marginLeft: '25%',
  visibility: 'hidden'
};
var bluePanelStyle = 
{
  marginLeft: '25%',
  width: '50%'
};
var bluePanelBodyStyle =
{
  textAlign: 'center',
  fontWeight: 'bold'
}
var bluePanelHeaderStyle =
{
  fontSize: '25px',
  fontWeight: 'bold',
  textAlign: 'center'
};
var signIn = React.createClass
({
  mixins: [History, Lifecycle],
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
    userDAO.login(this.state.username, this.state.password);
    if(signedIn == true)
    {
      localStorage.username = this.state.username;
      this.history.pushState(null, '/profile');
      this.forceUpdate();
      return;
    }

    document.getElementById('errorMessage').style.visibility = 'visible'
          
  },
  render: function() {
    if(document.getElementById('navbar'))
      document.getElementById('navbar').style.marginBottom ='';
    //this.forceUpdate();
    var username = this.state.username;
    var password = this.state.password;
    return (
      <div>
         <div className="panel panel-primary" style={bluePanelStyle}>
            <div className="panel-heading" style={bluePanelHeaderStyle}>
              Sign In!
            </div>
          <div className="panel-body" style={bluePanelBodyStyle}>
            Username: <br/><input type="text" name="username" value ={username} placeholder="Username" onChange={this.handleChange}/><br/><br/>
            Password: <br/><input type="password" name="password" value ={password} placeholder="Password" onChange={this.handleChange}/><br/>
            <br/><Link to="/forgottenPassword">Forgot your password?</Link><br/>
            <br/><button type="button" className="btn btn-primary" onClick={this.handleClick}>
              SIGN IN
              </button>
          </div>
          

          
        </div>
        <div id='errorMessage' className="alert alert-danger" role="alert" style={errorStyle}>
            <span className="glyphicon glyphicon-exclamation-sign" ariaHidden="true"></span>
            <span className="sr-only">Error:</span>
            Woops! It looks like this username/password combo is not in our system. Try again, or 
            request a password change.
        </div>
      </div>

      );
  }
});

var jumboStyle = 
{
  textAlign: 'center'
};

var fontStyle =
{
  fontSize: '20px'
};
var fontStyle2 =
{
  fontSize: '15px',
  fontWeight: 'bold',
  textAlign: 'center'
};
var buttonStyle=
{
  width: '10%'
};


var modalPage = React.createClass
({
  mixins: [History, Lifecycle],
  closeWindow: function()
  {
    this.history.pushState(null, '/home');
  },

  render: function() {
    var email = localStorage.email3;
    if(document.getElementById('navbar'))
      document.getElementById('navbar').style.marginBottom ='';
    //this.forceUpdate();
    return (

      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header" >
            <button type="button" className="close" data-dismiss="modal">&times;</button>
            <h4 className="modal-title" style={jumboStyle}>Thank You!</h4>
          </div>
          <div className="modal-body" style={fontStyle2}>
            <p>An email with the details of your reservation has been sent to {email}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={this.closeWindow} data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>

    );
  }


});

var orderDAO =
{
 
  getAll: function(last4, email)
  {
    var url = "/api/orders/getAllOrders";
    var Last4 = last4;
    var Email = email;
    console.log(Last4);
    var self = this;

    $.ajax
    ({
        url: url,
        dataType: 'json',
        type: 'POST',
        data: {
          last4: Last4,
          email: Email
        },
        async:false,
        success: function(res)
        {
          allOrders = [];
          temp2 = res.order[res.order.length-1];
  
        }.bind(this),
        error: function()
        {
          console.log("failure in orderDAQ");
        }.bind(this)

    });
    
  }
};



var findOrderStyle =
{
  fontSize: '25px',
  fontWeight: 'bold',
  textAlign: 'center'
};

var findOrderStyle2=
{
  textAlign: 'center'
}

var findOrders = React.createClass
({
  mixins: [History, Lifecycle],
  getInitialState: function()
  {
    return {email: ''}, {Last4: ''};
  },

  register: function()
  {

    var docUser = document.getElementById('errorUsername');
    var docEmail = document.getElementById('errorEmail');


    if(!this.state.email){
      docUser.style.visibility = 'visible';
      //docEmail.style.visibility = 'visible';
      //alert("Please enter an email address");
    }
    else if(this.state.email.length < 4){
      docUser.style.visibility = 'visible';
      //alert("INVALID EMAIL ADDRESS");
    }
    else if(!this.state.Last4){
      docUser.style.visibility = 'visible';
      //console.log("0");
      //alert("Please enter the last 4 digits of the credit card with which you reserved the parking location");
    }
    else if(this.state.Last4.length !==4){
      docUser.style.visibility = 'visible';
      //console.log("<4");
      //alert("Please enter the last 4 digits of the credit card with which you reserved the parking location");
    }
    else{
      orderDAO.getAll(this.state.Last4, this.state.email);
      if(!temp2){

      }
      if(temp2){
        this.history.pushState(null, '/pastOrders');
      }
      else{
       docUser.style.visibility = 'visible';


      }
    }
    
   
  },

  handleChange: function(event)
  {

    if(event.target.name == "email")
    {
      this.setState({email: event.target.value});
        //console.log(event.target.value);
    }
    else if(event.target.name == "Last4")
    {
      this.setState({Last4: event.target.value});
      //orderDAO.getAll(this.state.address, this.state.email);
        //console.log(event.target.value);
    }

  },

  render: function() {
    var email = this.state.email;
    var Last4 = this.state.Last4;
    var price = this.state.price;
    var streetA = "297 S 760 W";
    var zip = "84058";
    var state1 = "UT";
    var rDate = "12/12/16";
    var duration1 = "4";
    var rTime = "6:00 PM";
    var city = "orem"
    if(document.getElementById('navbar'))
      document.getElementById('navbar').style.marginBottom ='0';
    return (
      <div>
        <div className="row"></div>
         <div className="row">
         <div className="col-md-4"></div>
            <div className="col-md-4">
              <div className="panel panel-primary">
                <div className="panel-heading" style={findOrderStyle}>Order Lookup!</div>
                  <div className="panel-body">
                    <div className="form-group" style={findOrderStyle2}>
                    <label for="inputEmail3" class="col-sm-2 control-label">Email</label>
                      <input type="text" name="email" className="form-control" id="inputEmail3" placeholder="Email" value={email} onChange={this.handleChange}/><br/><br/>
                    <label for="inputLast4" class="col-sm-2 control-label">Last 4 CC Digits</label>
                      
                      <input type="text" name="Last4" className="form-control" id="inputEmail3" placeholder="Last 4 Digits" value ={Last4} onChange={this.handleChange}/><br/><br/>
                    <button type="button" className="btn btn-primary btn-lg" onClick={this.register}>GO!</button> 
                   </div>
                  </div>
                </div>
              </div>
            </div>
          <div id='errorUsername' className="alert alert-danger" role="alert" style={usernameFailStyle}>
          <span className="glyphicon glyphicon-exclamation-sign" ariaHidden="true"></span>
          <span className="sr-only">Error:</span>
          Woops! It looks like this email address and/or last 4 CC digits is incorrect!
        </div>
          <div id='errorEmail' className="alert alert-danger" role="alert" style={usernameFailStyle}>
          <span className="glyphicon glyphicon-exclamation-sign" ariaHidden="true"></span>
          <span className="sr-only">Error:</span>
          Woops! It looks like the last 4 digits of your credit card are incorrect!
        </div>
        
        </div>
      

      );
  }
});

var orderEmail =
{
 
  sendEmails: function(email)
  {
    var url = "/api/emailOrder";
    var email11 = email;
    console.log(temp2.price);
    $.ajax
    ({
        url: url,
        dataType: 'json',
        type: 'POST',
        data: {
          email: email11,
          email2: temp2.email,
          name: temp2.name1,
          cardType: temp2.cardType,
          last4: temp2.last4,
          totalP: temp2.price/100,
          resAdd: temp2.address,
          state: temp2.state,
          zipC: temp2.zip,
          dateOfRes: temp2.reservationDate,
          timeOfRes: temp2.reservationTime,
          resDur: temp2.reservationDuration,
          city: temp2.city

        },
        
        success: function(res)
        {
          console.log("success sendEmails");
  
        }.bind(this),
        error: function()
        {
          console.log("failure in orderDAQ");
        }.bind(this)

    });
   
  },
};

var recieptEmail =
{
 
  sendEmails: function(email)
  {
    var url = "/api/emailOrder";
    var email11 = email;
    
    $.ajax
    ({
        url: url,
        dataType: 'json',
        type: 'POST',
        data: {
          email: email11,
          email2: localStorage.email,
          name: localStorage.Name,
          cardType: localStorage.cardType,
          last4: localStorage.Last4,
          totalP: localStorage.price/100,
          resAdd: localStorage.ResAddress,
          state: localStorage.State,
          zipC: localStorage.Zip,
          dateOfRes: localStorage.ResDate,
          timeOfRes: localStorage.ResTime,
          resDur: localStorage.ResDuration,
          city: localStorage.City

        },
        
        success: function(res)
        {
          console.log("success sendEmails");
  
        }.bind(this),
        error: function()
        {
          console.log("failure in orderDAQ");
        }.bind(this)

    });
   
  },
};


var textColor =
{
  color: "white"
}
var fontWeights =
{
  fontWeight: "400"
}
var centerTexts =
{
  textAlign: "center"
}


var learnMore = React.createClass
({
  mixins: [History, Lifecycle],
  getInitialState: function()
  {
    return {email: ''}, {address: ''}, {price: ''};

  },

  handleChange: function(event)
  {

    if(event.target.name == "email")
    {
      this.setState({email: event.target.value});
        //console.log(event.target.value);
    }

  },
   

  render: function() {

    if(document.getElementById('navbar'))
      document.getElementById('navbar').style.marginBottom ='';
    
    return (
      <div>
        <div className="well">
          <div style={formStyle}>
           <h1>Frequently Asked Questions!</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="panel panel-primary">
              <div className="panel-heading" style={fontStyle2}>About Us</div>
              <div className="panel-body">
                <p style={fontWeights}><b>Parking Geek</b> is here to take care of all your event parking needs. Finding parking can be expensive and time consuming. With Parking Geek the hassles of finding a nice, close parking spot vanish. Simply locate your event on our map, find an open parking spot and reserve it. All thats left to do is enjoy your event!    
                
                 Parking Geek also provides everyone the opertunity to rent out their driveway to earn some extra cash. Simply follow the 4 steps provided in "How do I rent my driveway?" (located directly to your right) and you will be renting your driveway in just a few short minutes!</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="panel panel-primary">
              <div className="panel-heading" style={fontStyle2}>How do I rent my driveway?</div>
              <div className="panel-body">
                <p style={centerTexts}><b>Renting your driveway can be done in 4 easy steps</b></p>
                <p><b>Step 1:</b> Click "Sign Up"  on the top right corner of the page</p>
                <p><b>Step 2:</b> Fill out the sign up form and click "Sign UP"</p>
                <p><b>Step 3:</b> Click on "Order Lookup" in the navigation bar at the top of the page</p>
                <p><b>Step 4:</b> Lastly, click add a driveway on your profile page and provide the address and cost of the driveway you wish to rent</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="panel panel-primary">
              <div className="panel-heading" style={fontStyle2}>How do I reserve a Driveway?</div>
              <div className="panel-body">
                <p style={centerTexts}><b> Reserving a parking spot can be done in 4 easy steps!</b></p>
                <p><b>Step 1:</b> Click on the "Reserve Parking" tab in the nav-bar above</p>
                <p><b>Step 2:</b> Fill out a simple form regaring the details of your event</p>
                <p><b>Step 3:</b> Choose the parking spot you wish to reserve on the map</p>
                <p><b>Step 4:</b> Once you choose your parking spot click "pay" and the spot is yours!</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="panel panel-primary">
              <div className="panel-heading" style={fontStyle2}>What if I lose my receipt?</div>
              <div className="panel-body">
                <p style={centerTexts}><b>If you happen to lose your receipt simply use the following steps</b></p>
                <p><b>Step 1:</b> Click on "Order Lookup" in the navigation bar at the top of the page</p>
                <p><b>Step 2:</b> Enter the email address that you used to reserve your parking spot</p>
                <p><b>Step 3:</b> Enter the last 4 digits of the card you used to reserve your parking spot</p>
                <p>You will be automatically redirected to the page containing your order information</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <label for="comment">Comment:</label>
              <textarea className="form-control" rows="5" id="comment"></textarea>
            </div>
          </div>
        </div>
      </div>

      );
  }
});

var thanksStyle =
{
  display: 'none'
};

var textStyle=
{
  textAlign: 'center',
  fontWeight: '600'
  
};


var pastOrders = React.createClass
({
  mixins: [History, Lifecycle],
  getInitialState: function()
  {
    return {email: ''}, {address: ''}, {price: ''};

  },

  handleChange: function(event)
  {

    if(event.target.name == "email")
    {
      this.setState({email: event.target.value});
        //console.log(event.target.value);
    }

  },

  sendEm: function(event)
  {

    orderEmail.sendEmails(this.state.email);
    localStorage.email3 = this.state.email;
    var div1 = document.getElementById('bottomPanel');
    var div2 = document.getElementById('bottomPanel2');
    div1.style.display = 'none';
    div2.style.display = 'block';
    //this.history.pushState(null, '/modalPage');

  },

   

  render: function() {

    var email = this.state.email;
    var email2 = temp2.email;
    var name =  temp2.name1;
    var cardType =  temp2.cardType;
    var Last4 =  temp2.last4;
    var ReservedAddress =  temp2.address;
    var State =  temp2.state;
    var City =  temp2.city;
    var DOR = temp2.reservationDate;
    var ResTime = temp2.reservationTime;
    var resDur = temp2.reservationDuration+ " hours";
    var price2 = temp2.price/100;
    var price = price2;
    var ZIP =  temp2.zip;

    if(document.getElementById('navbar'))
      document.getElementById('navbar').style.marginBottom ='';
    //this.forceUpdate();
    
    
    return (
      <div>
        <div id= "title" className="well">
          <div style={formStyle}>
           <h1>Thank you for your order!</h1>
           <p>Plese save the following order confirmation and leave it in your windshield when you arrive at your destination</p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="panel panel-primary">
              <div className="panel-heading" style={fontStyle2}>Order Information</div>
              <div className="panel-body">
                <p><b>Reserved Address: </b>{ReservedAddress}</p>
                <p><b>State: </b>{State}</p>
                <p><b>Zip Code: </b>{ZIP}</p>
                <p><b>Date of Reservation: </b>{DOR}</p>
                <p><b>Reservation Time: </b>{ResTime}</p>
                <p><b>Reservation Duration: </b>{resDur}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="panel panel-primary">
              <div className="panel-heading" style={fontStyle2}>Personal Information</div>
              <div className="panel-body">
                <p><b>Name: </b>{name}</p>
                <p><b>Email: </b>{email2}</p>
                <p><b>Card Type: </b>{cardType}</p>
                <p><b>Last 4 Digits: </b>{Last4}</p>
                <p><b>Price: </b>{price}</p>
                <p><b>Total Amount due: </b>$0.00</p>
              </div>
            </div>
          </div>
        </div>
        <div id ="bottomPanel" className="row">
          <div className="col-md-12">
            <div className="panel panel-primary">
              <div className="panel-heading" style={fontStyle2}>Email Me!</div>
              <div className="panel-body">
                <p style={jumboStyle}><b>If you would like to recieve a copy of your reciept please proivde the email at which you would like to recieve the confirmation below. </b></p>
                <div style={jumboStyle}>
                  Email: <input type="text" name="email" value={email} onChange={this.handleChange}/>
                   <button type="button" className="btn btn-primary btn-md" onClick={this.sendEm}>SEND!</button> 
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="bottomPanel2" className="row" style={thanksStyle}>
          <div className="col-md-12">
            <div className="panel panel-primary">
              <div className="panel-heading" style={fontStyle2}>Email Me!</div>
              <div className="panel-body">
                <p style={textStyle}>Thank you for your request. An email as been sent to {email} </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      );
  }
});

var pay = React.createClass
({
  contextTypes: {
        router: React.PropTypes.func
  },

  getInitialState: function()
  {
    return {email: ''}, {address: ''}, {price: ''};
  },
  handleChange: function(event)
  {

    if(event.target.name == "email")
    {
      this.setState({email: event.target.value});
    }
    else if(event.target.name == "address")
    {
      this.setState({address: event.target.value});
    }
    else if(event.target.name == "price")
    {
    this.setState({price: event.target.value});
    }

  },

  render: function() {
    var email = this.state.email;
    var address = this.state.address;
    var price = this.state.price;
    var streetA = "297 S 760 W";
    var zip = "84058";
    var state1 = "UT";
    var rDate = "12/12/16";
    var duration1 = "4";
    var rTime = "6:00 PM";
    var city = "orem"

    var drivewayId = 12345;
    var owner = "John David";
    if(document.getElementById('navbar'))
      document.getElementById('navbar').style.marginBottom ='';
    //this.forceUpdate();
    var data = {event: {Email: email, Address: address, Price: price, street: streetA, zip1: zip, state: state1, resDate: rDate, duration: duration1, resTime: rTime, city: city, drivewayId: drivewayId, owner: owner}, parking: []};
    return (

         <div style={formStyle}>
            Email: <br/><input type="text" name="email" value={email} onChange={this.handleChange}/><br/><br/>
            Address: <br/><input type="text" name="address" value ={address} onChange={this.handleChange}/><br/><br/>
            Price: <br/><input type="text" name="price" value ={price} onChange={this.handleChange}/><br/>
           <input type="radio">
            I agree to the <a href="terms.html">terms of service</a>
            </input><br/><br/>
            <CheckoutStrip data={data}/>
        </div>


      );
  }
});




var confirmPage = React.createClass
({
  mixins: [History, Lifecycle],
  getInitialState: function()
  {
    return {email: ''}, {address: ''}, {price: ''};

  },

  handleChange: function(event)
  {

    if(event.target.name == "email")
    {
      this.setState({email: event.target.value});
    }

  },

  sendEm: function(event)
  {

    recieptEmail.sendEmails(this.state.email);
    localStorage.email3 = this.state.email;
    var div1 = document.getElementById('bottomPanel');
    var div2 = document.getElementById('bottomPanel2');
    div1.style.display = 'none';
    div2.style.display = 'block';
    //this.history.pushState(null, '/modalPage');

  },

  render: function() {

    var email = this.state.email;
    var email2 =  localStorage.email;
    var name = localStorage.Name;
    var cardType = localStorage.cardType;
    var Last4 =  localStorage.Last4;
    var ReservedAddress = localStorage.ResAddress;
    var State = localStorage.State;
    var City = localStorage.City;
    var DOR = localStorage.ResDate;
    var ResTime =  localStorage.ResTime;
    var resDur = localStorage.ResDuration + " hours";
    var price2 = localStorage.price/100;
    var price =  price2;
    var ZIP = localStorage.Zip;
    if(document.getElementById('navbar'))
      document.getElementById('navbar').style.marginBottom ='';
    //this.forceUpdate();
    
    
    return (
      <div>
        <div className="well">
          <div style={formStyle}>
           <h1>Thank you for your order!</h1>
           <p>Plese save the following order confirmation and leave it in your windshield when you arrive at your destination</p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="panel panel-primary">
              <div className="panel-heading" style={fontStyle2}>Order Information</div>
              <div className="panel-body">
                <p><b>Reserved Address: </b>{ReservedAddress}</p>
                <p><b>State: </b>{State}</p>
                <p><b>Zip Code: </b>{ZIP}</p>
                <p><b>Date of Reservation: </b>{DOR}</p>
                <p><b>Reservation Time: </b>{ResTime}</p>
                <p><b>Reservation Duration: </b>{resDur}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="panel panel-primary">
              <div className="panel-heading" style={fontStyle2}>Personal Information</div>
              <div className="panel-body">
                <p><b>Name: </b>{name}</p>
                <p><b>Email: </b>{email2}</p>
                <p><b>Card Type: </b>{cardType}</p>
                <p><b>Last 4 Digit: </b>{Last4}</p>
                <p><b>Total Price: </b>${price}</p>
                <p><b>Total Amount due: </b>$0.00</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div id="bottomPanel" className="col-md-12">
            <div className="panel panel-primary">
              <div className="panel-heading" style={fontStyle2}>Email Me!</div>
              <div className="panel-body">
                <p style={jumboStyle}><b>If you would like to recieve a copy of your reciept please proivde the email at which you would like to recieve the confirmation below. </b></p>
                <div style={jumboStyle}>
                  <b>Email: </b> <input type="text" name="email" value={email} onChange={this.handleChange}/>
                  <button type="button" className="btn btn-primary btn-md" onClick={this.sendEm}>SEND!</button> 
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="bottomPanel2" className="row" style={thanksStyle}>
          <div className="col-md-12">
            <div className="panel panel-primary">
              <div className="panel-heading" style={fontStyle2}>Email Me!</div>
              <div className="panel-body">
                <p style={textStyle}>Thank you for your request. An email as been sent to {email} </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      );
  }
});
var signUpForm =
{
  textAlign: 'center'
};
var signUpJumbo =
{
  width: '50%',
  marginLeft: '25%',
  position: 'center'
};
var redBorder =
{
  border: '2px solid red'
};

var signUp = React.createClass
({
  getInitialState: function() 
  {
    return {email: ''}, {username: ''}, {password: ''}, {confirmPassword: ''}, {errorMessage: ''};
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


    this.forceUpdate();
  },
  register: function()
  {
    if(this.state.password !== this.state.confirmPassword)
    {

      document.getElementById('differentPasswords').style.visibility = 'visible';
      document.getElementById('shortPasswords').style.visibility = 'hidden';
      document.getElementById('termsError').style.visibility = 'hidden';
      document.getElementById('duplicateUsername').style.visibility = 'hidden';
      document.getElementById('duplicateEmail').style.visibility = 'hidden';
    }
    else if(this.state.password.length < 8)
    {
      document.getElementById('differentPasswords').style.visibility = 'hidden';
      document.getElementById('shortPasswords').style.visibility = 'visible';
      document.getElementById('termsError').style.visibility = 'hidden';
      document.getElementById('duplicateUsername').style.visibility = 'hidden';
      document.getElementById('duplicateEmail').style.visibility = 'hidden';
    }
    else if(!this.terms)
    {
      document.getElementById('differentPasswords').style.visibility = 'hidden';
      document.getElementById('shortPasswords').style.visibility = 'hidden';
      document.getElementById('termsError').style.visibility = 'visible';
      document.getElementById('duplicateUsername').style.visibility = 'hidden';
      document.getElementById('duplicateEmail').style.visibility = 'hidden';
    }
    else
    {
      var email = userDAO.findEmail(this.state.email);
      console.log(email);
      if(email != 'none')
      {
        document.getElementById('differentPasswords').style.visibility = 'hidden';
        document.getElementById('shortPasswords').style.visibility = 'hidden';
        document.getElementById('termsError').style.visibility = 'hidden';
        document.getElementById('duplicateUsername').style.visibility = 'hidden';
        document.getElementById('duplicateEmail').style.visibility = 'visible';
        return;
      }
    }
    var userMessage = userDAO.register(this.state.email, this.state.username, this.state.password);
    if(userMessage == "FAILED")
    {
      document.getElementById('differentPasswords').style.visibility = 'hidden';
      document.getElementById('shortPasswords').style.visibility = 'hidden';
      document.getElementById('termsError').style.visibility = 'hidden';
      document.getElementById('duplicateUsername').style.visibility = 'visible';
      document.getElementById('duplicateEmail').style.visibility = 'hidden';
    }
  },
  handleTerms: function()
  {
    this.terms = !this.terms;
    if(this.terms)
    {
      document.getElementById('terms').checked = true;
      document.getElementById('termsError').style.visibility = 'hidden';
    }
    else
    {
      document.getElementById('terms').checked = false;
    }
  },
  render: function() {
    if(document.getElementById('navbar'))
      document.getElementById('navbar').style.marginBottom ='';
    //this.forceUpdate();
    var email = this.state.email;
    var username = this.state.username;
    var password = this.state.password;
    var confirmPassword = this.state.confirmPassword;
    //<div className="glyphicon glyphicon-ok" display='none'></div>  <br/>
    if(document.getElementById('password'))
    {
      if(password == '' || confirmPassword == '')
      {

      }
      else if(password != confirmPassword)
      {
        document.getElementById('password').style.border ='2px solid red';
        document.getElementById('confirmPassword').style.border = '2px solid red';
      }
      else
      {
        document.getElementById('password').style.border ='2px solid #00FF00';
        document.getElementById('confirmPassword').style.border = '2px solid #00FF00';
      }

    }
    return (
      <div>
        <div className="panel panel-primary" style={bluePanelStyle}>
          <div className="panel-heading" style={bluePanelHeaderStyle}>
            Sign up for Driveway! 
          </div>
          <div className="panel-body" style={bluePanelBodyStyle}>
           
                Email: <br/><input type="text" name="email" value={email} onChange={this.handleChange}/><br/><br/>
                Username: <br/><input type="text" name="username" value ={username} onChange={this.handleChange}/><br/><br/>
                <div className='password'>
                  Password: <br/><input id='password' type="password" name="password" value ={password} onChange={this.handleChange}/>
                </div>

                <div className='confirmPassword'>
                  Confirm Password: <br/><input id='confirmPassword' type="password" name="confirmPassword" value ={confirmPassword} onChange={this.handleChange}/><br/><br/>
                </div>
                <input type="radio" onClick={this.handleTerms} id="terms"> 
                  I agree to the <a href="randomHTMLFiles/terms.html">terms and conditions</a>
                </input><br/><br/>
                <input type="button" className="btn btn-primary" value="SIGN UP" onClick={this.register}/> 
            
           </div>
          </div>
          <div id='duplicateUsername' className="alert alert-danger" role="alert" style={passwordFailStyle}>
            <span className="glyphicon glyphicon-exclamation-sign" ariaHidden="true"></span>
            <span className="sr-only">Error:</span>
            Woops! It looks like that username belongs to somebody else.
          </div>
          <div id='duplicateEmail' className="alert alert-danger" role="alert" style={passwordFailStyle}>
            <span className="glyphicon glyphicon-exclamation-sign" ariaHidden="true"></span>
            <span className="sr-only">Error:</span>
            Woops! Looks like that email belongs to somebody else.
         </div>
          <div id='differentPasswords' className="alert alert-danger" role="alert" style={passwordFailStyle}>
            <span className="glyphicon glyphicon-exclamation-sign" ariaHidden="true"></span>
            <span className="sr-only">Error:</span>
            Woops! Those passwords are not the same!
         </div>
         <div id='shortPasswords' className="alert alert-danger" role="alert" style={passwordFailStyle}>
          <span className="glyphicon glyphicon-exclamation-sign" ariaHidden="true"></span>
          <span className="sr-only">Error:</span>
          Woops! Passwords must be greater than 7 characters!
         </div>
         <div id='termsError' className="alert alert-danger" role="alert" style={passwordFailStyle}>
          <span className="glyphicon glyphicon-exclamation-sign" ariaHidden="true"></span>
          <span className="sr-only">Error:</span>
          Woops! It looks like you need to accept the terms and conditions!
         </div>
        </div>


      );
  }
});



var centerPasswordForm =
{
  textAlign: 'center'
};
var forgottenPasswordJumboTron =
{
  width: '50%',
  marginLeft: '25%',
  textAlign: 'center'
};
var usernameFailStyle =
{
  width: '50%',
  marginLeft: '25%',
  visibility: 'hidden'
};
var forgottenPassword = React.createClass
({
  getInitialState: function() 
  {
    return {email: '', username: ''};
  },
  handleChange: function(event)
  {
    if(event.target.name == 'email')
      this.setState({email: event.target.value});
    else if(event.target.name =='username')
      this.setState({username: event.target.value});

  },
  sendEmail: function()
  {
    var id = userDAO.getID(this.state.username);
    var docUser = document.getElementById('errorUsername');
    var docEmail = document.getElementById('errorEmail');
    if(id == 'nope')
    {
      docUser.style.visibility = 'visible'
      docEmail.style.visibility = 'hidden';
      this.forceUpdate();
      return;
    }
    var user = userDAO.get(id);

    var email = this.state.email;
    if(user.email != email)
    {
      docUser.style.visibility = 'hidden';
      docEmail.style.visibility = 'visible';
      this.forceUpdate();
      return;
    }

    userDAO.sendEmail(email, id);
    location.href='/#/sentEmail';
  },
  render: function()
  {
    var email = this.state.email;
    var username = this.state.username;
    if(document.getElementById('navbar'))
      document.getElementById('navbar').style.marginBottom ='';
    //this.forceUpdate();
    return(
      <div>
        <div className="alert alert-info" role="alert" style={centerPasswordForm}>
          Enter in your username and email, if your username is actually in the system,
          an email will be sent to reset your password.
        </div>
        <div className="panel panel-primary" style={bluePanelStyle}>
          <div className="panel-heading" style={bluePanelHeaderStyle}>
            Forgotten Password 
          </div>
          <div className="panel-body" style={bluePanelBodyStyle}>
            Email: <br/><input type="text" name="email" value={email} onChange={this.handleChange} placeholder="Email"/> <br/><br/>
            Username: <br/><input type="text" name="username" value={username} onChange={this.handleChange} placeholder="Username"/><br/><br/>
            <button type="button" className="btn btn-primary" onClick={this.sendEmail}> Submit </button>
          </div>
        </div>
        <div id='errorUsername' className="alert alert-danger" role="alert" style={usernameFailStyle}>
          <span className="glyphicon glyphicon-exclamation-sign" ariaHidden="true"></span>
          <span className="sr-only">Error:</span>
          Woops! It looks like this username does not exist!
        </div>
        <div id='errorEmail' className="alert alert-danger" role="alert" style={usernameFailStyle}>
          <span className="glyphicon glyphicon-exclamation-sign" ariaHidden="true"></span>
          <span className="sr-only">Error:</span>
          Woops! It looks like the email listed under this username is not that one!
        </div>
      </div>
    );
  }
});

var updatePasswordStyle =
{
  width: '50%',
  marginLeft: '25%',
  textAlign: 'center'
};
var passwordFailStyle = 
{
  width: '50%',
  marginLeft: '25%',
  textAlign: 'center',
  visibility: 'hidden'
};
var updatePassword = React.createClass
({
  getInitialState: function() 
  {
    return {password: '', confirmPassword: ''};
  },
  handleChange: function(event)
  {
    if(event.target.name == 'password')
      this.setState({password: event.target.value});
    else if(event.target.name == 'confirmPassword')
      this.setState({confirmPassword: event.target.value});
     document.getElementById('shortPasswords').style.visibility = 'hidden';
     document.getElementById('differentPasswords').style.visibility = 'hidden';
  },
  changePassword: function()
  {
    if(this.state.password != this.state.confirmPassword)
    {
      document.getElementById('differentPasswords').style.visibility = 'visible';
      document.getElementById('shortPasswords').style.visibility = 'hidden';
      return;
    }
    else if(this.state.password.length < 8)
    {
      document.getElementById('differentPasswords').style.visibility = 'hidden';
      document.getElementById('shortPasswords').style.visibility = 'visible';
      return;
    }

    var id = get('id');
    var user = userDAO.get(id);


    userDAO.updatePassword(id, user.username, user.email, this.state.password);

  },
  render: function()
  {
    if(document.getElementById('navbar'))
      document.getElementById('navbar').style.marginBottom ='';
    //this.forceUpdate();
    var password = this.state.password;
    var confirmPassword = this.state.confirmPassword;

    if(document.getElementById('password'))
    {
      if(password == '' || confirmPassword == '')
      {

      }
      else if(password != confirmPassword)
      {
        document.getElementById('password').style.border ='2px solid red';
        document.getElementById('confirmPassword').style.border = '2px solid red';
      }
      else
      {
        document.getElementById('password').style.border ='2px solid #00FF00';
        document.getElementById('confirmPassword').style.border = '2px solid #00FF00';
      }

    }
    //get by id and return the username if the get works
    return(

      <div>
        <div className="panel panel-primary" style={bluePanelStyle}>
          <div className="panel-heading" style={bluePanelHeaderStyle}>
            Update password
          </div>
          <div className="panel-body" style={bluePanelBodyStyle}>
        
            Password: <br/><input id="password" type="password" value={password} name="password" onChange={this.handleChange} placeholder="Password"/><br/><br/>
            Confirm password: <br/><input id="confirmPassword" type="password" value={confirmPassword} name="confirmPassword" onChange={this.handleChange} placeholder="Confirm password" /><br/><br/>
            <button type="button" className="btn btn-primary" onClick={this.changePassword}> Submit </button>
          </div>
        </div>  
         <div id='differentPasswords' className="alert alert-danger" role="alert" style={passwordFailStyle}>
          <span className="glyphicon glyphicon-exclamation-sign" ariaHidden="true"></span>
          <span className="sr-only">Error:</span>
          Woops! Those passwords are not the same!
         </div>
         <div id='shortPasswords' className="alert alert-danger" role="alert" style={passwordFailStyle}>
          <span className="glyphicon glyphicon-exclamation-sign" ariaHidden="true"></span>
          <span className="sr-only">Error:</span>
          Woops! Passwords must be greater than 7 characters!
         </div>
      </div>
    );
  }
});
var sentEmailStyle = 
{
  width: '50%',
  marginLeft: '25%',
  textAlign: 'center'
};
var sentEmail = React.createClass
({
  render: function()
  {
    if(document.getElementById('navbar'))
      document.getElementById('navbar').style.marginBottom ='';
    //this.forceUpdate();
    return (
      <div>
       <div className="alert alert-success" role="alert" style={sentEmailStyle}>
          <span className="glyphicon glyphicon-exclamation-sign" ariaHidden="true"></span>
            An email has been sent to you containing instructions to reset your password.
         </div>
      </div>
      );
  }
});
// Run the routes
var routes = (
      <Router>
        <Route name="app" path="/" component={App} handler={App}>
          <IndexRoute component={Home} />
          <Route name="home" path="/home" component={Home}/>
          <Route name="updatePassword" path="/updatePassword" component={updatePassword} />
          <Route name="learn" path="/learn" component={learnMore} /> 
          <Route name="allDriveways" path="/allDriveways" component={allDriveways} /> 
          <Route name="pay" path="/pay" component={pay} />
          <Route name="reserveParking" path="/reserveparking" component={ReserveParking} /> 
          <Route name="driveway" path="/driveway" component={driveway} />
          <Route name="signUp" path="/signUp" component={signUp} />
          <Route name="signIn" path="/signIn" component={signIn}/>
          <Route name="logOut" path="/logOut" component={logOut}/>
          <Route name="profile" path="/profile" component={profile}/>
          <Route name="confirm" path="/confirm" component={confirmPage} /> 
          <Route name="lookup" path="/lookup" component={findOrders}/>
          <Route name="pastOrders" path="/pastOrders" component={pastOrders}/>
          <Route name="forgottenPassword" path="/forgottenPassword" component={forgottenPassword}/>
          <Route name="sentEmail" path="/sentEmail" component={sentEmail}/>
          <Route name="sentEmail" path="/modalPage" component={modalPage}/>
        </Route>
      </Router>
);

ReactDOM.render(routes, document.getElementById('content'));