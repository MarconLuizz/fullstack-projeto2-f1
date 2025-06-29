import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Chip,
  LinearProgress,
  Divider,
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  Group as TeamIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingIcon,
} from "@mui/icons-material";
import { F1Context } from "../contexts/F1Context";

const Dashboard = () => {
  const { token } = useContext(F1Context);
  const [stats, setStats] = useState({
    totalSeasons: 0,
    championStats: [],
    teamStats: [],
    yearRange: { min: null, max: null },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [token]);

  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/seasons", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const seasons = await response.json();
        calculateStats(seasons);
      }
    } catch (err) {
      console.error("Erro ao buscar estatísticas:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (seasons) => {
    if (seasons.length === 0) {
      setStats({
        totalSeasons: 0,
        championStats: [],
        teamStats: [],
        yearRange: { min: null, max: null },
      });
      return;
    }

    // Estatísticas de campeões
    const championCount = {};
    seasons.forEach((season) => {
      championCount[season.champion] =
        (championCount[season.champion] || 0) + 1;
    });

    const championStats = Object.entries(championCount)
      .map(([champion, count]) => ({ champion, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5

    // Estatísticas de equipes
    const teamCount = {};
    seasons.forEach((season) => {
      teamCount[season.team] = (teamCount[season.team] || 0) + 1;
    });

    const teamStats = Object.entries(teamCount)
      .map(([team, count]) => ({ team, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Range de anos
    const years = seasons.map((s) => parseInt(s.year));
    const yearRange = {
      min: Math.min(...years),
      max: Math.max(...years),
    };

    setStats({
      totalSeasons: seasons.length,
      championStats,
      teamStats,
      yearRange,
    });
  };

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
            Carregando estatísticas...
          </Typography>
          <LinearProgress />
        </CardContent>
      </Card>
    );
  }

  if (stats.totalSeasons === 0) {
    return (
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📊 Estatísticas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Adicione algumas temporadas para ver as estatísticas aqui.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          📊 Estatísticas do Sistema
        </Typography>

        {/* Estatísticas gerais */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <CalendarIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.totalSeasons}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Temporadas
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <TrendingIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.yearRange.max - stats.yearRange.min + 1}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Anos Cobertos
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <TrophyIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.championStats.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Campeões Únicos
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <TeamIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.teamStats.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Equipes Únicas
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {/* Top Campeões */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              🏆 Top Campeões
            </Typography>
            {stats.championStats.map((stat, index) => (
              <Box
                key={stat.champion}
                display="flex"
                alignItems="center"
                mb={2}
              >
                <Avatar
                  sx={{
                    bgcolor:
                      index === 0
                        ? "#FFD700"
                        : index === 1
                        ? "#C0C0C0"
                        : index === 2
                        ? "#CD7F32"
                        : "#1976d2",
                    color: "#000",
                    width: 32,
                    height: 32,
                    mr: 2,
                    fontSize: "0.875rem",
                  }}
                >
                  {getDriverInitials(stat.champion)}
                </Avatar>
                <Box flexGrow={1}>
                  <Typography variant="body1" fontWeight="medium">
                    {stat.champion}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(stat.count / stats.totalSeasons) * 100}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
                <Chip
                  label={`${stat.count} título${stat.count > 1 ? "s" : ""}`}
                  size="small"
                  color="primary"
                  sx={{ ml: 2 }}
                />
              </Box>
            ))}
          </Grid>

          {/* Top Equipes */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              🏁 Top Equipes
            </Typography>
            {stats.teamStats.map((stat, index) => (
              <Box key={stat.team} display="flex" alignItems="center" mb={2}>
                <Avatar
                  sx={{
                    bgcolor: getTeamColor(stat.team),
                    color: stat.team === "Haas" ? "#000" : "#fff",
                    width: 32,
                    height: 32,
                    mr: 2,
                    fontSize: "0.75rem",
                  }}
                >
                  {stat.team.substring(0, 2).toUpperCase()}
                </Avatar>
                <Box flexGrow={1}>
                  <Typography variant="body1" fontWeight="medium">
                    {stat.team}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(stat.count / stats.totalSeasons) * 100}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: getTeamColor(stat.team),
                      },
                    }}
                  />
                </Box>
                <Chip
                  label={`${stat.count} título${stat.count > 1 ? "s" : ""}`}
                  size="small"
                  sx={{
                    ml: 2,
                    bgcolor: getTeamColor(stat.team),
                    color: stat.team === "Haas" ? "#000" : "#fff",
                  }}
                />
              </Box>
            ))}
          </Grid>
        </Grid>

        {stats.yearRange.min && stats.yearRange.max && (
          <Box mt={3} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Período coberto: {stats.yearRange.min} - {stats.yearRange.max}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default Dashboard;
