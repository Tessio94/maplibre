const middleOfMap = [15.22853958963751, 44.114604353630114];

async function init() {
	const map = new maplibregl.Map({
		style: "https://tiles.openfreemap.org/styles/liberty",
		center: middleOfMap,
		zoom: 15,
		container: "map",
	});

	map.addControl(
		new maplibregl.NavigationControl({
			visualizePitch: true,
			visualizeRoll: true,
			showZoom: true,
			showCompass: true,
		})
	);

	/*----------------------fetching polygon json data...............*/
	async function fetchData(path) {
		const response = await fetch(path);
		if (!response.ok) {
			throw new Error("Request error");
		}
		const data = await response.json();
		return data;
	}

	const results = await Promise.all([
		fetchData("./data/zone/zona0.json"),
		fetchData("./data/zone/zona1.json"),
		fetchData("./data/zone/zona2.json"),
		fetchData("./data/zone/zona3.json"),
		fetchData("./data/zone/zona4.json"),
		fetchData("./data/zone/kolodvor.json"),
	]);
	console.log(results);

	/*----------------------adding json data...............*/
	map.addSource("polygon0", {
		type: "geojson",
		data: results[0],
	});

	map.addSource("polygon1", {
		type: "geojson",
		data: results[1],
	});

	map.addSource("polygon2", {
		type: "geojson",
		data: results[2],
	});

	map.addSource("polygon3", {
		type: "geojson",
		data: results[3],
	});

	map.addSource("polygon4", {
		type: "geojson",
		data: results[4],
	});

	map.addSource("polygon5", {
		type: "geojson",
		data: results[5],
	});

	/*----------------------adding layers-----------------*/
	map.addLayer({
		id: "polygon-layer0",
		type: "fill",
		source: "polygon0",
		layout: {},
		paint: {
			"fill-color": "#ba0909",
			"fill-opacity": 0.9,
		},
	});

	map.addLayer({
		id: "polygon-layer1",
		type: "fill",
		source: "polygon1",
		layout: {},
		paint: {
			"fill-color": "#0051ff",
			"fill-opacity": 0.9,
		},
	});

	map.addLayer({
		id: "polygon-layer2",
		type: "fill",
		source: "polygon2",
		layout: {},
		paint: {
			"fill-color": "#f2ef13",
			"fill-opacity": 0.9,
		},
	});

	map.addLayer({
		id: "polygon-layer3",
		type: "fill",
		source: "polygon3",
		layout: {},
		paint: {
			"fill-color": "#96249c",
			"fill-opacity": 0.9,
		},
	});

	map.addLayer({
		id: "polygon-layer4",
		type: "fill",
		source: "polygon4",
		layout: {},
		paint: {
			"fill-color": "#0da32e",
			"fill-opacity": 0.9,
		},
	});

	map.addLayer({
		id: "polygon-layer5",
		type: "fill",
		source: "polygon5",
		layout: {},
		paint: {
			"fill-color": "#14a1a3",
			"fill-opacity": 0.9,
		},
	});

	/*---------------------adding markers--------------------------*/
	async function fetchMarkerData(path) {
		const response = await fetch(path);
		if (!response.ok) {
			throw new Error("Request error");
		}
		const data = await response.json();
		return data;
	}
	const markerData = await fetchMarkerData("./data/aparati/automati.json");
	console.log(markerData.automati);

	markerData.automati.forEach((marker) => {
		// Create a new div for the marker (if custom styling is needed)
		const el = document.createElement("img");
		el.src = "./icons/car-park.png";
		el.style.width = "40px";
		el.style.height = "40px";

		// Create a popup for the marker
		const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
			`<div>
			  <h4 style="text-transform: uppercase;">${marker.place}</h4>
			  <p>SMS parking: ${marker.SMS}</p>
			  <p>Broj automata: ${marker.broj}</p>
			  <p>Zona: ${marker.zone}</p>
			</div>
			`
		);

		// Add the marker to the map
		new maplibregl.Marker({ element: el })
			.setLngLat(marker.coords)
			.setPopup(popup)
			.addTo(map);
	});

	// new maplibregl.Marker({
	// 	element: lukaZem,
	// 	closeOnClick: false,
	// })
	// 	.setLngLat([15.353344939653262, 44.09665237319331])
	// 	.setPopup(popupZem)
	// 	.addTo(map);
}

init();
