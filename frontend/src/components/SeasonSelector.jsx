import React, { useContext, useState } from "react";
import { F1Context } from "../contexts/F1Context";
import { Button, TextField, Stack } from "@mui/material";

const SeasonSelector = () => {
  const { dispatch } = useContext(F1Context);
  const [inputYear, setInputYear] = useState("");
  const MIN_YEAR = 1950;
  const MAX_YEAR = new Date().getFullYear();

  const fetchRaces = async () => {
    if (!inputYear) {
      dispatch({
        type: "SET_ERROR",
        payload: `Informe o ano da temporada (entre ${MIN_YEAR} e ${MAX_YEAR}).`,
      });
      return;
    }

    const yearNum = Number(inputYear);
    if (yearNum < MIN_YEAR || yearNum > MAX_YEAR) {
      dispatch({
        type: "SET_ERROR",
        payload: `Ano inválido. As temporadas válidas vão de ${MIN_YEAR} até ${MAX_YEAR}.`,
      });
      return;
    }

    try {
      const response = await fetch(
        `https://ergast.com/api/f1/${inputYear}.json`
      );
      const data = await response.json();
      const races = data.MRData.RaceTable.Races;

      if (!races || races.length === 0) {
        dispatch({ type: "SET_RACES", payload: [] });
        dispatch({
          type: "SET_ERROR",
          payload: `Temporada não encontrada. As temporadas válidas vão de ${MIN_YEAR} até ${MAX_YEAR}.`,
        });
      } else {
        dispatch({ type: "SET_ERROR", payload: null });
        dispatch({ type: "SET_SEASON", payload: inputYear });
        dispatch({ type: "SET_RACES", payload: races });
      }
    } catch {
      dispatch({ type: "SET_RACES", payload: [] });
      dispatch({
        type: "SET_ERROR",
        payload:
          "Erro ao buscar os dados da temporada. Tente novamente mais tarde.",
      });
    }
  };

  const handleClear = () => {
    setInputYear("");
    dispatch({ type: "CLEAR_SELECTIONS" });
  };

  return (
    <Stack direction="row" spacing={2} mb={3}>
      <TextField
        label="Ano da Temporada"
        variant="outlined"
        type="number"
        fullWidth
        value={inputYear}
        onChange={(e) => setInputYear(e.target.value)}
      />
      <Button variant="contained" onClick={fetchRaces}>
        Buscar
      </Button>
      <Button variant="outlined" color="secondary" onClick={handleClear}>
        Limpar
      </Button>
    </Stack>
  );
};

export default SeasonSelector;
