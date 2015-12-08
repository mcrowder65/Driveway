var React = require('react');
ReactDOM = require('react-dom');
//var History = require('react-router').History;
//var { createHistory, useBasename } = require('history');
//var {Lifecycle} = require('react-router');
var CheckoutStrip = require('./StripePayment.js');
var Marker = google.maps.Marker;
var geocoder = new google.maps.Geocoder();

// var history = useBasename(createHistory)({
//     basename: '/transitions'
// })

var ReservationForm = React.createClass({
  //mixins: [History, Lifecycle],

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      email: '',
      address: '',
      date: '',
      time: '',
      map: undefined,
      markers: [],
      eventMapMarker: []
    }      
  },

  routerWillLeave: function(nextLocation){

  },

  componentDidMount: function () {
    this.initializeMap();
  },

  initializeMap: function() {
    //console.log(this.context);
    //alert(this.props.location.query.address);
    //var {address} = this.context.router.getCurrentQuery();
    //this.setState({address: address});

    //Parking Map    
    this.geocodeAddress(this.state.address, this, function(location, component){
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

      component.setState({map: map});
    });
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

  geocodeAddress: function(address, component, cb, marker, markers) {
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        cb(results[0].geometry.location, component, marker, markers);
      } else {
        cb(null, component, marker, markers);
      }
    });
  },

  generateMarkers: function(){    
    driveways = this.getDriveways();
    reservations = this.getReservations();

    //Filter driveways
    filteredDriveways = this.filterDriveways(driveways, reservations);

    //Build Markers
    var markers = [];
    for(var i = 0; i < filteredDriveways.length; i++){
      var driveway = driveways[i];
      var address = driveway.address + ', ' + driveway.city + ', ' + driveway.state + ' ' + driveway.zip + ', USA';
      var isPartiallyFull = false; //Change this when matt gets done
      var infoWindow = new google.maps.InfoWindow({
        content: this.renderInfoWindow(address, driveway)
      });
      var marker = {address: address, partiallyFull: isPartiallyFull, driveway: driveway, infoWindow: infoWindow};

      this.geocodeAddress(address, this, function(location, component, marker, markers){
          markerOptions = { //Optimize this later
            map: component.state.map,
            //animation: google.maps.Animation.DROP,
            draggable: false,
            position:  location,
            title:     'Parking Location',
            icon: '../images/marker-green.png'//marker.partiallyFull ? '../images/marker-green.png' : '../images/marker-yellow.png'
          }

          var mapMarker = new Marker(markerOptions);
          mapMarker.addListener('click', function() {component.markerClicked(marker, mapMarker, component.state.map)});
          markers.push({marker: marker, mapMarker: mapMarker});
        }, marker, markers);
    }

    console.log(markers);
    return markers;
  },

  generateEventMarker: function(){
    var marker = undefined;
    var markers = [];
    this.geocodeAddress(this.state.address, this, function(location, component, marker, markers){
      markerOptions = {
        map: component.state.map,
        animation: google.maps.Animation.DROP,
        draggable: false,
        position:  location,
        title:     'Event Location',
        icon: '../images/marker-red.png'
      }

      var mapMarker = new Marker(markerOptions);
      markers.push({eventMapMarker: mapMarker});
    }, marker, markers);   

    return markers;
  },

  deleteMarkers: function(){
    for(var i = 0; i < this.state.markers.length; i++){
      this.state.markers[i].mapMarker.setMap(null);
    }

    for(var i = 0; i < this.state.eventMapMarker.length; i++){
      this.state.eventMapMarker[i].eventMapMarker.setMap(null);
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

  recenterMap: function() {
    this.geocodeAddress(this.state.address, this, function(location, component){
      component.state.map.setCenter(location);
    });
  },

  handleSubmit: function(){
    this.deleteMarkers();
    var mapMarkers = this.generateMarkers();
    var eventMarker = this.generateEventMarker();
    this.recenterMap();
    this.setState({markers: mapMarkers, eventMapMarker: eventMarker});
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

  markerClicked: function(marker, mapMarker, map){
    marker.infoWindow.open(map, mapMarker);
    
    var payData = {event: {Email: this.state.email, Address: marker.address, Price: marker.driveway.cost, street: marker.driveway.address, zip1: marker.driveway.zip, state: marker.driveway.state, resDate: this.state.date, duration: "4", resTime: this.state.time, city: marker.driveway.city, drivewayId: marker.driveway._id, owner: marker.driveway.username}, parking: []};
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
                <div className='col-md-3'><label className='form-label'>Email:</label><input className='form-control' type="email" name="email" placeholder='Email' value={this.state.email} onChange={this.handleChange} /></div>
                <div className='col-md-3'><label className='form-label'>Event Address:</label><input className='form-control' type="text" name="address" placeholder='156 East 200 North, Provo, UT 84606' value={this.state.address} onChange={this.handleChange} /></div>
                <div className='col-md-2'><label className='form-label'>Event Date:</label><input className='form-control' type="text" name="date" placeholder='12/12/16' value={this.state.date} onChange={this.handleChange} /></div>
                <div className='col-md-2'><label className='form-label'>Event Time:</label><input className='form-control' type="text" name="time" placeholder='6:00' value={this.state.time} onChange={this.handleChange} /></div>
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