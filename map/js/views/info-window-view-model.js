var InfoWindow = {

  width: null,
  height: null,
  currentLocation: null,
  map: null,
  infoWindow: null,
  marker: null,
  markerIndex: null,
  mapIsFullScreenKO: null,
  vimeoURL: "https://api.vimeo.com/users/lahash/videos",
  vimeoToken: "56cf73847a95b1e6fef352aedc5bb1d5",
  vimeoErrMsg: '<h1 style="color: red;">There was a problem getting data from Vimeo</h1>',
  vimeoOembedURL: "https://vimeo.com/api/oembed.json",

  // A function for calculating the width of 
  // the thumbnails which appear below the video
  // so that they fit flush with the video.
  getThumbWidth: function() {
    var numberOfThumbs = this.width < 500 ? 3 : 6;
    var exactWidth = this.width/numberOfThumbs;
    return exactWidth-4;
  },

  populateInfoWindow: function(map, infoWindow,
                               marker, markers,
                               index, currentLocationKO,
                               mapIsFullScreenKO) {


    this.currentLocation = Model.Locations[index];
    this.map = map;
    this.infoWindow = infoWindow;
    this.marker = marker,
    this.markerIndex = index;
    this.mapIsFullScreenKO = mapIsFullScreenKO;

    // DETERMINE INFOWINDOW/VIDEO/THUMB SIZES

    // Determine what the video size should be.
    // If the sidebar is open, we need to deduct
    // that from our calculations
    var sidebarWidth = mapIsFullScreenKO() ? 0 : 300;
    var mapWidth = $( window ).width()-sidebarWidth;

    // If the screen size is greater than 900px,
    // we'll make the video dimensions 640x360.
    // But if it is lower than 900px,
    // we'll make the dimensions 70% of the screen width
    InfoWindow.width = mapWidth > 900 ? 640 : 
                                       Math.floor(mapWidth*0.6);
    InfoWindow.height = mapWidth > 900 ? 360 : 
                                        Math.floor(this.width*9/16);

    var containerWidth = Math.floor(InfoWindow.width*1.05);
    var videoWidth = InfoWindow.width;

    // Determine optimal thumb size
    var thumbWidth = InfoWindow.getThumbWidth();

    var thumbHeight = thumbWidth*(9/16);

    // Populate HTML.
    var infoWindowHTML = ''+
    '<div id="partner-info-window" class="video-container" style="width: '+containerWidth+'px;" } " >'+
      '<div class="iw-header" style="width: '+videoWidth+'px;">'+
        '<div class="iw-title" data-bind="click: showDetails">'+
          '<h4>'+this.currentLocation.title+'</h4>'+
          '<i data-bind="css: detailsCaret" aria-hidden="true"></i>'+
        '</div>'+
        '<div class="iw-details" data-bind="visible: shouldShowDetails, css: detailsAmt ">'+
          '<h5 class="iw-city">'+this.currentLocation.city+'</h5>'+
          '<h5 class="iw-country">'+this.currentLocation.country+'</h5>'+
          '<p data-bind="css: $root.descriptionAmt">'+this.currentLocation.description+'</p>'+
          '<a class="iw-see-more-btn" data-bind="click: toggleFullText" href="">'+
            '<small data-bind="text: shouldShowFullDetails() ? \'See Less...\' : \'See More...\'"></small>'+
          '</a>'+
        '</div>'+
      '</div>'+
      '<div id="embeded-video" class="video" data-bind="html: embeddedVideo" style="width: '+videoWidth+'px;"></div>'+
      '<div class="thumbs" data-bind="foreach: videoThumbs" style="width: '+videoWidth+'px;">'+
        '<img class="thumb" data-bind="click: $root.fetchVideo, attr: { src: url }" style="width: '+thumbWidth+'px; height: '+thumbHeight+'px;">'+
      '</div>'+
    '</div>';

    // Open the infoWindow. We can only apply KO bindings
    // once the HTML has been added to the DOM.
    infoWindow.marker = marker;
    infoWindow.setContent(infoWindowHTML);
    infoWindow.open(map, marker);


    ko.applyBindings(new InfoWindow.ViewModel(map, infoWindow, marker, 
                     index, mapIsFullScreenKO), document.getElementById('partner-info-window'));

    // Make sure the marker property is cleared if the infoWindow is closed.
    infoWindow.addListener('closeclick', function(){
      MarkerStylers.unhighlightAllMarkers(markers);
      currentLocationKO(null);
      infoWindow.close();
      infoWindow.setMarker = null;
    });
  },

  ViewModel: function() {
    var self = this;
    self.embeddedVideo = ko.observable('');
    self.videoThumbs = ko.observableArray([]);
    self.shouldShowDetails = ko.observable(InfoWindow.mapIsFullScreenKO());
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
    };

    self.toggleFullText = function() {
      self.shouldShowFullDetails(!self.shouldShowFullDetails());
    };

    self.fetchVideo = function(thumb) {
      InfoWindow.embedVideo(thumb.link, self.embeddedVideo);
    };

    // Add links to videos and embed the top result.
    InfoWindow.renderVideoContent(self.videoThumbs, self.embeddedVideo);
  },

  /////////*****************/////////
  /////////* VIDEO CONTENT */////////
  /////////*****************/////////

    // Render result of video search using an arry of search terms.
  renderVideoContent: function(thumbsKO, embeddedVideoKO) {

    // Query Vimeo for videos.
    var searchTerms = this.currentLocation.searchTerms.slice();
    this.addFromQuery(searchTerms, thumbsKO, embeddedVideoKO);
  },

  // Add results from searching the next item in the searchTerms list.
  addFromQuery: function(searchTerms, thumbsKO, embeddedVideoKO) {
    var url = this.vimeoURL;
    url += '?' + $.param({
      'access_token': this.vimeoToken,
      'query': searchTerms.splice(0,1)[0]
    });

    // fetch videos matching the search term
    $.ajax({
      url: url
    }).done(function(result) {
      var dataAry = result.data;
      if(dataAry.length > 0) {
        if(embeddedVideoKO() === '') {
          InfoWindow.embedVideo(dataAry[0].link, embeddedVideoKO);
        }

        // Add thumbs to KO array
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
        // Qurey using the next search term.
        InfoWindow.addFromQuery(searchTerms, thumbsKO, embeddedVideoKO);
      }
    }).fail(function(err) {
      embeddedVideoKO(InfoWindow.vimeoErrMsg);
    });
  },

  // Using a link as an input, generate an embedded video.
  embedVideo: function(link, embeddedVideoKO) {
    var url = this.vimeoOembedURL;
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
    }).fail(function(err) {
      embeddedVideoKO(InfoWindow.vimeoErrMsg);
    });
  }
};