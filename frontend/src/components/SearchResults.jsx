import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Alert,
  Fade,
  Avatar,
  Divider,
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  Group as TeamIcon,
  CalendarToday as CalendarIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

const SearchResults = ({ results, searchParams, loading }) => {
  const getTeamColor = (teamName) => {
    const teamColors = {
      "Red Bull Racing": "#0600EF",
      Mercedes: "#00D2BE",
      Ferrari: "#DC143C",
      McLaren: "#FF8700",
      Alpine: "#0090FF",
      "Aston Martin": "#006F62",
      Williams: "#005AFF",
      AlphaTauri: "#2B4562",
      "Alfa Romeo": "#900000",
      Haas: "#FFFFFF",
    };
    return teamColors[teamName] || "#1976d2";
  };

  const getDriverInitials = (driverName) => {
    return driverName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase();
  };

  const getSearchSummary = () => {
    const activeFilters = [];
    if (searchParams.year) activeFilters.push(`Ano: ${searchParams.year}`);
    if (searchParams.champion)
      activeFilters.push(`Campeão: ${searchParams.champion}`);
    if (searchParams.team) activeFilters.push(`Equipe: ${searchParams.team}`);

    return activeFilters.length > 0
      ? activeFilters.join(" • ")
      : "Todos os filtros";
  };

  if (loading) {
    return (
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Buscando...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!results || results.length === 0) {
    const hasSearchParams = Object.values(searchParams).some(
      (value) => value && value !== "all"
    );

    if (!hasSearchParams) {
      return null;
    }

    return (
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <SearchIcon color="action" sx={{ mr: 1 }} />
            <Typography variant="h6">Resultados da Busca</Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" mb={2}>
            Filtros aplicados: {getSearchSummary()}
          </Typography>

          <Alert severity="info">
            Nenhuma temporada encontrada com os filtros aplicados.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box display="flex" alignItems="center">
            <SearchIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">
              Resultados da Busca ({results.length})
            </Typography>
          </Box>
          <Chip
            label={`${results.length} resultado${
              results.length !== 1 ? "s" : ""
            }`}
            color="primary"
            size="small"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Filtros aplicados: {getSearchSummary()}
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          {results.map((season, index) => (
            <Grid item xs={12} sm={6} md={4} key={season._id}>
              <Fade in={true} timeout={300 + index * 100}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 3,
                    },
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <CalendarIcon color="primary" sx={{ mr: 1 }} />
                      <Typography
                        variant="h5"
                        component="div"
                        fontWeight="bold"
                      >
                        {season.year}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar
                        sx={{
                          bgcolor: "#FFD700",
                          color: "#000",
                          width: 32,
                          height: 32,
                          mr: 1,
                          fontSize: "0.875rem",
                        }}
                      >
                        {getDriverInitials(season.champion)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Campeão
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {season.champion}
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="center">
                      <TeamIcon
                        sx={{ mr: 1, color: getTeamColor(season.team) }}
                      />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Equipe
                        </Typography>
                        <Chip
                          label={season.team}
                          size="small"
                          sx={{
                            bgcolor: getTeamColor(season.team),
                            color: season.team === "Haas" ? "#000" : "#fff",
                            fontWeight: "medium",
                          }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SearchResults;
