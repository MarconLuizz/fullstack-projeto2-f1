import React, { useContext } from "react";
import { F1Context } from "../contexts/F1Context";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const RaceDetails = ({ open, onClose }) => {
  const { state } = useContext(F1Context);
  const race = state.selectedRace;
  const results = state.raceResult;

  if (!race) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {race.raceName}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1">Data: {race.date}</Typography>
        <Typography variant="body1">
          Circuito: {race.Circuit.circuitName}
        </Typography>
        <Typography variant="body2">
          Localização: {race.Circuit.Location.locality},{" "}
          {race.Circuit.Location.country}
        </Typography>

        {results && results.length > 0 && (
          <Box mt={3}>
            <Typography variant="h6">🏁 Classificação Completa</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Nome do Piloto</TableCell>
                    <TableCell>Equipe</TableCell>
                    <TableCell>Tempo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell>{result.position}</TableCell>
                      <TableCell>
                        {result.Driver.givenName} {result.Driver.familyName}
                      </TableCell>
                      <TableCell>{result.Constructor.name}</TableCell>
                      <TableCell>{result.Time?.time || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RaceDetails;
