var React = require('react');
var ReactDOM = require('react-dom');
var ReactDOMServer = require('react-dom/server.js');
var CheckoutStrip = require('./StripePayment.js');
var Marker = google.maps.Marker;
var geocoder = new google.maps.Geocoder();

var ReservationForm = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  getParam: function(parameter)
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
  }, 

  getInitialState: function() {
    return {
      email: '',
      address: this.getParam('address') != null? this.getParam('address') : 'Provo, UT',
      date: '',
      time: '',
      map: undefined,
      markers: [],
      eventMapMarker: []
    }      
  },

  componentDidMount: function () {
    this.initializeMap();
  },

  initializeMap: function() {
    var location = this.geocodeAddress(this.state.address);
    var mapOptions = {
      center: location,
      draggableCursor: 'crosshair',
      zoom:            14,
      mapTypeId:       google.maps.MapTypeId.ROADMAP,
      streetViewControl:  false,
      panControl:         true,
      zoomControl:        true,
      mapTypeControl:     true,
      scaleControl:       true,
      overviewMapControl: true
    }

    var map = new google.maps.Map($('.map-canvas')[0], mapOptions);
    this.state.map = map;
    this.handleSubmit();
  },

  getDayFromNum: function(numDay){
    var day = '';
    switch(numDay) {
      case 0:
          day = 'sunday';
          break;
      case 1:
          day = 'monday';
          break;
      case 2:
          day = 'tuesday';
          break;
      case 3:
          day = 'wednesday';
          break;
      case 4:
          day = 'thursday';
          break;
      case 5:
          day = 'friday';
          break;
      case 6:
          day = 'saturday';
          break;
      default:
          day = '';
    }
    return day;
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
        //Check the day if the date isn't empty or undefined
        // if(this.state.date != ''){
        //   var date = new Date(this.state.date);
        //   var dayAsNum = date.getDay();
        //   var dayToCheck = this.getDayFromNum(dayAsNum);
        //   var isRightDay = false;
        //   for(var k = 0; k < driveways[i].times.length; k++){
        //     if(driveways[i].times[k].stateDay == dayToCheck){
        //       isRightDay = true;
        //       break;
        //     }
        //   }

        //   if(isRightDay){
        //     filteredDriveways.push(driveways[i]);
        //   }  
        // }else{
          filteredDriveways.push(driveways[i]); 
        // }        
      }
    }
    return filteredDriveways;
  },

  geocodeAddress: function(address){
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
    console.log(address);
    return geo[0].geometry.location;
  },

  generateMarkers: function(){    
    driveways = this.getDriveways();
    reservations = this.getReservations();

    //Filter driveways
    filteredDriveways = this.filterDriveways(driveways, reservations);

    markerOptions = {
      map: this.state.map,
      draggable: false,
      title:     'Parking Location',
      icon: '../images/marker-green.png'//marker.partiallyFull ? '../images/marker-green.png' : '../images/marker-yellow.png'
    }

    //Build Markers
    for(var i = 0; i < filteredDriveways.length; i++){
      var driveway = driveways[i];
      var address = driveway.address + ', ' + driveway.city + ', ' + driveway.state + ' ' + driveway.zip + ', USA';
      var isPartiallyFull = false; //Change this when matt gets done
      var infoWindow = new google.maps.InfoWindow({
        content: this.renderInfoWindow(address, driveway)
      });
      if(!driveway.fee){
        driveway.fee = 10;
      }

      var location = this.geocodeAddress(address);

      if(location != null){
        var mapMarker = new Marker(markerOptions);
        mapMarker.setPosition(location);
        var marker = {address: address, partiallyFull: isPartiallyFull, driveway: driveway, infoWindow: infoWindow, mapMarker: mapMarker};
        mapMarker.addListener('click', this.markerClicked.bind(this, marker));
        //component.state.markers.push({marker: marker, mapMarker: mapMarker});
      }
    }
  },

  generateEventMarker: function(){
    var location = this.geocodeAddress(this.state.address);
    markerOptions = {
      map: this.state.map,
      animation: google.maps.Animation.DROP,
      draggable: false,
      position:  location,
      title:     'Event Location',
      icon: '../images/marker-red.png'
    }
    var mapMarker = new Marker(markerOptions);
    this.state.eventMapMarker.push({eventMapMarker: mapMarker});
  },

  deleteMarkers: function(){
    for(var i = 0; i < this.state.eventMapMarker.length; i++){
      this.state.eventMapMarker[i].eventMapMarker.setMap(null);
      delete this.state.eventMapMarker[i].eventMapMarker;
    }
    this.state.eventMapMarker.length = 0;
    //this.setState({eventMapMarker: []});

    // for(var i = 0; i < this.state.markers.length; i++){
    //   this.state.markers[i].mapMarker.setMap(null);
    //   delete this.state.markers[i].marker;
    //   delete this.state.markers[i].mapMarker;
    // }
    // this.state.markers.length = 0;
    //this.setState({markers: []});
  },

  handleChange: function(event) {
    if(event.target.name == "address"){
      this.setState({address: event.target.value});
    }else if(event.target.name == "date"){      
      this.setState({date: event.target.value});
    }else if(event.target.name == "time"){      
      this.setState({time: event.target.value});
    }
  },

  recenterMap: function() {
    var location = this.geocodeAddress(this.state.address);
    this.state.map.setCenter(location);
  },

  handleSubmit: function(){
    this.deleteMarkers();
    this.recenterMap();
    this.generateEventMarker();
    this.generateMarkers();
    this.forceUpdate();
  },

  renderInfoWindow: function(address, driveway){
    var fee = !driveway.fee? "10" : driveway.fee;
    var center = {textAlign: 'center'};
    var content = (
      <div>
        <div style={{fontSize: '16px', fontWeight: 'bold'}}>{address}</div>        
        <table className='table table-striped table-compact' style={center}>
          <tbody>
            <tr>
              <th style={center}>Owner</th>
              <td>{driveway.username}</td>
            </tr>
            <tr>
              <th style={center}>Price</th>
              <td>{"$" + fee}</td>
            </tr>
            <tr>
              <th style={center}>Start Time</th>
              <th style={center}>End Time</th>
            </tr>
            {driveway.times.map(function(time, i){
              return (
                <tr key={i}>
                  <td>{time.startTime}</td>
                  <td>{time.endTime}</td>
                </tr>
              ); 
            })}
            </tbody>
          </table>  
        <div id='pay' style={{textAlign: 'center'}}></div>
      </div>
    );

    return ReactDOMServer.renderToStaticMarkup(content);
  },

  markerClicked: function(marker){
    marker.infoWindow.open(this.state.map, marker.mapMarker);

    var payData = {event: {Email: this.state.email, Address: marker.address, Price: marker.driveway.fee * 100, street: marker.driveway.address, zip1: marker.driveway.zip, state: marker.driveway.state, resDate: this.state.date, duration: "4", resTime: this.state.time, city: marker.driveway.city, drivewayId: marker.driveway._id, owner: marker.driveway.username}, parking: []};
    ReactDOM.render(<CheckoutStrip data={payData}/>, document.getElementById('pay'));
  },

  render: function() {
    var style = {
      width:     '100%',
      height: $(window).width() < 500 ? 300 : 500,
      maxHeight: $(window).height() / 1.5
    }

    return(
      <div className='panel panel-primary'>
        <div className='panel-heading'>
          <div className='form-group' style={{textAlign: 'center'}}>
              <div className="row">                
                <div className='col-md-4'><label className='form-label'>Event Address:</label><input className='form-control' type="text" name="address" placeholder='156 East 200 North, Provo, UT 84606' value={this.state.address} onChange={this.handleChange} /></div>
                <div className='col-md-3'><label className='form-label'>Event Date:</label><input className='form-control' type="text" name="date" placeholder='12/12/16' value={this.state.date} onChange={this.handleChange} /></div>
                <div className='col-md-3'><label className='form-label'>Event Time:</label><input className='form-control' type="text" name="time" placeholder='6:00 PM' value={this.state.time} onChange={this.handleChange} /></div>
                <div className='col-md-2' style={{marginTop: '24px'}}><input className='form-control' type="button" name="submit" value="Submit" onClick={this.handleSubmit} /></div>
              </div>
          </div>
        </div>

        <div className='panel-body'>
          <div>
            <div style={style} className='map-canvas'></div>
          </div>
        </div>
      </div>
    );        
  }
});

module.exports = ReservationForm;