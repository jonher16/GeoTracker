import React, { useEffect, useState } from "react";
import GeoMap from "./GeoMap";

const RegisterName = () => {
  const [username, setUsername] = useState("");
  const [registered, setRegistered] = useState(false);
  const [coords, setCoords] = useState({})

  const register = (e) => {
    e.preventDefault();
    if (username !== "") {
      setRegistered(true);
    }
  };
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        console.log("localCoords =>", position.coords);
      },
      function (error) {
        console.log(error);
      },
      { enableHighAccuracy: true }
    );
  }, [])

  return (
    <div>
      {!registered && (
        <form onSubmit={register}>
          <label>Introduzca su nombre</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button>Go to map</button>
        </form>
      )}
      {
          registered && <GeoMap username={username} coords={coords} />
      }
    </div>
  );
};

export default RegisterName;
