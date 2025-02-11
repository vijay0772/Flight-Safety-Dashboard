import React from "react";
import { Container, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Info = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" style={{
      marginTop: 20,
      padding: "20px",
      backgroundImage: "url('https://source.unsplash.com/1600x900/?aviation,flight')",
      backgroundSize: "cover",
      borderRadius: "10px",
      color: "white"
    }}>
      <Typography variant="h4" align="center" gutterBottom>
        📖 About Flight Safety Dashboard
      </Typography>
      <Typography variant="body1" paragraph>
        The Flight Safety Dashboard tracks live flights, monitors weather balloons, and assesses airspace risks...
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/")}>
        🔙 Back to Dashboard
      </Button>
    </Container>
  );
};

export default Info;
