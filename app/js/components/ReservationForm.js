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
    for(driveway in driveways){
      var reserved = false;
      for(reservation in reservations){
        if(reservation.drivewayId == driveway._id){
          reserved = true;
          break;
        }
      }      
      if(!reserved){
        filteredDriveways.push(driveway);
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
    for(driveway in filteredDriveways){
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
      this.setState({address: event.target.value});
    }else if(event.target.name == "date"){
      this.setState({date: event.target.value});
    }else if(event.target.name == "time"){
      this.setState({time: event.target.value}); 
    }
  },

  handleFormSubmit: function() {
    //Perform Validation on Input

    mapMarkers = generateMapMarkers(this.state.date, this.state.time);

    alert(this.state.address);
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
            <button className="btn btn-default" onClick={this.handleFormSubmit}>Submit</button>
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