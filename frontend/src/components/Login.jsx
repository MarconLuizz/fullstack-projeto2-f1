import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const styles = {
  background: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #000000, #bf0a30)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    border: "1px solid #ffffff22",
    boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
  },
  heading: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 2,
  },
  input: {
    input: { color: "#fff" },
    label: { color: "#ccc" },
    "& .MuiFilledInput-root": {
      backgroundColor: "#2a2a2a",
      color: "#fff",
    },
  },
};

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        onLogin(data.token);
      } else {
        setError(data.msg || "Erro ao fazer login");
      }
    } catch {
      setError("Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={styles.background}>
      <Container maxWidth="xs">
        <Card sx={styles.card}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" sx={styles.heading}>
              🏎️ F1 HUB
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                variant="filled"
                fullWidth
                label="Usuário"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                required
                sx={{ ...styles.input, mb: 2 }}
              />

              <TextField
                variant="filled"
                fullWidth
                label="Senha"
                name="password"
                type={showPwd ? "text" : "password"}
                value={credentials.password}
                onChange={handleChange}
                required
                sx={{ ...styles.input, mb: 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPwd((prev) => !prev)}
                        edge="end"
                        sx={{ color: "#fff" }}
                      >
                        {showPwd ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ fontWeight: "bold" }}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
