var React = require('react');
var Marker = google.maps.Marker;
var geocoder = new google.maps.Geocoder();

function geocodeAddress(address, cb) {
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      cb(results[0].geometry.location);
    } else {
      cb(null);
    }
  });
}

var ParkingMap = React.createClass({

  getInitialState: function () {
    return {
      event: undefined,
      map: undefined,
      markers: []
    }
  },

  geocodeAddress: function(address) {
    var location;
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        location = results[0].geometry.location;
      } else {
        location = undefined;
      }
    });
    return location;
  },

  initializeMap: function() {
    //Parking Map
    var event = this.props.data.event;
    geocodeAddress(event.address, function(location){
      var mapOptions = {
        center: location,
        draggableCursor: 'crosshair',
        zoom:            14,
        mapTypeId:       google.maps.MapTypeId.HYBRID,
        streetViewControl:  false,
        panControl:         true,
        zoomControl:        true,
        mapTypeControl:     true,
        scaleControl:       true,
        overviewMapControl: true
      }
      var map = new google.maps.Map($('.map-canvas')[0], mapOptions);

      // Parking Spots
      markers = this.props.data.markers;
      for(marker in markers){
        markerOptions = { //Optimize this later
          map: map,
          animation: google.maps.Animation.DROP,
          draggable: false,
          position:  this.geocodeAddress(marker.address),
          title:     'Parking Location',
          icon: marker.partiallyFull ? '../images/marker-green.png' : '../images/marker-yellow.png'
        }

        var mapMarker = new Marker(markerOptions);
        google.maps.event.addListener(mapMarker, 'click', this.markerClicked(marker));
      }

      //Set State
      //this.state.map = map;
      //this.state.event = event;
      //this.state.markers = markers;
    });
  },
  
  componentDidMount: function () {
    this.initializeMap();
  },

  markerClicked: function(marker){
    //Render payment component
  },

  render: function () {
    var style = {
      width:     '100%',
      height: $(window).width() < 500 ? 300 : 500,
      maxHeight: $(window).height() / 1.5
    }
    this.initializeMap();
    return (
      <div style={style} className='map-canvas'></div>
    );
  }
});

module.exports = ParkingMap;