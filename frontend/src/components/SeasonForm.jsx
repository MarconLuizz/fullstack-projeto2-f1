import React, { useState, useContext } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Grid,
  Snackbar,
  Fade,
  CircularProgress,
} from "@mui/material";
import { F1Context } from "../contexts/F1Context";

const SeasonForm = ({ onSeasonAdded }) => {
  const { token } = useContext(F1Context);
  const [formData, setFormData] = useState({
    year: "",
    champion: "",
    team: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/seasons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Temporada adicionada com sucesso!");
        setFormData({ year: "", champion: "", team: "" });
        setShowSuccess(true);

        // Callback: atualizar a lista de temporadas
        if (onSeasonAdded) {
          onSeasonAdded();
        }
        setTimeout(() => {
          setMessage("");
        }, 3000);
      } else {
        setError(data.msg || "Erro ao adicionar temporada");
      }
    } catch (err) {
      setError("Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setShowSuccess(false);
  };

  return (
    <>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Adicionar Nova Temporada
          </Typography>

          {message && (
            <Fade in={!!message}>
              <Alert severity="success" sx={{ mb: 2 }}>
                {message}
              </Alert>
            </Fade>
          )}

          {error && (
            <Fade in={!!error}>
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            </Fade>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Ano"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  inputProps={{ min: 1950, max: 2030 }}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Campeão"
                  name="champion"
                  value={formData.champion}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Equipe"
                  name="team"
                  value={formData.team}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ mt: 2 }}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Adicionando..." : "Adicionar Temporada"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Temporada adicionada com sucesso!
        </Alert>
      </Snackbar>
    </>
  );
};

export default SeasonForm;
