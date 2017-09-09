var Map = {
  map: null,
  init: function () {
    // Constructor creates a new map - only center and zoom are required.
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -3.792678, lng: 35.545009},
      styles: styles,
      zoom: 6,
      mapTypeControl: false
    })
    InfoWindow.init();
    MarkerStylers.init();
    Markers.createMarkers();
    this.readjustScreen();
  },

  makeFullScreen: function() {
    $('#map').css('left', '0px')
    this.readjustScreen();
  },

  adjustForSidebar: function() {
    $('#map').css('left', '300px')
    this.readjustScreen();
  }, 

  mobileMode: function() {
    $('#map').css('left', '0px')
  },

  readjustScreen() {
    google.maps.event.trigger(map, "resize");
    this.map.fitBounds(AppDelegate.getMarkerBounds());
  }
}