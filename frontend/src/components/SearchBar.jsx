import React, { useState, useContext } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Autocomplete,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { F1Context } from "../contexts/F1Context";

const SearchBar = ({ onSearchResults }) => {
  const { token } = useContext(F1Context);
  const [searchParams, setSearchParams] = useState({
    year: "",
    champion: "",
    team: "",
    searchType: "all",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const knownTeams = [
    "Red Bull Racing",
    "Mercedes",
    "Ferrari",
    "McLaren",
    "Alpine",
    "Aston Martin",
    "Williams",
    "AlphaTauri",
    "Alfa Romeo",
    "Haas",
    "Lotus",
    "Force India",
    "Sauber",
    "Renault",
    "Toro Rosso",
    "Manor",
    "Caterham",
    "Marussia",
  ];

  const knownChampions = [
    "Max Verstappen",
    "Lewis Hamilton",
    "Nico Rosberg",
    "Sebastian Vettel",
    "Jenson Button",
    "Fernando Alonso",
    "Kimi Räikkönen",
    "Felipe Massa",
    "Michael Schumacher",
    "Mika Häkkinen",
    "Jacques Villeneuve",
    "Damon Hill",
    "Ayrton Senna",
    "Alain Prost",
    "Nelson Piquet",
    "Nigel Mansell",
  ];

  const handleInputChange = (field, value) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = async () => {
    setLoading(true);
    setError("");

    try {

      const queryParams = new URLSearchParams();

      if (searchParams.year) queryParams.append("year", searchParams.year);
      if (searchParams.champion)
        queryParams.append("champion", searchParams.champion);
      if (searchParams.team) queryParams.append("team", searchParams.team);

      const response = await fetch(
        `http://localhost:5000/api/seasons?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const results = await response.json();
        onSearchResults(results, searchParams);
      } else {
        setError("Erro ao realizar busca");
      }
    } catch (err) {
      setError("Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchParams({
      year: "",
      champion: "",
      team: "",
      searchType: "all",
    });
    onSearchResults([], {});
    setError("");
  };

  const getActiveFiltersCount = () => {
    return Object.values(searchParams).filter(
      (value) => value && value !== "all"
    ).length;
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="h6">Buscar Temporadas</Typography>
          <Box display="flex" alignItems="center" gap={1}>
            {getActiveFiltersCount() > 0 && (
              <Chip
                label={`${getActiveFiltersCount()} filtro(s)`}
                size="small"
                color="primary"
              />
            )}
            <Tooltip title={showAdvanced ? "Busca simples" : "Busca avançada"}>
              <IconButton
                onClick={() => setShowAdvanced(!showAdvanced)}
                color={showAdvanced ? "primary" : "default"}
              >
                <FilterIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          {}
          <Grid item xs={12} sm={showAdvanced ? 3 : 6}>
            <TextField
              fullWidth
              label="Ano"
              type="number"
              value={searchParams.year}
              onChange={(e) => handleInputChange("year", e.target.value)}
              inputProps={{ min: 1950, max: 2030 }}
              disabled={loading}
            />
          </Grid>

          {showAdvanced && (
            <>
              {}
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  freeSolo
                  options={knownChampions}
                  value={searchParams.champion}
                  onChange={(event, newValue) =>
                    handleInputChange("champion", newValue || "")
                  }
                  onInputChange={(event, newInputValue) =>
                    handleInputChange("champion", newInputValue)
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Campeão" disabled={loading} />
                  )}
                />
              </Grid>

              {}
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  freeSolo
                  options={knownTeams}
                  value={searchParams.team}
                  onChange={(event, newValue) =>
                    handleInputChange("team", newValue || "")
                  }
                  onInputChange={(event, newInputValue) =>
                    handleInputChange("team", newInputValue)
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Equipe" disabled={loading} />
                  )}
                />
              </Grid>
            </>
          )}

          {}
          <Grid item xs={12} sm={showAdvanced ? 1 : 6}>
            <Box display="flex" gap={1} height="100%">
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={loading}
                startIcon={<SearchIcon />}
                sx={{ minWidth: "auto" }}
              >
                {showAdvanced ? "" : "Buscar"}
              </Button>
              <Button
                variant="outlined"
                onClick={handleClear}
                disabled={loading}
                startIcon={<ClearIcon />}
                sx={{ minWidth: "auto" }}
              >
                {showAdvanced ? "" : "Limpar"}
              </Button>
            </Box>
          </Grid>
        </Grid>

        {showAdvanced && (
          <Box mt={2} display="flex" gap={1}>
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loading}
              startIcon={<SearchIcon />}
            >
              {loading ? "Buscando..." : "Buscar"}
            </Button>
            <Button
              variant="outlined"
              onClick={handleClear}
              disabled={loading}
              startIcon={<ClearIcon />}
            >
              Limpar Filtros
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchBar;
