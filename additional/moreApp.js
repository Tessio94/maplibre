import "https://unpkg.com/maplibre-gl/dist/maplibre-gl.js";

const middleOfMap = [15.293044345450978, 44.11082841934155];

async function getLocation() {
	try {
		const response = await fetch("http://ip-api.com/json/");
		const json = await response.json();
		if (typeof json.lat === "number" && typeof json.lon === "number") {
			return [json.lon, json.lat];
		}
	} catch (error) {}
	return middleOfMap;
}

async function init() {
	const map = new maplibregl.Map({
		style: "https://tiles.openfreemap.org/styles/liberty",
		center: middleOfMap,
		zoom: 12,
		container: "map",
	});

	const location = await getLocation();
	if (location !== middleOfMap) {
		map.flyTo({ center: location, zoom: 11 });

		new maplibregl.Marker({
			closeOnClick: false,
		})
			.setLngLat(location)
			.addTo(map);
	}
}

init();
