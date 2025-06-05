import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import generateUniqueId from "generate-unique-id";
import axios from "axios";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { api } from "../../api/api";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  fetchUsers: () => void;
}

const AddAdminDialog: React.FC<Props> = ({ open, setOpen, fetchUsers }) => {
  const [user, setUser] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const { token } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.username.trim() || !user.password.trim()) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(
        `${api}/admin/add_user`,
        {
          ...user,
          user_id: generateUniqueId(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.Status) {
        fetchUsers();
        toast.success("User added successfully!");
        setOpen(false);
        setUser({ username: "", password: "" });
        setError("");
      } else {
        setError(response.data.Error);
      }
    } catch {
      setError("Error adding user.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "15px",
          padding: "10px",
          fontFamily: "Poppins, sans-serif",
        },
      }}
    >
      {/* Custom Header */}
      <Box
        sx={{
          backgroundColor: "#f5f5f5",
          borderRadius: "10px",
          padding: "10px",
          marginBottom: 0, // Fix overlap issue
          marginX: "auto",
          width: "calc(100% - 20px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "40px",
          mt: 2,
        }}
      >
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "16px",
            fontFamily: "Poppins, sans-serif",
            ml: "10px",
          }}
        >
          Add Admin
        </Typography>
        <IconButton
          onClick={() => setOpen(false)}
          sx={{ color: "grey", p: 0, mr: "10px" }}
        >
          <CloseIcon sx={{ width: "18px", height: "18px" }} />
        </IconButton>
      </Box>

      <DialogContent sx={{ paddingTop: 2 }}>
        {error && (
          <Typography color="error" fontSize="13px" sx={{ mb: 1 }}>
            {error}
          </Typography>
        )}
        <Box mt={1}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {[
                { label: "Username", name: "username" },
                {
                  label: "Password",
                  name: "password",
                  type: "password",
                  autoComplete: "new-password",
                },
              ].map((field, index) => (
                <Grid item xs={12} key={index}>
                  <TextField
                    label={field.label}
                    name={field.name}
                    type={field.type || "text"}
                    autoComplete={field.autoComplete || "off"}
                    value={user[field.name as keyof typeof user]}
                    onChange={handleChange}
                    required
                    fullWidth
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: "30px",
                        borderRadius: "10px",
                        fontSize: "13px",
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: "13px",
                        marginTop: "-3px",
                      },
                    }}
                  />
                </Grid>
              ))}
            </Grid>

            <DialogActions
              sx={{
                justifyContent: "flex-end",
                paddingRight: "8px",
                paddingTop: "12px",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="small"
                sx={{
                  fontSize: "13px",
                  borderRadius: "10px",
                  textTransform: "none",
                  marginRight: "-7px",
                }}
              >
                Add User
              </Button>
            </DialogActions>
          </form>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddAdminDialog;
