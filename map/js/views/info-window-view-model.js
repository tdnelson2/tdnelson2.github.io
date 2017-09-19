var InfoWindow = {
  populateInfoWindow: function(map, infoWindow,
                               marker, markers,
                               index, currentLocationKO,
                               mapIsFullScreenKO) {
    // Check to make sure the infowWindow is not already opened on this marker.
    infoWindow.marker = marker;
    var infoWindowHTML = document.getElementById("info-window-template").innerHTML;
    infoWindow.setContent(infoWindowHTML);
    infoWindow.open(map, marker);
    ko.applyBindings(new InfoWindow.ViewModel(map, infoWindow, marker, 
                                              index, mapIsFullScreenKO),
               document.getElementById('partner-info-window'));

    // Make sure the marker property is cleared if the infoWindow is closed.
    infoWindow.addListener('closeclick', function(){
      MarkerStylers.unhighlightAllMarkers(markers);
      currentLocationKO(null);
      infoWindow.close();
      infoWindow.setMarker = null;
    });
  },

  /////////*****************/////////
  /////////* VIDEO CONTENT */////////
  /////////*****************/////////

  width: null,
  height: null,

  ViewModel: function(map, infoWindow, marker, markerIndex, mapIsFullScreenKO) {
    var self = this;
    self.currentLocation = ko.observable(Model.Locations[markerIndex]);
    self.embeddedVideo = ko.observable('');
    self.videoThumbs = ko.observableArray([]);
    self.shouldShowDetails = ko.observable(mapIsFullScreenKO());
    self.shouldShowFullDetails = ko.observable(false);
    self.detailsCaret = ko.pureComputed(function() {
        return self.shouldShowDetails() ? "fa fa-caret-down fa-fw" : 
                                          "fa fa-caret-right fa-fw";
    });

    // Set css classes that match the corresponding condition.
    self.detailsAmt = ko.pureComputed(function() {
        return self.shouldShowFullDetails() ? "iw-details" : 
                                              "iw-details iw-details-ltd";
    });

    self.descriptionAmt = ko.pureComputed(function() {
      return self.shouldShowFullDetails() ? "iw-description" : 
                                            "iw-description iw-description-truncated";
    });

    self.showDetails = function() {
      self.shouldShowDetails(!self.shouldShowDetails());
      
      // Adjust map to fit larger infowindow.
      infoWindow.open(map, marker);
    };

    self.toggleFullText = function() {
      self.shouldShowFullDetails(!self.shouldShowFullDetails());

      // Adjust map to fit larger infowindow.
      infoWindow.open(map, marker);
    };

    self.fetchVideo = function(thumb) {
      InfoWindow.embedVideo(thumb.link, self.embeddedVideo, mapIsFullScreenKO, 
                            map, marker, infoWindow);
    };

    // Determine what the video size should be.
    // If the sidebar is open, we need to deduct
    // that from our calculations
    self.sidebarWidth = mapIsFullScreenKO() ? 0 : 300;
    self.mapWidth = $( window ).width()-self.sidebarWidth;

    // If the screen size is greater than 900px,
    // we'll make the video dimensions 640x360.
    // But if it is lower than 900px,
    // we'll make the dimensions 70% of the screen width
    InfoWindow.width = self.mapWidth > 900 ? 640 : 
                                       Math.floor(self.mapWidth*0.7);
    InfoWindow.height = self.mapWidth > 900 ? 360 : 
                                        Math.floor(InfoWindow.width*9/16);

    self.containerWidth = ko.observable(Math.floor(InfoWindow.width*1.05));
    self.videoWidth = ko.observable(InfoWindow.width);
    // infoWindow.maxWidth = InfoWindow.width;
    // infoWindow.setOptions({maxWidth:InfoWindow.width});

    // Determine optimal thumb size
    self.thumbWidth = ko.pureComputed(function() {
      var numberOfThumbs = 0.9;
      var width = 84;
      var tolerance = InfoWindow.width < 500 ? 0.02 : 0.001;
      console.log('InfoWindow width: '+InfoWindow.width);
      console.log('Initial width :'+width);
      console.log('Tolerance :'+tolerance);
      while(numberOfThumbs-(Math.floor(numberOfThumbs)) > tolerance) {
        numberOfThumbs = InfoWindow.width/width;
        width += 1;
      }
      return width-5;
    });

    self.thumbHeight = ko.pureComputed(function() {
      return self.thumbWidth()*(9/16);
    });

    // Add links to videos and embed the top result.
    InfoWindow.render(map,
                      infoWindow,
                      marker,
                      self.currentLocation,
                      self.videoThumbs,
                      self.embeddedVideo,
                      mapIsFullScreenKO);
  },

    // Render result of video search using an arry of search terms.
  render: function(map, infoWindow, marker, locationKO, thumbsKO, 
                   embeddedVideoKO, mapIsFullScreenKO) {
    var searchTerms = [locationKO().title,
              locationKO().city,
              locationKO().country];

    // Query Vimeo for videos.
    this.addFromQuery(map, infoWindow, marker, searchTerms, 
                      thumbsKO, embeddedVideoKO, mapIsFullScreenKO);
  },

  // add results from searching the next item in the searchTerms list
  addFromQuery: function(map, infoWindow, marker, searchTerms, thumbsKO, 
                         embeddedVideoKO, mapIsFullScreenKO) {
    var url = "https://api.vimeo.com/users/lahash/videos";
    url += '?' + $.param({
      'access_token': "56cf73847a95b1e6fef352aedc5bb1d5",
      'query': searchTerms.splice(0,1)[0]
    });

    // fetch videos matching the search term
    $.ajax({
      url: url
    }).done(function(result) {
      var dataAry = result.data;
      if(dataAry.length > 0) {
        if(embeddedVideoKO() === '') {
          InfoWindow.embedVideo(dataAry[0].link, embeddedVideoKO, 
                                mapIsFullScreenKO, map, marker, infoWindow);
        }
        dataAry.map(function(x) {
          var currentThumbs = thumbsKO().map(function(x) { return x.url; });
          var thumbURL = x.pictures.sizes[2].link;
          if(!currentThumbs.includes(thumbURL)) {
            thumbsKO.push({ url: thumbURL,
                    link: x.link} );
          }
        });
      }
      if(searchTerms.length > 0) {
        InfoWindow.addFromQuery(map,
                          infoWindow,
                          marker,
                          searchTerms,
                          thumbsKO,
                          embeddedVideoKO,
                          mapIsFullScreenKO);
      }
    }).fail(function(err) {
      embeddedVideoKO(document.getElementById('embed-video-error'));
    });
  },

  // Using a link as an input, generate an embedded video.
  embedVideo: function(link, embeddedVideoKO, mapIsFullScreenKO, map, marker, infoWindow) {
    var url = "https://vimeo.com/api/oembed.json";

    url += '?' + $.param({
      'url': link,
      'height': this.height,
      'width': this.width
    });

    $.ajax({
      url: url,
      method: 'GET',
    }).done(function(result) {
      embeddedVideoKO(result.html);

      // Adjust map to fit infowindow on screen.
      infoWindow.open(map, marker);
    }).fail(function(err) {
      embeddedVideoKO(document.getElementById('embed-video-error'));
    });
  }
};