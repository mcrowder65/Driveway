var React = require('react');
var Marker = google.maps.Marker;
var geocoder = new google.maps.Geocoder();

function geocodeAddress(address, component, cb, marker) {
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      cb(results[0].geometry.location, component, marker);
    } else {
      cb(null, component, marker);
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

  // geocodeAddress: function(address) {
  //   var location;
  //   geocoder.geocode({'address': address}, function(results, status) {
  //     if (status === google.maps.GeocoderStatus.OK) {
  //       location = results[0].geometry.location;
  //     } else {
  //       location = undefined;
  //     }
  //   });
  //   return location;
  // },

  initializeMap: function() {
    //Parking Map
    var event = this.props.data.event;
    geocodeAddress(event.address, this, function(location, component){
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

      // Parking Spots
      markers = component.props.data.markers;
      for(var i = 0; i < markers.length; i++){
        var marker = markers[i];
        geocodeAddress(marker.address, component, function(location, component, marker){
          markerOptions = { //Optimize this later
            map: map,
            animation: google.maps.Animation.DROP,
            draggable: false,
            position:  location,
            title:     'Parking Location',
            icon: '../images/marker-green.png'//marker.partiallyFull ? '../images/marker-green.png' : '../images/marker-yellow.png'
          }

          var mapMarker = new Marker(markerOptions);
          mapMarker.addListener('click', function() {component.props.markerClicked(marker, mapMarker, map)});
          //google.maps.event.addListener(mapMarker, 'click', component.props.markerClicked(marker));
        }, marker);
      }
    });
  },
  
  markerClicked: function(marker){
    console.log(marker);
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