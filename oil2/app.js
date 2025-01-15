const middleOfMap = [15.22853958963751, 44.113604353630114];

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

	map.doubleClickZoom.disable();

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
			"fill-color": "#f2af13",
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

	const markerGeoData = await fetchMarkerData("./data/aparati/aparatiGeo.json");
	// console.log(markerGeoData);

	const el = document.createElement("img");
	el.src = "./icons/car-park.svg";
	// el.className = "sms_marker";

	el.onload = () => {
		map.addImage("custom-marker", el);

		// Add a data source containing one point feature.
		map.addSource("markers", {
			type: "geojson",
			data: markerGeoData,
		});

		// Add a layer to use the image to represent the data.
		map.addLayer({
			id: "markers",
			type: "symbol",
			source: "markers",
			layout: {
				"icon-image": "custom-marker",
				"icon-overlap": "always",
				"icon-size": 0.025,
			},
		});
	};

	const popup = new maplibregl.Popup({
		closeButton: false,
		closeOnClick: false,
	});

	map.on("mouseenter", "markers", (e) => {
		// console.log(e);

		// Change the cursor style as a UI indicator.
		map.getCanvas().style.cursor = "pointer";

		const coordinates = e.features[0].geometry.coordinates.slice();
		const description = e.features[0].properties;
		// console.log(description);

		let backgroundColor;
		let textColor;

		switch (description.zone) {
			case 1:
				backgroundColor = "#0051ff";
				break;
			case 2:
				backgroundColor = "#f2af13";
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

		while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
			coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
		}

		// Populate the popup and set its coordinates
		popup
			.setLngLat(coordinates)
			.setHTML(
				`<div class="custom-popup">
			 			  <h4>${description.place}</h4>
			 			  <p>SMS parking: ${description.SMS}</p>
			 			  <div>
			 			     <p style="background-color: ${backgroundColor}; color:${textColor}">ZONA ${description.zone}</p>
			 			 	 <p>Broj automata: <span>${description.broj}</span></p>
			 			  </div>
			 			</div>
			 			`
			)
			.addTo(map);
	});

	map.on("mouseleave", "markers", () => {
		map.getCanvas().style.cursor = "";
		popup.remove();
	});

	/*--------------adding oil and pauk markers------------------------*/
	// new maplibregl.Marker({ element: oil })
	// 	.setLngLat([15.228197268489417, 44.11298363660206])
	// 	.addTo(map);

	// new maplibregl.Marker({ element: pauk })
	// 	.setLngLat([15.231462526517115, 44.10868140866365])
	// 	.addTo(map);

	/*  pauk marker click functionality */
	const paukGeoData = await fetchMarkerData("./data/aparati/pauk.json");

	const paukEl = document.createElement("img");
	paukEl.src = "./icons/towtruck.png";

	paukEl.onload = () => {
		map.addImage("pauk-marker", paukEl);

		map.addSource("markerPauk", {
			type: "geojson",
			data: paukGeoData,
		});

		map.addLayer({
			id: "markerPauk",
			type: "symbol",
			source: "markerPauk",
			layout: {
				"icon-image": "pauk-marker",
				"icon-overlap": "always",
			},
		});
	};

	const zonaInfoContainer2 = document.createElement("div");
	zonaInfoContainer2.className = "zona_container";
	zonaInfoContainer2.dataset.value = 5;

	zonaInfoContainer2.innerHTML = `
			<div>
				<img src="./icons/pauk.png" alt="pauk ikona" width="50px" height="23px"/>
				<h3>Pauk služba</h3>
			</div>
			<div class="lokacija">
				<p>Lokacija odlagališta vozila:</p>
				<p>Marka Marulića 4</p>
				<p>23000 Zadar, Hrvatska</p>
				<p>(parkiralište RAVNICE nasuprot bolnice)</p>	
			</div>
			<div>
				<p>Informacije o premještenim vozilima:</p>
				<p>Tel: 023/302-100</p>
			</div>
			<div>
				<p>Reklamacija o premještenim vozilima:</p>
				<p>Obale i lučice d.o.o.</p>
				<p>Medulićeva 2/II</p>
			</div>
			<div>
				<p>Radno vrijeme:</p>
				<p>PON - PET od 08:00 do 15:00 h</p>
				<p>Email: <a href="https://info.pauk@oil.hr">info.pauk@oil.hr</a></p>
			</div>
			<div>
				<img src="./icons/phone.svg" alt="mobitel ikona" width="40px" height="40px"/>
				<p>023/312-297</p>
			</div>`;

	document.getElementById("map").appendChild(zonaInfoContainer2);

	/*----------------------oil marker click functionality---------------*/
	const oilGeoData = await fetchMarkerData("./data/aparati/oil.json");
	// console.log(oilGeoData);

	const oilEl = document.createElement("img");
	oilEl.src = "./icons/oil-marker.png";

	oilEl.onload = () => {
		map.addImage("oil-marker", oilEl);

		// Add a data source containing one point feature.
		map.addSource("markerOil", {
			type: "geojson",
			data: oilGeoData,
		});

		// Add a layer to use the image to represent the data.
		map.addLayer({
			id: "markerOil",
			type: "symbol",
			source: "markerOil",
			layout: {
				"icon-image": "oil-marker",
				"icon-overlap": "always",
			},
		});
	};

	const zonaInfoContainer3 = document.createElement("div");
	zonaInfoContainer3.className = "zona_container";
	zonaInfoContainer3.dataset.value = 6;

	zonaInfoContainer3.innerHTML = `
			<div>
				<h3>Obala i lučice</h3>
			</div>
			<div class="lokacija">
				<p>"Obala i lučice" d.o.o.</p>
				<p>Andrije Medulića 2</p>
				<p>23000 Zadar - HR</p>
			</div>
			<div>
				<p>Telefon +385 23 316 924</p>
				<p>Fax +385 23 212 892</p>
				<p>Pauk služba +385 23 302-100</p>
			</div>
			<div>
				<a href="https://indfo@oil.hr" target="_blank">info@oil.hr</a>
				<a href="https://www.oil.hr" target="_blank">www.oil.hr</a>
			</div>
			<div>
				<img src="./icons/phone.svg" alt="mobitel ikona" width="40px" height="40px"/>
				<p>023/316-924</p>
			</div>
		`;
	document.getElementById("map").appendChild(zonaInfoContainer3);

	/*--------------onClick functinality for zones---------------------*/
	const zoneData = await fetchMarkerData("./data/zoneInfo/info.json");
	zoneData.informacije.forEach((zona) => {
		const zonaInfoContainer = document.createElement("div");
		zonaInfoContainer.className = "zona_container";
		zonaInfoContainer.dataset.value = +zona.zona;
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
	map.on("click", "markerPauk", (e) => handlePolygonClick(e, 5));
	map.on("click", "markerOil", (e) => handlePolygonClick(e, 6));

	function handlePolygonClick(event, zoneId) {
		console.log(event);

		const infoContainer = document.querySelector(`[data-value="${zoneId}"]`);

		const allInfoContainers = document.querySelectorAll(".zona_container");

		allInfoContainers.forEach((container) => {
			console.log(+container.dataset.value);

			if (+container.dataset.value !== +zoneId)
				container.classList.remove("active");
		});

		if (infoContainer) {
			infoContainer.classList.toggle("active");
		}
	}

	/*-----------------adding sms info--------------------------*/
	const messageInfo = document.createElement("div");
	messageInfo.className = "sms_container";
	messageInfo.innerHTML = `
			<div class="message_info">
				<img src="./icons/phone.svg" alt="mobitel ikona" width="40px" height="40px"/>
				<p>SMS PARKING</p>
			</div>
			<div class="numbers_info">
				<p>Pošaljite registraciju automobila na broj</p>
				<ul>
					<li>
						ZONA 0 - 708239
					</li>
					<li>
						ZONA 1 - 708231
					</li>
					<li>
						ZONA 2 - 708232
					</li>
					<li>
						ZONA 3 - 708233
					</li>
				</ul>
			</div>
		`;

	document.getElementById("map").appendChild(messageInfo);

	/*------------------adding onCLick removal of all markers------*/
	const toggleMarkersButton = document.querySelector("#toggleMarkers");
	const togglePaukButton = document.querySelector("#togglePauk");
	const toggleOilButton = document.querySelector("#toggleOil");

	let markersVisible = true;
	let paukVisible = true;
	let oilVisible = true;

	toggleMarkersButton.addEventListener("click", () => {
		markersVisible = !markersVisible;
		toggleLayerVisibility("markers", markersVisible);
	});
	togglePaukButton.addEventListener("click", () => {
		paukVisible = !paukVisible;
		toggleLayerVisibility("markerPauk", paukVisible);
	});

	toggleOilButton.addEventListener("click", () => {
		oilVisible = !oilVisible;
		toggleLayerVisibility("markerOil", oilVisible);
	});

	function toggleLayerVisibility(layerId, visible) {
		if (visible) {
			map.setLayoutProperty(layerId, "visibility", "visible");
		} else {
			map.setLayoutProperty(layerId, "visibility", "none");
		}
	}
}

init();
