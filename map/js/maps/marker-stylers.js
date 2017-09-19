
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

  // highlight the marker represented by the index,
  // unhighlight all others
  toggleMarkers: function(markers, markerIndex) {
    for (var i = 0; i < markers.length; i++) {
      if(i === markerIndex) {
        markers[i].setIcon(this.highlightedIcon);
      } else {
        markers[i].setIcon(this.defaultIcon);
      }
    }
  },

  highlightMarker: function(markers, markerIndex) {
    this.toggleMarkers(markers, markerIndex);
  },

  unhighlightAllMarkers: function(markers) {
    this.toggleMarkers(markers, null);
  },

  bounce: function(marker, markers) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      this.highlightMarker(markers, markers.indexOf(marker));
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(m) { 
        return function() { 
          m.setAnimation(null); 
        }; }(marker), 1500);
    }
  },

  hideSpecifiedMarkers: function(allMarkers, filteredMarkers) {
    
    // Reset the bounds to visible markers
    var newBounds = new google.maps.LatLngBounds();

    for (var i = 0; i < allMarkers.length; i++) {
      if(filteredMarkers.includes(allMarkers[i])) {
        allMarkers[i].setVisible(false);
      } else {
        allMarkers[i].setVisible(true);
        newBounds.extend(allMarkers[i].position);
      }
    }
    return newBounds;
  },

  init: function() {
    this.defaultIcon = this.makeMarkerIcon('ffffff', 29, 47);
    this.highlightedIcon = this.makeMarkerIcon('02b3e4', 29, 47);
  }
};