import React, { useEffect, useState, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { makeStyles, Button, Popper, TextField, ClickAwayListener } from "@material-ui/core";
import L from "leaflet";

// Create a marker icon
const myIcon = L.icon({
  iconUrl:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=",
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -40],
});

const GeoMap = ({ username, coords }) => {
  const classes = useStyles();
  const [localCoords, setLocalCoords] = useState(() => {
    // Retrieve stored coordinates and messages from localStorage on load
    const savedCoords = localStorage.getItem("geoCoords");
    return savedCoords ? JSON.parse(savedCoords) : [];
  });
  const [message, setMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [initialCenter, setInitialCenter] = useState(false);
  const prevCoords = useRef(null); // To keep track of previous coordinates

  // Update localStorage whenever localCoords changes
  useEffect(() => {
    localStorage.setItem("geoCoords", JSON.stringify(localCoords));
  }, [localCoords]);

  const handleSendMessage = () => {
    if (coords.lat && coords.lng && message.trim() !== "") {
      const newCoord = {
        username,
        coordinates: { lat: coords.lat, lng: coords.lng },
        message,
      };
      // Add the new comment and coordinate locally
      setLocalCoords([...localCoords, newCoord]);
      setMessage("");
      setAnchorEl(null);
    }
  };

  const handleButtonClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleClickAway = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div className={classes.container}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleButtonClick}
        className={classes.floatingButton}
      >
        Add Message
      </Button>

      <Popper open={open} anchorEl={anchorEl} placement="bottom-start" className={classes.popper}>
        <ClickAwayListener onClickAway={handleClickAway}>
          <div className={classes.popperContent}>
            <TextField
              label="Enter a message"
              variant="outlined"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
              style={{ marginTop: "10px" }}
            >
              Send
            </Button>
          </div>
        </ClickAwayListener>
      </Popper>

      <MapContainer
        className={classes.map}
        center={coords.lat && coords.lng ? [coords.lat, coords.lng] : [43.3383, -1.78921]}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {localCoords.map(({ username, coordinates: { lat, lng }, message }, index) => (
          <Marker key={index} icon={myIcon} position={[lat, lng]}>
            <Popup>
              <strong>{username}</strong>
              <br />
              {message || "No message"}
            </Popup>
          </Marker>
        ))}
        <SetMapCenter
          coords={coords}
          initialCenter={initialCenter}
          setInitialCenter={setInitialCenter}
          prevCoords={prevCoords}
        />
      </MapContainer>
    </div>
  );
};

const SetMapCenter = ({ coords, initialCenter, setInitialCenter, prevCoords }) => {
  const map = useMap();

  useEffect(() => {
    // Center the map only when the component is mounted or the coordinates change significantly
    if (!initialCenter && coords.lat && coords.lng) {
      map.setView([coords.lat, coords.lng], 13);
      setInitialCenter(true);
      prevCoords.current = coords;
    } else if (
      prevCoords.current &&
      (Math.abs(prevCoords.current.lat - coords.lat) > 0.0020 ||
        Math.abs(prevCoords.current.lng - coords.lng) > 0.0020)
    ) {
      map.setView([coords.lat, coords.lng], 13);
      prevCoords.current = coords;
    }
  }, [coords, map, initialCenter, setInitialCenter, prevCoords]);

  return null;
};

const useStyles = makeStyles((theme) => ({
  container: {
    position: "relative",
  },
  map: {
    height: "100vh",
  },
  floatingButton: {
    position: "absolute",
    top: 10,
    right: 10, // Adjusted to position the button on the top right
    zIndex: 1300,
  },
  popper: {
    zIndex: 1300,
  },
  popperContent: {
    padding: theme.spacing(2),
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: theme.shadows[5],
    display: "flex",
    flexDirection: "column",
  },
}));

export default GeoMap;
