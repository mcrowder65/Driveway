var React = require('react');

var geocoder = new google.maps.Geocoder();

var ParkingMap = React.createClass({

  getInitialState: function () {
    return {
      map:    undefined,
      marker: undefined,
      requests: []
    }
  },

  initializeMap: function () {
    //Map code
    var mapOptions = {
      center: {
        lat: this.props.data.event.lat,//40.4122994,
        lng: this.props.data.event.lon//-111.75418
      },
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

    var cityCenter = new google.maps.LatLng(40.4122994, -111.75418)

    var markerOptions = {
      animation: google.maps.Animation.DROP,
      draggable: true,
      position:  cityCenter,
      title:     'Issue location',
      icon: '/images/marker-red-2.png'
    }

    var map = new google.maps.Map($('.map-canvas')[0], mapOptions);
    google.maps.event.addListener(map, 'click', this.mapClicked);
    
    var marker = new Marker(markerOptions);
    marker.setMap(map);
    google.maps.event.addListener(marker, 'dragend', this.markerDragged);

    this.setState({
      map:    map,
      marker: marker
    });

    this.state.map = map;
    this.state.marker = marker;
  },
  
  componentDidMount: function () {
    this.initializeMap();

    // api.getRequests({
    //   status: 'open'
    // }, this.loadRequests);

    // api.getServices((services) => {
    //         this.setState({
    //             services: services
    //         });
    //     });
  },

  render: function () {
    var style = {
      width:     '100%',
      height: $(window).width() < 500 ? 300 : 500,
      maxHeight: $(window).height() / 1.5
    }
    return (
      <div onBlur={this.props.onBlur} style={style} className='map-canvas'></div>
    );
  }
});

module.exports = ParkingMap;