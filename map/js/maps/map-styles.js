
// Create a styles array to use with the map.
var styles = [
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [
      {color: '#dfd2ae'}
      ]
  },
  {
    featureType: 'water',
    stylers: [
      { color: '#262626' }
    ]
  },{
    featureType: 'administrative',
    elementType: 'labels',
    stylers: [
      { visibility: 'off' }
    ]
  },{
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [
      { visibility: 'on' },
      { color: '#d46c2a' }
    ]
  },{
    featureType: 'administrative',
    elementType: 'labels.text.stroke',
    stylers: [
      { visibility: 'on' },
      { color: '#ffffff' },
      { weight: 4 }
    ]
  },{
    featureType: 'road',
    stylers: [
      { visibility: 'off' }
    ]
  },{
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [
      { lightness: 100 }
    ]
  },{
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      { lightness: -100 }
    ]
  },{
    featureType: 'poi',
    stylers: [
      { visibility: 'off' }
    ]
  }
];