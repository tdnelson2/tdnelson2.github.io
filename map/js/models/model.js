var Model = {
	// Partner data
	Locations : [
		{
			title: 'Rwanda Partners',
			city: 'Kigali',
			country: 'Rwanda',
			description: 'Founded by a local pastor who survived the genocide, our Rwandan Ministry partners have always been focused on bringing hope and healing through restored relationships. Since 1996 they have been serving orphans in the country\'s capital city of Kigali. Now through partnership with Lahash, the ministry is expanding into the rural outskirts of the city where a new generation of vulnerable children are struggling against poverty, disease, and lack of education. Through the local church they are reaching out to change these young lives with the love and good news of Jesus.',
			coordinates: {
				lat: -1.953768,
				lng: 30.096305
			}
		}, {
			title: 'Kampala House',
			city: 'Kampala',
			country: 'Uganda',
			description: 'Uganda has become home to many South Sudanese refugees who fled during Sudan\'s seemingly endless cycle of civil war and political instability. Kampala House exist to provide safe refuge for children whose lives have been marked by indescribable losses. For many of them, the ministry has offered the only stable living situation they have ever known.',
			coordinates: {
				lat: 0.311491,
				lng: 32.574313
			}
		}, {
			title: 'Grace & Healing Ministry',
			city: 'Dodoma',
			country: 'Tanzania',
			description: 'In Dodoma, Tanzania, a group of women at a local church were moved by the plight of those in their community suffering with HIV/AIDS, so they met, prayed, and then founded a ministry. Lahash is honored to partner with the passionate and creative staff of Grace & Healing Ministry as they make a positive difference in so many lives. Children once at high risk of extreme neglect due to their poor health and poverty now thrive as they attend school, live in stable homes, and fill the halls of a local church with laughter.',
			coordinates: {
				lat: -6.158543,
				lng: 35.744421
			}
		}, {
			title: 'Nipe Tumaini',
			city: 'Nairobi',
			country: 'Kenya',
			description: 'In a dry region of Kenya\'s Rift Valley, this children\'s home offers hope and healing to extremely vulnerable kids. Nipe Tumaini means “give me hope” in Swahili, and that is exactly what this family-style home is doing. With a focus on sustainability and holistic care, the home is surrounded by abundant gardens and staffed with caring house parents. Now precious children who had been abandoned and abused are being lovingly nourished in both body and soul.',
			coordinates: {
				lat: -1.285289,
				lng: 36.579728
			}
		}, {
			title: 'Path of Hope',
			city: 'Shinyanga',
			country: 'Tanzania',
			description: 'The rural region of Shinyanga, in northern Tanzania, is known for extreme poverty, food shortages, and lack of access to education. Path of Hope is a church-based ministry serving children affected by HIV/AIDS and extreme poverty. Many of the children here have never heard the gospel and have never been to school. Lahash and Path of Hope are working hard to change that, one family at a time.',
			coordinates: {
				lat: -3.671110,
				lng: 33.424168
			}
		}
	],

	Location: function(data) {
		this.title = data.title;
		this.city = data.city;
		this.country = data.country;
		this.description = data.description;
		this.coordinates = data.coordinates;
		this.hide = ko.observable(false);
		this.marker = null;
	}
};