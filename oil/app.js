const middleOfMap = [15.22853958963751, 44.114604353630114];

const oil = document.querySelector("#oil");
const pauk = document.querySelector("#pauk");

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
	// console.log(results);

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

	/*-----------------adding parking machine markers--------------------------*/
	async function fetchMarkerData(path) {
		const response = await fetch(path);
		if (!response.ok) {
			throw new Error("Request error");
		}
		const data = await response.json();
		return data;
	}
	const markerData = await fetchMarkerData("./data/aparati/automati.json");
	// console.log(markerData.automati);

	markerData.automati.forEach((marker) => {
		// Create a new div for the marker (if custom styling is needed)
		const el = document.createElement("img");
		el.className = "sms_marker";
		el.src = "./icons/car-park.svg";
		el.style.width = "40px";
		el.style.height = "40px";
		el.style.color = "red";

		let backgroundColor;
		let textColor;

		switch (marker.zone) {
			case 1:
				backgroundColor = "#0051ff";
				break;
			case 2:
				backgroundColor = "#f2ef13";
				textColor = "#707070";
				break;
			case 3:
				backgroundColor = "#96249c";
				break;
			case 4:
				backgroundColor = "#0da32e";
				break;
			default:
				backGroundColor = "red";
				break;
		}

		// Create a popup for the marker
		const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
			`<div class="custom-popup">
			  <h4>${marker.place}</h4>
			  <p>SMS parking: ${marker.SMS}</p>
			  <div>
			     <p style="background-color: ${backgroundColor}; color:${textColor}">ZONA ${marker.zone}</p>
			 	 <p>Broj automata: <span>${marker.broj}</span></p>
			  </div>	 
			</div>
			`
		);

		// Add the marker to the map
		new maplibregl.Marker({ element: el })
			.setLngLat(marker.coords)
			.setPopup(popup)
			.addTo(map);
	});

	/*--------------adding oil and pauk markers------------------------*/
	new maplibregl.Marker({ element: oil })
		.setLngLat([15.228197268489417, 44.11298363660206])
		.addTo(map);

	new maplibregl.Marker({ element: pauk })
		.setLngLat([15.231462526517115, 44.10868140866365])
		.addTo(map);

	/*--------------onClick functinality for zones---------------------*/
	const zoneData = await fetchMarkerData("./data/zoneInfo/info.json");
	zoneData.informacije.forEach((zona) => {
		const zonaInfoContainer = document.createElement("div");
		zonaInfoContainer.className = "zona_container";
		zonaInfoContainer.id = +zona.zona;
		zonaInfoContainer.innerHTML = `
			<div style="background-color: ${zona.backgroundColor}; color: ${
			zona.textColor
		}; 
				">
            	<h3>Zona ${zona.zona}</h3>
				<p>${zona.parkirnaMjesta} parkirnih mjesta</p>
			</div>
			<p class="cijena">CIJENA PARKINGA <span>(sat vremena)</span><p/>
			<div class="tarifa">
				<p>${zona.cijena}</p>
				<p>
					<span>15.6. - 31.8.</span>
					${zona.ljetnaCijena}
				</p>
			</div>
			<p class="info">${zona.info}</p>
			${
				zona.broj
					? `<div class="sms">
				<div>
					<img src="./icons/phone.svg" alt="mobitel ikona" width="40px" height="40px"/>
					<p>Pošaljite registraciju na broj</p>
				</div>
				<p>${zona.broj}</p>
			</div>`
					: `<p class="ravnice">Plaćanje samo na automatskoj blagajni ili kod operatera</p>`
			}
				${
					zona.brojInfo
						? `
				<div  class="phoneInfo">	
					<img src="./icons/phone.svg" alt="mobitel ikona" width="40px" height="40px"/>	
					<p>${zona.brojInfo}</p>
				</div>`
						: ""
				}
		`;
		document.getElementById("map").appendChild(zonaInfoContainer);
	});

	map.on("click", "polygon-layer1", (e) => handlePolygonClick(e, 1));
	map.on("click", "polygon-layer2", (e) => handlePolygonClick(e, 2));
	map.on("click", "polygon-layer3", (e) => handlePolygonClick(e, 3));
	map.on("click", "polygon-layer4", (e) => handlePolygonClick(e, 4));

	function handlePolygonClick(event, zoneId) {
		console.log(zoneId);

		const infoContainer = document.getElementById(zoneId);

		const allInfoContainers = document.querySelectorAll(".zona_container");
		console.log(allInfoContainers);

		allInfoContainers.forEach((container) => {
			if (+container.id !== +zoneId) container.classList.remove("active");
		});

		if (infoContainer) {
			infoContainer.classList.toggle("active");
		}
	}

	styleZoneMarker();
}

init();

const styleZoneMarker = () => {
	const markers = document.querySelectorAll(".sms_marker");
	const zones = document.querySelectorAll(".custom-popup");
	// console.log(markers);
	// console.log(zones);
};
