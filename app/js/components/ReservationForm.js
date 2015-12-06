var React = require('react');
var ParkingMap = require('./ParkingMap.js');
var CheckoutStrip = require('./StripePayment.js');

function getReservations(){
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
  }

  function getDriveways(){
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
  }

  function filterDriveways(driveways, reservations){
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
  }

  function generateMapMarkers(date, time){    
    driveways = getDriveways();
    reservations = getReservations();

    //Filter driveways
    filteredDriveways = filterDriveways(driveways, reservations);

    //Build Map Markers
    var markers = [];
    for(var i = 0; i < filteredDriveways.length; i++){
      var driveway = driveways[i];
      var address = driveway.address + ', ' + driveway.city + ', ' + driveway.state + ' ' + driveway.zip + ', USA';
      var isPartiallyFull = false; //Change this when matt gets done
      markers.push({address: address, partiallyFull: isPartiallyFull, driveway: driveway})
    }

    return markers;
  }

var ReservationForm = React.createClass({

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

  handleChange: function(event) {
    if(event.target.name == "email"){
      this.setState({email: event.target.value});
    }else if(event.target.name == "address"){
      mapMarkers = generateMapMarkers(this.state.date, this.state.time);
      this.setState({address: event.target.value, mapData: {event: {address: event.target.value, date: this.state.date, time: this.state.time}, markers: mapMarkers}});
    }else if(event.target.name == "date"){
      mapMarkers = generateMapMarkers(this.state.date, this.state.time);
      this.setState({date: event.target.value, mapData: {event: {address: this.state.address, date: event.target.value, time: this.state.time}, markers: mapMarkers}});
    }else if(event.target.name == "time"){
      mapMarkers = generateMapMarkers(this.state.date, this.state.time);
      this.setState({time: event.target.value, mapData: {event: {address: this.state.address, date: this.state.date, time: event.target.value}, markers: mapMarkers}});
    }
  },

  handleFormSubmit: function() {
    //Perform Validation on Input

    mapMarkers = generateMapMarkers(this.state.date, this.state.time);
    this.setState({mapData: {event: {address: this.state.address, date: this.state.date, time: this.state.time}, markers: mapMarkers}});
  },

  markerClicked: function(marker){
    //this.setState({selectedMarker: marker, showPay: true})
    this.setState({payData: {event: {}, parking: []}});
  },

  render: function () {
    var style = {
      width:     '100%',
      height: $(window).width() < 500 ? 300 : 500,
      maxHeight: $(window).height() / 1.5
    }

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
        <div>
          <CheckoutStrip data={this.state.payData}/>
        </div>
      </div>
    );        
  }
});

module.exports = ReservationForm;