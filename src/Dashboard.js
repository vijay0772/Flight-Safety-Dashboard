import React, { useEffect, useState } from "react";
import { Container, Typography, CircularProgress, Paper, Grid, Card, CardContent, Button } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getDistance } from "geolib";
import { useNavigate } from "react-router-dom";

// ✅ Import icons
import planeIconImg from "./icons/plane.png";
import balloonIconImg from "./icons/balon.png";

const NEARBY_RADIUS_KM = 50;

const airplaneIcon = new L.Icon({
  iconUrl: planeIconImg,
  iconSize: [45, 45],
  iconAnchor: [22, 45],
  popupAnchor: [0, -45],
});

const balloonIcon = new L.Icon({
  iconUrl: balloonIconImg,
  iconSize: [45, 45],
  iconAnchor: [22, 45],
  popupAnchor: [0, -45],
});

const Dashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [balloons, setBalloons] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [alertsRes, balloonsRes, flightsRes] = await Promise.all([
        fetch("https://flaskserver-production-3215.up.railway.app/api/alerts").then((res) => res.json()),
        fetch("https://flaskserver-production-3215.up.railway.app/api/weather-data").then((res) => res.json()),
        fetch("https://flaskserver-production-3215.up.railway.app/api/flight-data").then((res) => res.json()),
      ]);

      let filteredFlights = [];

      balloonsRes.forEach(balloon => {
        const nearbyFlights = flightsRes.filter(flight =>
          getDistance(
            { latitude: balloon.latitude, longitude: balloon.longitude },
            { latitude: flight.latitude, longitude: flight.longitude }
          ) < NEARBY_RADIUS_KM * 1000
        );
        filteredFlights = [...filteredFlights, ...nearbyFlights];
      });

      setBalloons(balloonsRes);
      setFlights(filteredFlights);
      setAlerts(alertsRes);
  
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container 
      maxWidth={false}
      disableGutters
      style={{ 
        backgroundImage: `url('https://cdn.prod.website-files.com/66182072dc26a0d014409235/67941407cc5098072f9774a9_dedbc80981594de2a628d44836d21a7d_flight-map-jan-2025.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100vw",
        padding: "20px"
      }}
    >
      <Typography variant="h4" align="center" gutterBottom style={{ color: "white", fontWeight: "bold", marginBottom: "15px" }}>
        ✈️ Flight Safety Dashboard (Tracking Flights Near Balloons)
      </Typography>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Button variant="contained" color="primary" onClick={fetchData} style={{ marginRight: 10 }}>
          🔄 Refresh Data
        </Button>
      </div>

      {loading && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <CircularProgress />
          <Typography style={{ color: "white" }}>Loading Data...</Typography>
        </div>
      )}

      {!loading && (
        <Grid container spacing={3} style={{ width: "100vw", height: "85vh", padding: "10px" }}>
          <Grid item xs={12} md={8} style={{ height: "100%" }}>
            <Paper elevation={4} style={{ padding: 10, height: "100%", backgroundColor: "rgba(255, 255, 255, 0.85)" }}>
              <Typography variant="h6" align="center">🌍 Air Traffic Near Balloons</Typography>
              <MapContainer center={[20, 0]} zoom={3} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {balloons.map((balloon, index) => (
                  <Marker key={index} position={[balloon.latitude, balloon.longitude]} icon={balloonIcon}>
                    <Popup>
                      🎈 <strong>Balloon</strong> <br />
                      <strong>Altitude:</strong> {balloon.altitude} m
                    </Popup>
                  </Marker>
                ))}

                {flights.map((flight, index) => (
                  <Marker key={index} position={[flight.latitude, flight.longitude]} icon={airplaneIcon}>
                    <Popup>
                      <strong>Flight:</strong> {flight.callsign} <br />
                      <strong>Altitude:</strong> {flight.altitude} m
                      <br />
                      📍 <strong>Location:</strong> {flight.latitude}, {flight.longitude}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4} style={{ height: "100%", overflowY: "auto" }}>
            <Paper elevation={4} style={{ padding: 10, height: "100%", backgroundColor: "rgba(255, 255, 255, 0.85)" }}>
              <Typography variant="h6" align="center">🛫 Flights</Typography>
              <Grid container spacing={2}>
                {flights.map((flight, index) => (
                  <Grid item xs={12} key={index}>
                    <Card style={{ backgroundColor: "rgba(0, 0, 0, 0.85)", color: "white", transform: "scale(1)", transition: "0.3s" }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
                      <CardContent>
                        <Typography variant="h6" style={{ color: "#03A9F4", fontWeight: "bold" }}>
                          ✈️ {flight.callsign}
                        </Typography>
                        <Typography variant="body2">📍 <strong>Location:</strong> {flight.latitude}, {flight.longitude}</Typography>
                        <Typography variant="body2">🛫 <strong>Altitude:</strong> {flight.altitude} m</Typography>
                        {flight.risk && (
                          <Typography variant="body2" style={{ color: "red", fontWeight: "bold" }}>
                            ⚠️ <strong>Risk:</strong> {flight.risk}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard;
