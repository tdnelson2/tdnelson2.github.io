
Map = {

  mapCenter: { lat: -1.193195, lng: 32.662820 },

  initMap: function() {

    // build map
    var map = new google.maps.Map(document.getElementById('map'), {
      center: this.mapCenter,
      styles: MapStyles.styles,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false
    });
    // map.fitBounds();
    return map;
  }
};