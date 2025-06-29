import React, {
  useState,
  useEffect,
  useContext,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Skeleton,
  Fade,
  Avatar,
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  Group as TeamIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { F1Context } from "../contexts/F1Context";

const SeasonList = forwardRef((props, ref) => {
  const { token } = useContext(F1Context);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSeasons = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/seasons", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSeasons(data.sort((a, b) => b.year - a.year)); // Ordenar por ano decrescente
      } else {
        setError("Erro ao carregar temporadas");
      }
    } catch (err) {
      setError("Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchSeasons,
  }));

  useEffect(() => {
    fetchSeasons();
  }, [token]);

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

  if (loading) {
    return (
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Temporadas Cadastradas
          </Typography>
          <Grid container spacing={2}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Skeleton variant="rectangular" height={120} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">
            Temporadas Cadastradas ({seasons.length})
          </Typography>
          <Tooltip title="Atualizar lista">
            <IconButton onClick={fetchSeasons} size="small">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {seasons.length === 0 ? (
          <Alert severity="info">
            Nenhuma temporada cadastrada ainda. Adicione uma temporada usando o
            formulário acima.
          </Alert>
        ) : (
          <Grid container spacing={2}>
            {seasons.map((season, index) => (
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
        )}
      </CardContent>
    </Card>
  );
});

SeasonList.displayName = "SeasonList";

export default SeasonList;
