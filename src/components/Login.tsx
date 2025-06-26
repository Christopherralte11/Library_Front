import React, { useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Grid,
  FormControl,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import KeyIcon from "@mui/icons-material/Key";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/api";

interface LoginValues {
  username: string;
  password: string;
}

const AdminLogin: React.FC = () => {
  const [values, setValues] = useState<LoginValues>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      const result = await axios.post(`${api}/admin/adminlogin`, values);

      if (result.data.loginStatus) {
        const { token, role } = result.data;
        localStorage.setItem("authToken", token);

        // ✅ FIXED: Pass an object instead of two separate arguments
        await login({ role, token });

        console.log("Login successful, navigating to /dashboard");
        navigate("/dashboard", { replace: true });
      } else {
        console.error(result.data.Error);
        setError(result.data.Error || "Login failed");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("An error occurred during login.");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Container sx={{ maxWidth: "100%", width: "880px" }} />
      <Container
        style={{ marginTop: "150px", maxWidth: "100%", width: "420px" }}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <div
            style={{
              height: "60px",
              width: "360px",
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <Box sx={{ marginTop: "15px" }}>
              <a href="/">
                <img
                  src="/Hereus-Logo-2.0-blue-small.png"
                  style={{ width: "100%", maxWidth: "50px" }}
                  alt="Logo"
                />
              </a>
            </Box>
          </div>
          <form
            onSubmit={handleSubmit}
            style={{ width: "100%", marginTop: "80px" }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography sx={{ fontSize: "12px" }} gutterBottom>
                    Enter Login ID
                  </Typography>
                  <TextField
                    size="small"
                    required
                    type="text"
                    id="username"
                    placeholder="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ width: "17px" }} />
                        </InputAdornment>
                      ),
                      style: {
                        borderRadius: "10px",
                        height: "30px",
                        fontSize: "13px",
                      },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography sx={{ fontSize: "12px" }} gutterBottom>
                    Enter Password
                  </Typography>
                  <TextField
                    size="small"
                    required
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Password"
                    name="password"
                    autoComplete="current-password"
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <KeyIcon sx={{ width: "17px" }} />
                        </InputAdornment>
                      ),
                      style: {
                        borderRadius: "10px",
                        height: "30px",
                        fontSize: "13px",
                      },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                            onClick={() => setShowPassword(!showPassword)}
                            aria-pressed={showPassword}
                          >
                            {showPassword ? (
                              <Visibility sx={{ width: "17px" }} />
                            ) : (
                              <VisibilityOff sx={{ width: "17px" }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Button
              type="submit"
              size="small"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                mb: 3,
                textTransform: "none",
                borderRadius: "10px",
                fontSize: "12px",
                backgroundColor: "#333533",
                "&:hover": {
                  backgroundColor: "#333533",
                },
              }}
              endIcon={<KeyboardArrowRightIcon />}
            >
              Sign In
            </Button>
          </form>
          {error && (
            <Typography color="error" sx={{ fontSize: "12px", mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>
      </Container>
    </>
  );
};

export default AdminLogin;
