
/////////* MANAGE MAP SETUP */////////

var notifier = new ko.subscribable();

// This is called when Google Maps load.
// It tells ViewModel to init map.
function mapReady() {
	notifier.notifySubscribers("map is ready", "mapReadyForInit");
}


// This is called if Google Maps request times out.
setTimeout(function() {
	try {
		if(!google || !google.maps) {}
	} catch(err) {
		notifier.notifySubscribers("map timmed out", "mapTimout");
	}
}, 8000);


/////////* LOAD VIEW MODEL */////////

var isMobileDevice = $( window ).width() < 700;

// Init knockoutjs ViewModel.
ko.applyBindings(new PrimaryViewModel.view(isMobileDevice));
