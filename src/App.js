import "./App.css";
import States from "./data.json";
import { Map } from "react-map-gl";
import DeckGL, { GeoJsonLayer } from "deck.gl";

// Access the MAPBOX_ACCESS_TOKEN environment variable
const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

const INITIAL_VIEW_STATE = {
  latitude: 12.977439,
  longitude: 77.570839,
  zoom: 3,
  bearing: 0,
  pitch: 30,
};

function App() {
  const onClick = (info) => {
    if (info.object) {
      alert(info.object.properties.st_nm);
    }
  };

  const layers = [
    new GeoJsonLayer({
      id: "States",
      data: States,
      //styles
      filled: true,
      pointRadiusMinPixels: 5,
      pointRadiusScale: 2000,
      getFillColor: [86, 144, 58, 250],
      pickable: true,
      autoHighlight: true,
      onClick,
    }),
  ];

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
    >
      <Map mapStyle={MAP_STYLE} mapboxAccessToken={MAPBOX_ACCESS_TOKEN} />
    </DeckGL>
  );
}

export default App;
