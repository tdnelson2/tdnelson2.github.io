
var MyMap = {

  mapCenter: { lat: -1.193195, lng: 32.662820 },

  initMap: function(isMobileDevice) {

    // build map
    var thisMap = new google.maps.Map(document.getElementById('map'), {
      center: this.mapCenter,
      styles: MapStyles.styles,
      zoom: isMobileDevice ? 5 : 6,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false
    });
    return thisMap;
  },

  repositionForInfoWindow: function(map, marker, isMobile) {
      var latLng = marker.getPosition();
      var adjustedLatLng = {lat: latLng.lat()+(isMobile ? 9.5 : 4), 
                            lng: latLng.lng()};
      map.setZoom(isMobile ? 5 : 6);
      map.setCenter(adjustedLatLng);
  }
};