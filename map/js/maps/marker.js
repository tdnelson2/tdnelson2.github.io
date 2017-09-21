Marker = {
  buildMarker: function(map, mapBounds, markers,
                        infoWindow, locationIndex,
                        locationListKO, currentLocationKO,
                        mapIsFullScreenKO, isMobile) {
    var location = locationListKO()[locationIndex];
    var marker = new google.maps.Marker({
      position: location.coordinates,
      map: map,
      icon: MarkerStylers.defaultIcon,
      title: location.title,
      animation: google.maps.Animation.DROP,
    });

    marker.addListener('click', (function(map, infoWindow, marker, 
                                          markers, index, locationListKO, 
                                          currentLocationKO, mapIsFullScreenKO){
      return function() {
          MarkerStylers.bounce(marker, markers);
          InfoWindow.populateInfoWindow(map, infoWindow, marker, 
                                        markers, index, currentLocationKO, 
                                        mapIsFullScreenKO);
          currentLocationKO(locationListKO()[index]);
      };
    })(map, infoWindow, marker, markers, locationIndex, 
       locationListKO, currentLocationKO, mapIsFullScreenKO));

    marker.addListener('click', function() {
      Map.repositionForInfoWindow(map, marker, isMobile);
    });

    markers.push(marker);
    mapBounds.extend(marker.position);
  }
};