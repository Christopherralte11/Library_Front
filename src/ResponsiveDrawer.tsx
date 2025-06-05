import * as React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./context/AuthContext"; // Adjust path if needed
import { api } from "./api/api"; // Adjust path if needed
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import KeyIcon from "@mui/icons-material/VpnKey";
import LogoutIcon from "@mui/icons-material/Logout";

interface ResponsiveDrawerProps {
  children: React.ReactNode;
}

function ResponsiveDrawer({ children }: ResponsiveDrawerProps) {
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [username, setUsername] = useState<string>("");
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOutClick = () => {
    setAnchorEl(null);
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setLogoutDialogOpen(false);
    try {
      await logout();
      localStorage.removeItem("authToken");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleLogoutCancel = () => setLogoutDialogOpen(false);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      setChangingPassword(true);
      const res = await axios.post(
        `${api}/admin/change-password`,
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data?.Status) {
        setPasswordDialogOpen(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordError("");
        alert("Password changed successfully");
      } else {
        setPasswordError(res.data?.Error || "Something went wrong");
      }
    } catch (err: any) {
      setPasswordError(err.response?.data?.Error || "Error changing password");
    } finally {
      setChangingPassword(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${api}/admin/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.username) {
          setUsername(response.data.username);
        } else if (response.data.User?.username) {
          setUsername(response.data.User.username);
        } else {
          setUsername("Unknown");
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setUsername("Error");
      }
    };

    if (token) fetchProfile();
  }, [token]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
      }}
    >
      <CssBaseline />
      <AppBar position="fixed" sx={{ bgcolor: "#333333", boxShadow: "none" }}>
        <Toolbar sx={{ px: 0, minHeight: "64px" }}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderLeft: "16px solid #333333",
              borderRight: "16px solid #333333",
              boxSizing: "border-box",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", pl: 0 }}>
              <Typography
                variant="h6"
                noWrap
                sx={{ fontFamily: "Poppins, sans-serif", color: "white" }}
              >
                Hereus Library
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", pr: 2, gap: 2 }}>
              <Link
                to="/support"
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: "inherit",
                }}
              >
                <SupportAgentIcon
                  sx={{ color: "white", fontSize: 28, cursor: "pointer" }}
                />
              </Link>
              <IconButton
                size="large"
                onClick={handleMenuOpen}
                sx={{ color: "white" }}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                PaperProps={{
                  sx: {
                    borderRadius: "12px",
                    mt: 1,
                    minWidth: "280px",
                    backgroundColor: "#F6F8FC", // Dropdown background
                    boxShadow: 3,
                    p: 1,
                  },
                }}
              >
                {/* White box for username and password change */}
                <Box
                  sx={{
                    bgcolor: "white",
                    borderRadius: 2,
                    boxShadow: 1,
                    p: 2,
                    mb: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  {/* Username - bold and aligned left */}
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", textAlign: "left" }}
                  >
                    {username}
                  </Typography>

                  {/* Change Password button */}
                  <Button
                    onClick={() => {
                      handleMenuClose();
                      setPasswordDialogOpen(true);
                    }}
                    variant="contained"
                    fullWidth
                    startIcon={<KeyIcon />} // optional: use icon
                    sx={{
                      backgroundColor: "#2f55d4",
                      color: "white",
                      textTransform: "none",
                      fontWeight: "bold",
                      borderRadius: "10px",
                      "&:hover": { backgroundColor: "#223cc7" },
                    }}
                  >
                    Change Password
                  </Button>
                </Box>

                {/* Sign Out button inside dropdown, outside white box */}
                <Button
                  onClick={handleSignOutClick}
                  fullWidth
                  startIcon={<LogoutIcon />}
                  sx={{
                    color: "#d32f2f",
                    fontWeight: "bold",
                    textTransform: "none",
                    borderRadius: "10px",
                    justifyContent: "center",
                    "&:hover": {
                      backgroundColor: "#fce4e4",
                    },
                  }}
                >
                  Sign Out
                </Button>
              </Menu>

              <Link
                to="https://hereus.in/"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Box
                  component="img"
                  src="/poweredbywhite.png"
                  alt="Dashboard"
                  sx={{
                    height: "60px",
                    width: "80px",
                    cursor: "pointer",
                    borderRadius: "4px",
                    objectFit: "contain",
                  }}
                />
              </Link>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 3,
          px: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            width: "100%",
            borderLeft: "16px solid #333333",
            borderRight: "16px solid #333333",
            boxSizing: "border-box",
            px: 2,
            minHeight: "100%",
          }}
        >
          {children}
        </Box>
      </Box>

      {/* Logout Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        PaperProps={{ sx: { borderRadius: "10px", minWidth: "300px" } }}
      >
        <Box
          sx={{
            backgroundColor: "#f5f5f5",
            borderRadius: "10px",
            padding: "10px",
            width: "calc(100% - 20px)",
            margin: "10px auto 0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "40px",
            position: "relative",
          }}
        >
          <Typography sx={{ fontWeight: "bold", ml: "10px", fontSize: "16px" }}>
            Confirm Sign Out
          </Typography>
          <IconButton
            onClick={handleLogoutCancel}
            size="small"
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon sx={{ width: "18px", marginTop: "-5px" }} />
          </IconButton>
        </Box>

        <DialogContent>
          <Typography sx={{ fontSize: "16px" }}>
            Are you sure you want to sign out?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "#D32F2F",
              borderRadius: "10px",
              "&:hover": { backgroundColor: "#B71C1C" },
              textTransform: "none",
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Password Change Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: "10px", minWidth: "350px" } }}
      >
        {/* Custom header */}
        <Box
          sx={{
            backgroundColor: "#f5f5f5",
            borderRadius: "10px",
            padding: "10px",
            marginBottom: "-20px",
            marginX: "auto",
            width: "calc(100% - 20px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "40px",
            position: "relative",
          }}
        >
          <Typography sx={{ fontWeight: "bold", ml: "10px", fontSize: "16px" }}>
            Change Password
          </Typography>
          <IconButton
            onClick={() => setPasswordDialogOpen(false)}
            size="small"
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon sx={{ width: "18px", marginTop: "-5px" }} />
          </IconButton>
        </Box>

        <DialogContent>
          <TextField
            label="Current Password"
            type="password"
            fullWidth
            margin="dense"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                height: "30px",
                fontSize: "13px",
              },
              "& .MuiInputLabel-root": {
                fontSize: "13px",
              },
            }}
            InputLabelProps={{ style: { fontSize: "13px", marginTop: "-3px" } }}
          />

          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="dense"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                height: "30px",
                fontSize: "13px",
              },
              "& .MuiInputLabel-root": {
                fontSize: "13px",
              },
            }}
            InputLabelProps={{ style: { fontSize: "13px", marginTop: "-3px" } }}
          />

          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            margin="dense"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                height: "30px",
                fontSize: "13px",
              },
              "& .MuiInputLabel-root": {
                fontSize: "13px",
              },
            }}
            InputLabelProps={{ style: { fontSize: "13px", marginTop: "-3px" } }}
          />

          {passwordError && (
            <Typography color="error" sx={{ mt: 1, fontSize: "13px" }}>
              {passwordError}
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handlePasswordChange}
            disabled={changingPassword}
            variant="contained"
            size="small"
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              fontSize: "13px",
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            {changingPassword ? <CircularProgress size={20} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ResponsiveDrawer;
