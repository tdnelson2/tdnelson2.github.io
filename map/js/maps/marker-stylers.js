
MarkerStylers = {

  // what the icon will look like when user is not interacting with it
  defaultIcon: null,

  // Create a "highlighted location" marker color for when the user
  // mouses over the marker.
  highlightedIcon: null,

  // This function takes in a COLOR, and then creates a new marker
  // icon of that color. The icon will be 21 px wide by 34 high, have an origin
  // of 0, 0 and be anchored at 10, 34).
  makeMarkerIcon: function(markerColor, width, heigth) {
    var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(width, heigth),
    new google.maps.Point(0, 0),
    new google.maps.Point(width/2, heigth),
    new google.maps.Size(width,heigth));
    return markerImage;
  },

  updateMarkers: function(markerIndex) {
    var markers = AppDelegate.getMarkers();
    for (var i = 0; i < markers.length; i++) {
      if(i === markerIndex) {
        markers[i].setIcon(this.highlightedIcon);
        // if(
        //   markerIndex != null 
        //   && InfoWindow.currentInfoWindow.marker != null 
        //   && InfoWindow.currentInfoWindow.marker != markers[markerIndex]
        //   ) {
        //   InfoWindow.currentInfoWindow.marker = null;
        //   console.log("info window should clear")
        // }
      } else {
        markers[i].setIcon(this.defaultIcon);
      }
    }
  },

  highlightMarker: function(markerIndex) {
    this.updateMarkers(markerIndex);
  },

  unhighlightAllMarkers: function() {
    this.updateMarkers(null);
  },

  init: function() {
    this.defaultIcon = this.makeMarkerIcon('ffffff', 29, 47);
    this.highlightedIcon = this.makeMarkerIcon('0091ff', 42, 68);
  }
}