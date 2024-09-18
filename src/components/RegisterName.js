import { Button, makeStyles, TextField, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import GeoMap from "./GeoMap";
import map from "../images/mapblue.jpg";

const useStyles = makeStyles((theme) => ({
  registrationRoot: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${map})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  },
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(4),
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: "12px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)",
  },
  title: {
    color: "white",
    fontWeight: "bold",
    marginBottom: theme.spacing(4),
    textAlign: "center",
    fontSize: "3rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "2rem",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.5rem",
    },
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "400px",
  },
  textField: {
    marginBottom: theme.spacing(2),
    "& .MuiFilledInput-root": {
      backgroundColor: "rgba(63,81,181,0.7)",
      color: "white",
    },
    "& .MuiInputLabel-root": {
      color: "white",
    },
    "& .MuiFilledInput-underline:before": {
      borderBottom: "2px solid white",
    },
    "& .MuiFilledInput-underline:after": {
      borderBottom: "2px solid white",
    },
  },
  button: {
    marginTop: theme.spacing(2),
    backgroundColor: "#3f51b5",
    color: "white",
    "&:hover": {
      backgroundColor: "#303f9f",
    },
  },
}));

const RegisterName = () => {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [registered, setRegistered] = useState(false);
  const [coords, setCoords] = useState(null);

  const register = (e) => {
    e.preventDefault();
    if (username !== "") {
      setRegistered(true);
    }
  };

  useEffect(() => {
    const updateCoordinates = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          console.log("localCoordsUpdated =>", position.coords);
        },
        (error) => {
          console.log(error);
        },
        { enableHighAccuracy: true }
      );
    };

    updateCoordinates();

    const interval = setInterval(() => {
      updateCoordinates();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={registered ? "" : classes.registrationRoot}>
      {!registered ? (
        <div className={classes.page}>
          <Typography className={classes.title}>
            Real Time Client Positioning Map
          </Typography>
          <form className={classes.form} onSubmit={register}>
            <TextField
              id="outlined-basic"
              label="Name"
              variant="filled"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={classes.textField}
            />
            <Button
              className={classes.button}
              variant="contained"
              type="submit"
            >
              Go to map
            </Button>
          </form>
        </div>
      ) : (
        coords && (
          <div style={{ height: "100vh", width: "100vw" }}>
            <GeoMap username={username} coords={coords} />
          </div>
        )
      )}
    </div>
  );
};

export default RegisterName;
