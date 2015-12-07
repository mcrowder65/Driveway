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
var {Lifecycle} = require('react-router');
var history = useBasename(createHistory)({
    basename: '/transitions'
})
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
var App = React.createClass({
  render: function() 
  {
    drivewayDAO.getAll();
    if(!localStorage.username)
    {
      return(
        <div>
          <nav className="navbar navbar-default" role="navigation">
            <div className="nav navbar-nav navbar-left">                
              <Link className="navbar-brand" to="/home">Home</Link>                  
              <Link className="navbar-brand" to="/learn">Learn</Link>              
              <Link className="navbar-brand" to="/map">Map</Link>  
              <Link className="navbar-brand" to="/reserveparking">Reserve Parking</Link>  
              <Link className="navbar-brand" to="/pay">Pay</Link> 

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
            <nav className="navbar navbar-default" role="navigation">
              <div className="nav navbar-nav navbar-left">                
                <Link className="navbar-brand" to="">Home</Link>                  
                <Link className="navbar-brand" to="/learn">Learn</Link>              
                <Link className="navbar-brand" to="/reserveparking">Reserve Parking</Link>  
                <Link className="navbar-brand" to="/pay">Pay</Link> 
                <Link className="navbar-brand" to="/confirm">Confirm Page</Link> 
                <Link className="navbar-brand" to="/lookup">Order Lookup</Link> 
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

var homeStyle =
{
  textAlign: 'center',
  width: '100%',
  fontFamily: 'Calibri',
  fontSize: '30',
  align: 'center'
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
var Home = React.createClass
({
  mixins: [History, Lifecycle],
  getInitialState: function() 
  {
    return {address:''};
  },
  goToMap: function()
  {
    location.href='/#/map?' + this.state.address;
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
    return (
    <div>

      <div className="jumbotron" style={homeStyle}>
        <p> Better parking is just a few clicks away </p>
        <div className="row">
          <div className="input-group">
            <input type="text" className="form-control" value={address} onChange={this.handleChange} placeholder="Search the address of an event"/>
            <span className="input-group-btn">
              <button className="btn btn-default" type="button" onClick={this.goToMap}>Go!</button>
            </span>
          </div>
        </div>
      </div>


      <div className="panel panel-primary">
        <span className="glyphicon glyphicon-apple" aria-hidden="true"></span>
        <div className="panel-body" style={center}> 
          <h3>Rent out your driveway</h3>
          <p>Easy as 1...2...3...</p>
          <button className="btn btn-default btn-lg dropdown-toggle" type="button" onClick={this.goToLearn}>
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
    return (
     <div>
      <p>{allDriveways} </p>
      </div>
    );
  }
});

var ReserveParking = React.createClass({
  render: function() {
    return (
      <ReservationForm/>
    );
  }
});


var profile = React.createClass
({
  render: function() 
  {
      return (
       <div>
        <h1 style={center}> {localStorage.username.toUpperCase()} </h1>
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
              day: '', editing: true,  displayTimes: displayTimes, id: id, fee: fee};
    }
    else
        return {address: '', numCars: '1', zip:'', city: '', state:'', editing: false, 
                startTime: '', endTime: '', day: '', times: [], displayTimes: [], fee: fee};
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
    if(this.state.state == '')
      alert('You must pick a state');

    if(this.state.editing)
      drivewayDAO.update(this.state.id, this.state.address, this.state.numCars, this.state.city, 
                         this.state.zip, this.state.state, this.state.times, this.state.fee);
    else
      drivewayDAO.add(localStorage.username, this.state.address, this.state.numCars, this.state.city, 
                      this.state.zip, this.state.state, this.state.times, this.state.fee);
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
      displayTimes.push(React.createElement(Button, {onClick:this.deleteTime, id: id}, 'Delete'));
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
        displayTimes.push(React.createElement(Button, {onClick:this.deleteTime, id: id}, 'Delete'));
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
    if(!this.state.editing)
    {
      return (
      <div>
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
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                      </select><br/><br/>
          Fee: <br/><input type="text" name="fee" value={fee} onChange={this.handleChange}/><br/><br/>
          <p id='chosenTimes'> Chosen times: {displayTimes}</p>            
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
          <button onClick={this.addNewTime}> Add time</button><br/><br/>
          </div>
          <div>
            <button id='submit' onClick={this.handleClick}> Submit </button>  
          </div>
      </div>
      

      );
    }
    else
    {
      return (
      <div>
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
                      </select><br/><br/>
          Fee: <br/><input type="text" name="fee" value={fee} onChange={this.handleChange}/><br/><br/>
          <p id='chosenTimes'> Chosen times: {displayTimes}</p>            
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
          <button onClick={this.addNewTime}> Add time</button><br/><br/>
          </div>

        <div>
          <br/><br/><button onClick={this.handleClick}>
          Submit
          </button>
          <text>     </text>
          <button onClick={this.remove}>
          Delete</button>
        </div>
      </div>

      );
    }
    
  }

});

var drivewayDAO = 
{
  
  mixins: [History, Lifecycle],
  update: function(id, address, numCars, city, zip, state, times, fee)
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
        fee: fee
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
  add: function(username, address, numCars, city, zip, state, times, fee)
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
            fee: fee
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
    var username = this.state.username;
    var password = this.state.password;
    return (
       <div style={formStyle}>
        <div className='jumbotron' style={signUpJumbo}>
          Username: <br/><input type="text" name="username" value ={username} onChange={this.handleChange}/><br/><br/>
          Password: <br/><input type="password" name="password" value ={password} onChange={this.handleChange}/><br/>
          <br/><Link to="/forgottenPassword">Forgot your password?</Link><br/>
          <br/><button onClick={this.handleClick}>
            SIGN IN
            </button>
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

    if(!this.state.email){
      alert("Please enter an email address");
    }
    else if(this.state.email.length < 4){
      alert("INVALID EMAIL ADDRESS");
    }
    else if(!this.state.Last4){
      console.log("0");
      alert("Please enter the last 4 digits of the credit card with which you reserved the parking location");
    }
    else if(this.state.Last4.length !==4){
      console.log("<4");
      alert("Please enter the last 4 digits of the credit card with which you reserved the parking location");
    }
    else{
      orderDAO.getAll(this.state.Last4, this.state.email);
      if(temp2){
        this.history.pushState(null, '/pastOrders');
      }
      else{
       alert("Your Email and/or credit card is invalid");

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
          <div className="col-md-4"></div>
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
    this.history.pushState(null, '/home');

  },

   

  render: function() {

    var email = this.state.email;
    var email2 = "Email: " + temp2.email;
    var name = "Name: " + temp2.name1;
    var cardType = "Card Type: " + temp2.cardType;
    var Last4 = "Last 4 Digits: " + temp2.last4;
    var ReservedAddress = "Reserved Address: " + temp2.address;
    var State = "State: " + temp2.state;
    var City = "City: " + temp2.city;
    var DOR = "Date of Reservation: " + temp2.reservationDate;
    var ResTime = "Email: " + temp2.reservationTime;
    var resDur = "Reservation Duration: " + temp2.reservationDuration+ " hours";
    var price2 = temp2.price/100;
    console.log(price2);
    var price = "Total Price: $" + price2;
    var ZIP = "Zip Code: " + temp2.zip;

    
    
    
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
                <p>{ReservedAddress}</p>
                <p>{State}</p>
                <p>{ZIP}</p>
                <p>{DOR}</p>
                <p>{ResTime}</p>
                <p>{resDur}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="panel panel-primary">
              <div className="panel-heading" style={fontStyle2}>Personal Information</div>
              <div className="panel-body">
                <p>{name}</p>
                <p>{email2}</p>
                <p>{cardType}</p>
                <p>{Last4}</p>
                <p>{price}</p>
                <p>Total Amount due: $0.00</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="panel panel-primary">
              <div className="panel-heading" style={fontStyle2}>Email Me!</div>
              <div className="panel-body">
                <p style={jumboStyle}>If you would like to recieve a copy of your reciept please proivde the email at which you would like to recieve the confirmation below. </p>
                <div style={jumboStyle}>
                  Email: <input type="text" name="email" value={email} onChange={this.handleChange}/>
                   <button type="button" className="btn btn-primary btn-lg" onClick={this.sendEm}>SEND!</button> 
                </div>
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
  fontSize: '25px',
  fontWeight: 'bold',
  textAlign: 'center'
};
var buttonStyle=
{
  width: '10%'
}

var confirmPage = React.createClass
({
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

  render: function() {

    var email = this.state.email;
    var email2 = "Email: " + localStorage.email;
    var name = "Name: " + localStorage.Name;
    var cardType = "Card Type: " + localStorage.cardType;
    var Last4 = "Last 4 Digits: " + localStorage.Last4;
    var ReservedAddress = "Reserved Address: " + localStorage.ResAddress;
    var State = "State: " + localStorage.State;
    var City = "City: " + localStorage.City;
    var DOR = "Date of Reservation: " + localStorage.ResDate;
    var ResTime = "Email: " + localStorage.ResTime;
    var resDur = "Reservation Duration: " + localStorage.ResDuration + " hours";
    var price2 = localStorage.price/100;
    var price = "Total Price: $" + price2;
    var ZIP = "Zip Code: " + localStorage.Zip;
    
    
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
                <p>{ReservedAddress}</p>
                <p>{State}</p>
                <p>{ZIP}</p>
                <p>{DOR}</p>
                <p>{ResTime}</p>
                <p>{resDur}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="panel panel-primary">
              <div className="panel-heading" style={fontStyle2}>Personal Information</div>
              <div className="panel-body">
                <p>{name}</p>
                <p>{email2}</p>
                <p>{cardType}</p>
                <p>{Last4}</p>
                <p>{price}</p>
                <p>Total Amount due: $0.00</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="panel panel-primary">
              <div className="panel-heading" style={fontStyle2}>Email Me!</div>
              <div className="panel-body">
                <p style={jumboStyle}>If you would like to recieve a copy of your reciept please proivde the email at which you would like to recieve the confirmation below. </p>
                <div style={jumboStyle}>
                  Email: <input type="text" name="email" value={email} onChange={this.handleChange}/>
                  <a className="btn btn-primary btn-sm" href="#" role="button">Learn more</a>
                </div>
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


    this.forceUpdate();
  },
  register: function()
  {
    if(this.state.password !== this.state.confirmPassword)
        return;
    else if(this.state.password.length < 8)
    {
      alert("Your password must be greater than 7 characters");
    }
    else if(!this.terms)
      alert("You need to accept the terms and conditions");
    else
        userDAO.register(this.state.email, this.state.username, this.state.password);
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
          <div style={center}>
            <h1> Sign up for Driveway! </h1>
          </div>
          <div style={signUpForm}>
           <div className="jumbotron" style={signUpJumbo}>
           
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
                <input type="submit" value="SIGN UP" onClick={this.register}/> 
            
           </div>
          </div>
        </div>


      );
  }
});
var userDAO = 
{
  mixins: [History, Lifecycle],
  register: function(email, username, password)
  {
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
        }.bind(this),
        error: function()
        {
        }.bind(this)
    });
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
  }
};


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
    
  },
  render: function()
  {
    var email = this.state.email;
    var username = this.state.username;
    return(
      <div>
        <div className="alert alert-info" role="alert" style={centerPasswordForm}>
          Enter in your username and email, if your username is actually in the system,
          an email will be sent to reset your password.
        </div>
        <h1 style={centerPasswordForm}> Forgotten Password </h1>
        <div className="jumbotron" style={forgottenPasswordJumboTron}>
          Email: <br/><input type="text" name="email" value={email} onChange={this.handleChange}/><br/><br/>
          Username: <br/><input type="text" name="username" value={username} onChange={this.handleChange}/><br/><br/>
          <button onClick={this.sendEmail}> Submit </button>
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
        <h1 style={center}> Update password for</h1>
        <div className="jumbotron" style={updatePasswordStyle}>
          Password: <br/><input id="password" type="password" value={password} name="password" onChange={this.handleChange}/><br/><br/>
          Confirm password: <br/><input id="confirmPassword" type="password" value={confirmPassword} name="confirmPassword" onChange={this.handleChange}/><br/><br/>
          <button onClick={this.changePassword}> Submit </button>
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
// Run the routes
var routes = (
      <Router>
        <Route name="app" path="/" component={App} handler={App}>
          <IndexRoute component={Home} />
          <Route name="home" path="/home" component={Home}/>
          <Route name="updatePassword" path="/updatePassword" component={updatePassword} />
          <Route name="learn" path="/learn" component={learn} /> 
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
        </Route>
      </Router>
);

ReactDOM.render(routes, document.getElementById('content'));

