import React, { useState, useEffect, useRef } from "react";
import { F1Provider } from "./contexts/F1Context";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Add as AddIcon,
  Search as SearchIcon,
  List as ListIcon,
} from "@mui/icons-material";
import SeasonSelector from "./components/SeasonSelector";
import SeasonForm from "./components/SeasonForm";
import SeasonList from "./components/SeasonList";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Dashboard from "./components/Dashboard";
import RaceList from "./components/RaceList";
import TeamDrivers from "./components/TeamDrivers";
import ErrorMessage from "./components/ErrorMessage";
import Login from "./components/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const [searchLoading, setSearchLoading] = useState(false);

  const seasonListRef = useRef();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (newToken) => {
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
  };

  const handleSeasonAdded = () => {
    if (seasonListRef.current && seasonListRef.current.fetchSeasons) {
      seasonListRef.current.fetchSeasons();
    }
  };

  const handleSearchResults = (results, params) => {
    setSearchResults(results);
    setSearchParams(params);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    if (newValue !== 2) {
      setSearchResults([]);
      setSearchParams({});
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const tabContent = [
    <Box key="dashboard">
      <Dashboard />
      <SeasonList ref={seasonListRef} />
    </Box>,

    <Box key="add">
      <SeasonForm onSeasonAdded={handleSeasonAdded} />
    </Box>,

    <Box key="search">
      <SearchBar onSearchResults={handleSearchResults} />
      <SearchResults
        results={searchResults}
        searchParams={searchParams}
        loading={searchLoading}
      />
    </Box>,

    <Box key="api">
      <SeasonSelector />
      <Box sx={{ mb: 4 }}>
        <RaceList />
      </Box>
      <TeamDrivers />
    </Box>,
  ];

  return (
    <F1Provider token={token}>
      {}
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🏎️ F1 HUB
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      {}
      <Paper square elevation={1}>
        <Container maxWidth="md">
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab
              icon={<DashboardIcon />}
              label="Dashboard"
              iconPosition="start"
            />
            <Tab icon={<AddIcon />} label="Adicionar" iconPosition="start" />
            <Tab icon={<SearchIcon />} label="Buscar" iconPosition="start" />
            <Tab icon={<ListIcon />} label="API F1" iconPosition="start" />
          </Tabs>
        </Container>
      </Paper>

      {}
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <ErrorMessage />
        </Box>

        {tabContent[currentTab]}
      </Container>
    </F1Provider>
  );
}

export default App;
