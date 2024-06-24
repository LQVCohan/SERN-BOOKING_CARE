import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const HCMUTE = {
  lat: 10.851035,
  lng: 106.772652,
};

const MyMap = () => {
  return (
    <MapContainer
      center={HCMUTE}
      zoom={15}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={HCMUTE}>
        <Popup>
          HCMUTE <br /> Ho Chi Minh City University of Technology and Education.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MyMap;
