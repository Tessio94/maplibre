import "https://unpkg.com/maplibre-gl/dist/maplibre-gl.js";

const lukaZem = document.getElementById("markerZem");
const lukaGaz = document.getElementById("markerGaz");
const autoBus = document.getElementById("markerBus1");
const gradBus = document.getElementById("markerBus2");

const middleOfMap = [15.293044345450978, 44.11082841934155];

async function init() {
	const map = new maplibregl.Map({
		style: "https://tiles.openfreemap.org/styles/liberty",
		center: middleOfMap,
		zoom: 12,
		container: "map",
	});

	const popupZem = new maplibregl.Popup({ offset: 25 }).setText(
		"Zračna luka Zemunik"
	);
	const popupGaz = new maplibregl.Popup({ offset: 25 }).setText(
		"Trajektna luka Gaženica"
	);
	const popupKol = new maplibregl.Popup({ offset: 25 }).setText(
		"Autobusni kolodvor Zadar"
	);
	const popupGrad = new maplibregl.Popup({ offset: 25 }).setText(
		"Poluotok centar (liburnska obala)"
	);

	new maplibregl.Marker({
		element: lukaZem,
		closeOnClick: false,
	})
		.setLngLat([15.353344939653262, 44.09665237319331])
		.setPopup(popupZem)
		.addTo(map);

	new maplibregl.Marker({
		element: lukaGaz,
		closeOnClick: false,
	})
		.setLngLat([15.270712779514954, 44.08849648128898])
		.setPopup(popupGaz)
		.addTo(map);

	new maplibregl.Marker({
		element: autoBus,
		closeOnClick: false,
	})
		.setLngLat([15.240751283830972, 44.10652063216309])
		.setPopup(popupKol)
		.addTo(map);

	new maplibregl.Marker({
		element: gradBus,
		closeOnClick: false,
	})
		.setLngLat([15.226058939654232, 44.11748961647949])
		.setPopup(popupGrad)
		.addTo(map);
}

init();
