var React = require('react');
ReactDOM = require('react-dom');
var ParkingMap = require('./ParkingMap.js');
var CheckoutStrip = require('./StripePayment.js');

var ReservationForm = React.createClass({
  contextTypes: {
        router: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      email: '',
      address: '',
      date: '',
      time: '',
      mapData: {event: {address: "156 East 200 North, Provo, UT 84606, USA", date: "", time: ""}, markers: []},
      payData: {event: {Email: "", Address: "", Price: "", street: "", zip1: "", state: "", resDate: "", duration: "", resTime: "", city: "", drivewayId: "", owner: ""}, parking: []},
      showPay: false
    }      
  },

  getReservations: function(){
    var url = "/api/users/getAllReservations";
    var reservations;
    $.ajax
    ({
        url: url,
        dataType: 'json',
        type: 'POST',
        data: {},
        async: false,
        success: function(res) 
        { 
          reservations = res.reservations;
        },
        error: function()
        {
          console.log("failure");
        }
    });
    return reservations;
  },

  getDriveways: function(){
    var url = "/api/users/getAllDriveways";
    var driveways;
    $.ajax
    ({
        url: url,
        dataType: 'json',
        type: 'POST',
        data: {},
        async: false,
        success: function(res) 
        { 
          driveways = res.driveway;
        },
        error: function()
        {
          console.log("failure");
        }
    });
    return driveways;
  },

  filterDriveways: function(driveways, reservations){
    var filteredDriveways = [];
    for(var i = 0; i < driveways.length; i++){
      var reserved = false;
      for(var j = 0; j < reservations.length; j++){
        if(reservations[j].drivewayId == driveways[i]._id){
          reserved = true;
          break;
        }
      }      
      if(!reserved){
        filteredDriveways.push(driveways[i]);
      }
    }
    return filteredDriveways;
  },

  generateMapMarkers: function(){    
    driveways = this.getDriveways();
    reservations = this.getReservations();

    //Filter driveways
    filteredDriveways = this.filterDriveways(driveways, reservations);

    //Build Map Markers
    var markers = [];
    for(var i = 0; i < filteredDriveways.length; i++){
      var driveway = driveways[i];
      var address = driveway.address + ', ' + driveway.city + ', ' + driveway.state + ' ' + driveway.zip + ', USA';
      var isPartiallyFull = false; //Change this when matt gets done
      var infoWindow = new google.maps.InfoWindow({
        content: this.renderInfoWindow(address, driveway)
      });
      markers.push({address: address, partiallyFull: isPartiallyFull, driveway: driveway, infoWindow: infoWindow})
    }

    return markers;
  },

  handleChange: function(event) {
    if(event.target.name == "email"){
      this.setState({email: event.target.value});
    }else if(event.target.name == "address"){
      mapMarkers = this.generateMapMarkers();
      this.setState({address: event.target.value, mapData: {event: {address: event.target.value, date: this.state.date, time: this.state.time}, markers: mapMarkers}});
    }else if(event.target.name == "date"){
      mapMarkers = this.generateMapMarkers();//generateMapMarkers(this.state.date, this.state.time);
      this.setState({date: event.target.value, mapData: {event: {address: this.state.address, date: event.target.value, time: this.state.time}, markers: mapMarkers}});
    }else if(event.target.name == "time"){
      mapMarkers = this.generateMapMarkers();//generateMapMarkers(this.state.date, this.state.time);
      this.setState({time: event.target.value, mapData: {event: {address: this.state.address, date: this.state.date, time: event.target.value}, markers: mapMarkers}});
    }
  },

  renderInfoWindow: function(address, driveway){
    var content = (
      <div style={{fontSize: '14px'}}>
        <label style={{fontSize: '16px'}}>Address: {address}</label>
        <ul>
          <li><div style={{display: 'inline-block'}}>Owner:</div><div style={{display: 'inline-block', marginLeft: '10px'}}>{driveway.username}</div></li>
          <li><div style={{display: 'inline-block'}}>Price:</div><div style={{display: 'inline-block', marginLeft: '10px'}}>{"$10.00"}</div></li>
        </ul>
        <div id='pay'></div>
      </div>
    );

    return React.renderToStaticMarkup(content);
  },

  renderPayment: function(){
    alert("hello");
    // var content = (
    //   <CheckoutStrip data={payData}/>
    // );

    // return React.renderToStaticMarkup(content);
  },

  markerClicked: function(marker, mapMarker, map){
    console.log(marker);

    marker.infoWindow.open(map, mapMarker);
    
    //var payData = {event: {Email: this.state.email, Address: address, Price: driveway.cost, street: driveway.address, zip1: driveway.zip, state: driveway.state, resDate: this.state.date, duration: "4", resTime: this.state.time, city: driveway.city, drivewayId: driveway._id, owner: driveway.username}, parking: []};
    var email = this.state.email;
    var address = marker.address;
    var price = "";
    var streetA = "297 S 760 W";
    var zip = "84058";
    var state1 = "UT";
    var rDate = "12/12/16";
    var duration1 = "4";
    var rTime = "6:00 PM";
    var city = "orem"
    var drivewayId = 12345;
    var owner = "John David";
    var payData = {event: {Email: email, Address: address, Price: price, street: streetA, zip1: zip, state: state1, resDate: rDate, duration: duration1, resTime: rTime, city: city, drivewayId: drivewayId, owner: owner}, parking: []};
    //console.log(payData);

    ReactDOM.render(<CheckoutStrip data={payData}/>, document.getElementById('pay'));
  },

  render: function () {
    var style = {
      width:     '100%',
      height: $(window).width() < 500 ? 300 : 500,
      maxHeight: $(window).height() / 1.5
    }

    var email = this.state.email;
    var address = address;
    var price = "";
    var streetA = "297 S 760 W";
    var zip = "84058";
    var state1 = "UT";
    var rDate = "12/12/16";
    var duration1 = "4";
    var rTime = "6:00 PM";
    var city = "orem"
    var drivewayId = 12345;
    var owner = "John David";
    var payData = {event: {Email: email, Address: address, Price: price, street: streetA, zip1: zip, state: state1, resDate: rDate, duration: duration1, resTime: rTime, city: city, drivewayId: drivewayId, owner: owner}, parking: []};

    return(
      <div>
        <div>
            <label>Email</label><input type="email" name="email" value={this.state.email} onChange={this.handleChange} />
            <label>Event Address</label><input type="text" name="address" value={this.state.address} onChange={this.handleChange} />
            <label>Event Date</label><input type="text" name="date" value={this.state.date} onChange={this.handleChange} />
            <label>Event Time</label><input type="text" name="time" value={this.state.time} onChange={this.handleChange} />
        </div>

        <div>
          <ParkingMap data={this.state.mapData} markerClicked={this.markerClicked} />
        </div>
        <CheckoutStrip data={payData}/>        
      </div>
    );        
  }
});

module.exports = ReservationForm;