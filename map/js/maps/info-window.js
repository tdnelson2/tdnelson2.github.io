var InfoWindow = {

  // window for display details about the location at each marker.
  largeInfowindow: null,


  // This function populates the infowindow when the marker is clicked. We'll only allow
  // one infowindow which will open at the marker that is clicked, and populate based
  // on that markers position.
  displayInfoWindow: function(markerIndex, infowindow, shouldShowVideo) {
    var map = AppDelegate.getMap();
    var markers = AppDelegate.getMarkers();
    var marker = markers[markerIndex];
    if(shouldShowVideo === undefined) {
      shouldShowVideo = true;
    }
    // Check to make sure the infowindow is not already opened on this marker.
    if(infowindow.marker != marker) {

      
      infowindow.marker = marker;
      infowindow.setContent('');

      // initially show only the title until the videos load asynchronously
      infowindow.setContent('<h3 id="infowindow-title">'+marker.title+'</h3><div id="video"><div class="embeded-video"></div><div class="video-thumbs"></div></div>');
      infowindow.open(map, marker);
      this.currentInfoWindow = infowindow;

      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        AppDelegate.unhighlightMarkers();
        infowindow.marker = null;
      });
      if(shouldShowVideo) {

        // fill the infowindo with video content
        AppDelegate.displayVideo(markerIndex);
      }
    }
  },

  init: function() {
    this.largeInfowindow = new google.maps.InfoWindow();
  }
}