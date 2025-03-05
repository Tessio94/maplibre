import "https://unpkg.com/maplibre-gl/dist/maplibre-gl.js";

const lukaZem = document.getElementById("markerZem");
const lukaGaz = document.getElementById("markerGaz");
const autoBus = document.getElementById("markerBus1");
const gradBus = document.getElementById("markerBus2");

const middleOfMap = [15.293044345450978, 44.11082841934155];

// satelite tiles
// https://api.maptiler.com/maps/hybrid/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL

async function init() {
	const map = new maplibregl.Map({
		style: "https://tiles.openfreemap.org/styles/liberty",
		center: middleOfMap,
		zoom: 12,
		container: "map",
	});

	console.log(map);

	map.addControl(
		new maplibregl.NavigationControl({
			visualizePitch: true,
			visualizeRoll: true,
			showZoom: true,
			showCompass: true,
		})
	);

	map.addControl(new maplibregl.FullscreenControl());

	map.doubleClickZoom.disable();

	const popups = {
		lukaZem: new maplibregl.Popup({ offset: 25, closeButton: false }).setHTML(
			`<div class="custom-popup">
				<h4>Zračna luka Zemunik</h4>
				<p>Ulica I 2A, 23222, Zemunik Donji</p>
			</div>`
		),
		lukaGaz: new maplibregl.Popup({ offset: 25, closeButton: false }).setHTML(
			`<div class="custom-popup">
				<h4>Trajektna luka Gaženica</h4>
				<p>Gaženička cesta, 23000, Zadar</p>
			</div>`
		),
		autoBus: new maplibregl.Popup({ offset: 25, closeButton: false }).setHTML(
			`<div class="custom-popup">
				<h4>Autobusni kolodvor Zadar</h4>
				<p>Autobusni kolodvor Zadar, 23000, Zadar</p>
			</div>`
		),
		gradBus: new maplibregl.Popup({ offset: 25, closeButton: false }).setHTML(
			`<div class="custom-popup">
				<h4>Poluotok centar</h4>
				<p>Liburnska obala 4, 23000, Zadar</p>
			</div>`
		),
	};

	const markers = [
		{
			element: lukaZem,
			coordinates: [15.353344939653262, 44.09665237319331],
			popup: popups.lukaZem,
		},
		{
			element: lukaGaz,
			coordinates: [15.25806, 44.09609],
			popup: popups.lukaGaz,
		},
		{
			element: autoBus,
			coordinates: [15.240751283830972, 44.10652063216309],
			popup: popups.autoBus,
		},
		{
			element: gradBus,
			coordinates: [15.226058939654232, 44.11748961647949],
			popup: popups.gradBus,
		},
	];

	markers.forEach(({ element, coordinates, popup }) => {
		const marker = new maplibregl.Marker({ element, closeOnClick: false })
			.setLngLat(coordinates)
			.addTo(map);

		element.addEventListener("mouseenter", () => {
			popup.setLngLat(coordinates).addTo(map);
		});

		element.addEventListener("mouseleave", () => {
			popup.remove();
		});
	});

	// const routeCoordinates = markers.map(({ coordinates }) => coordinates);
	const data = await fetch("./data/ruta.json").then((res) => res.json());

	console.log(data.ruta);

	map.on("load", () => {
		map.addSource("route", {
			type: "geojson",
			data: {
				type: "Feature",
				geometry: {
					type: "LineString",
					coordinates: data.ruta,
				},
			},
		});

		map.addLayer({
			id: "route",
			type: "line",
			source: "route",
			layout: {
				"line-join": "round",
				"line-cap": "round",
			},
			paint: {
				"line-color": "#007bff",
				"line-width": 4,
			},
		});
	});

	/*--------------------------3D------------------------*/
	const optionsInfo = document.createElement("div");
	optionsInfo.className = "options_container";
	optionsInfo.innerHTML = `
			<div class="option3D">
				<img class="dimension_icon" src="./icons/3d_icon.svg" alt="mobitel ikona" width="40px" height="40px"/>
			</div>
		`;

	// <div class="satellite_img">
	// 	<img class="satellite_tiles" src="./icons/satelit_tiles.png" alt="mobitel ikona"/>
	// </div>

	document.getElementById("map").appendChild(optionsInfo);

	const option3D = document.querySelector(".option3D");
	const dimensionIcon = document.querySelector(".dimension_icon");
	// const tiles = document.querySelector(".satellite_tiles");
	let option = false;
	// let satellite = false;

	option3D.addEventListener("click", () => {
		option = !option;
		// const currentZoom = map.getZoom();

		if (option) {
			map.easeTo({
				pitch: 60,
				bearing: 30,
				// zoom: currentZoom + 1,
				duration: 1000,
				easing: (t) => t,
			});
			dimensionIcon.src = "./icons/2d_icon.svg";
		} else {
			map.easeTo({
				pitch: 0,
				bearing: 0,
				// zoom: currentZoom - 1,
				duration: 1000,
				easing: (t) => t,
			});
			dimensionIcon.src = "./icons/3d_icon.svg";
		}
	});

	// tiles.addEventListener("click", () => {
	// 	satellite = !satellite;

	// 	if (satellite) {
	// 		map.setStyle(
	// 			"https://api.maptiler.com/maps/hybrid/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL"
	// 		);
	// 		tiles.src = "./icons/mapa_tiles.png";
	// 	} else {
	// 		map.setStyle("https://tiles.openfreemap.org/styles/liberty");
	// 		tiles.src = "./icons/satelit_tiles.png";
	// 	}
	// });
}

init();
