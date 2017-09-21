
/////////* MANAGE MAP SETUP */////////

var notifier = new ko.subscribable();

// This is called when Google Maps load.
// It tells ViewModel to init map.
function mapReady() {
	notifier.notifySubscribers("map is ready", "mapReadyForInit");
}

function gmapsError() {
	console.log('Google Maps failed to load.');
	alert('Google Maps failed to laod for unknown reasons');
}


/////////* LOAD VIEW MODEL */////////

var isMobileDevice = $( window ).width() < 700;

// Init knockoutjs ViewModel.
ko.applyBindings(new PrimaryViewModel.view(isMobileDevice));
