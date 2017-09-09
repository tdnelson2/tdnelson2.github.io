var SidebarViewModel = {
	view: function() {
	    var self = this;
	    var initialLocations = AppDelegate.getModel();
	    self.locationList = ko.observableArray([]);
	    self.countries = ko.observableArray([{name: 'All'}]);
	    self.selectedCountry = ko.observable(self.countries()[0]);

	    if($( window ).width() > 500){
	    	AppDelegate.hideHamburgerMenuButton();
	    } else {
	    	AppDelegate.mobileMode();
	    }

	    // displays details within the sidebar 
	    // about the selected location
	    self.currentLocation = ko.observable();

	    // pull data from the model into an observable array
	    initialLocations.forEach(function(locationItem) {
	        self.locationList.push( AppDelegate.buildLocation(locationItem) );
	        var countries = self.countries().map(function(x) {return x.name;});
	        if(!countries.includes(locationItem.country)) {
	        	console.log()
	        	self.countries.push({name: locationItem.country});
	        }
	    });
	    console.log(self.countries());


	    self.renderLocation = function(location) {
	        self.currentLocation(location);
	        var thisLocationIndex = self.locationList().indexOf(location);
	        AppDelegate.displayInfoWindow(thisLocationIndex, false);
	        AppDelegate.highlightMarker(thisLocationIndex);
	    }

	    self.filterByCountry = function(location) {
	    	self.currentLocation(null);
	    	AppDelegate.closeInfoWindow();
	    	AppDelegate.unhighlightMarkers();
	    	var markersToHide = [];
	    	for (var i = 0; i < self.locationList().length; i++) {
	    		var loc = self.locationList()[i]
	    		var selected = self.selectedCountry().name;
	    		if(selected == 'All') {
	    			loc.hide(false);
	    		} else if(loc.country() != selected) {
	    			loc.hide(true);
	    			markersToHide.push(i);
	    		} else if(loc.hide() === true) {
	    			loc.hide(false);
	    		}
	    	}
	    	AppDelegate.hideSpecifiedMarkers(markersToHide);
	    }

	    self.closeSidebar = function() {
	    	AppDelegate.hideSidebar();
	    }

	    self.openSidebar = function() {
	    	AppDelegate.showSidebar();
	    }
	}
}