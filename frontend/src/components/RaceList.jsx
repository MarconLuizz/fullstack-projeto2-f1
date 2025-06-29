import React, { useContext, useState } from "react";
import { F1Context } from "../contexts/F1Context";
import {
  List,
  ListItem,
  Typography,
  Box,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import RaceDetails from "./RaceDetails";

const RaceList = () => {
  const { state, dispatch } = useContext(F1Context);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchRaceResult = async (season, round) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://ergast.com/api/f1/${season}/${round}/results.json`
      );
      const data = await response.json();
      const results = data.MRData.RaceTable.Races[0]?.Results;
      dispatch({ type: "SET_RACE_RESULT", payload: results || [] });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Erro ao buscar o resultado da corrida.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClickRace = async (race) => {
    dispatch({ type: "SELECT_RACE", payload: race });
    await fetchRaceResult(race.season, race.round);
    setOpenDialog(true);
  };

  if (!state.races.length) return null;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Corridas da Temporada {state.season}
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress />
        </Box>
      ) : (
        <List sx={{ bgcolor: "#f9f9f9", borderRadius: 2, p: 1 }}>
          {state.races.map((race, index) => (
            <React.Fragment key={race.round}>
              <ListItem
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="subtitle1">{race.raceName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {race.Circuit.circuitName} - {race.date}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleClickRace(race)}
                >
                  Ver Detalhes
                </Button>
              </ListItem>
              {index < state.races.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}

      <RaceDetails open={openDialog} onClose={() => setOpenDialog(false)} />
    </Box>
  );
};

export default RaceList;
