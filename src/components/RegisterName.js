import { Button, makeStyles, TextField, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import GeoMap from "./GeoMap";
import map from "../images/mapblue.jpg"


const useStyles = makeStyles((theme) => ({
  page: {
    justifyContent: "center",
    padding: theme.spacing(10),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "100%",
    height: "72.3vh",
    backgroundImage: `url(${map})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  },
  title : {
    maxWidth: "100%",
    minWidth: "90vw",
    fontWeight: "bold",
    justifyContent: "center",
    marginBottom: "5vh",
    textAlign: "center",
    backgroundColor: "rgba(63,81,181,0.7)",
    borderRadius: "2vh",
    shadow: "2vh",
    fontSize: "4rem",
    [theme.breakpoints.down('sm')]: {
      fontSize: "2rem",
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: "1.5rem",
      minWidth: "40vw"
    }
  },
  form : {
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    
  },
  button: {
    marginTop: "2",
  },
  textfield: {
    color: "white"
  }
}));
const RegisterName = () => {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [registered, setRegistered] = useState(false);
  const [coords, setCoords] = useState({});

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
        console.log("localCoordsUpdated =>", position.coords);
      },
      function (error) {
        console.log(error);
      },
      { enableHighAccuracy: true }
    );
    setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          console.log("localCoordsUpdated =>", position.coords);
        },
        function (error) {
          console.log(error);
        },
        { enableHighAccuracy: true }
      );
    }, 15000);
  }, []);

  return (
    <div>
      {!registered && (
        <div className={classes.page}>
          <Typography className={classes.title} >Real Time Client Positioning Map</Typography>
          <form className={classes.form} onSubmit={register}>
            <TextField classname={classes.textfield}
              id="outlined-basic"
              label="Name"
              style={{
                backgroundColor: "rgba(63,81,181,0.7)",
            }}
            InputProps={{
              style: {
                  color: "white"
              }
          }}
              variant="filled"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button className={classes.button} variant="contained" color="primary" onClick={register}>
              Go to map
            </Button>
          </form>
        </div>
      )}
      {registered && <GeoMap username={username} coords={coords} />}
    </div>
  );
};

export default RegisterName;
