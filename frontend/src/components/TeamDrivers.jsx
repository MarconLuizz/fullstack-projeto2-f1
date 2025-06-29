import React, { useContext, useEffect, useState } from "react";
import { F1Context } from "../contexts/F1Context";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Stack,
  Button,
} from "@mui/material";

const TeamDrivers = () => {
  const { state, dispatch } = useContext(F1Context);
  const { season, constructors, drivers, error } = state;
  const [selectedConstructor, setSelectedConstructor] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!season) return;
    const loadConstructors = async () => {
      setLoading(true);
      try {
        const r = await fetch(
          `https://ergast.com/api/f1/${season}/constructors.json`
        );
        const data = await r.json();
        dispatch({
          type: "SET_CONSTRUCTORS",
          payload: data.MRData.ConstructorTable.Constructors,
        });
      } catch {
        dispatch({ type: "SET_ERROR", payload: "Erro ao buscar equipes." });
      } finally {
        setLoading(false);
      }
    };
    loadConstructors();
  }, [season, dispatch]);

  useEffect(() => {
    if (!selectedConstructor) return;
    const loadDrivers = async () => {
      setLoading(true);
      try {
        const r = await fetch(
          `https://ergast.com/api/f1/${season}/constructors/${selectedConstructor}/drivers.json`
        );
        const data = await r.json();
        dispatch({
          type: "SET_DRIVERS",
          payload: data.MRData.DriverTable.Drivers,
        });
      } catch {
        dispatch({ type: "SET_ERROR", payload: "Erro ao buscar pilotos." });
      } finally {
        setLoading(false);
      }
    };
    loadDrivers();
  }, [selectedConstructor, season, dispatch]);

  const handleClearTeam = () => {
    setSelectedConstructor("");
    dispatch({ type: "SET_DRIVERS", payload: [] });
  };

  if (!season)
    return <Typography>Selecione primeiro uma temporada.</Typography>;

  return (
    <Box sx={{ mt: 4 }}>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Typography variant="h6">
          Pilotos por Equipe — Temporada {season}
        </Typography>
        <Button variant="outlined" color="secondary" onClick={handleClearTeam}>
          Limpar Equipe
        </Button>
      </Stack>

      {loading && <CircularProgress />}

      {!loading && constructors.length > 0 && (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Equipe</InputLabel>
          <Select
            value={selectedConstructor}
            label="Equipe"
            onChange={(e) => setSelectedConstructor(e.target.value)}
          >
            {constructors.map((c) => (
              <MenuItem key={c.constructorId} value={c.constructorId}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {!loading && drivers.length > 0 && (
        <List>
          {drivers.map((d) => (
            <ListItem key={d.driverId}>
              <ListItemText
                primary={`${d.givenName} ${d.familyName}`}
                secondary={`Nacionalidade: ${d.nationality}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default TeamDrivers;
