import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api/api";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  userId: string | null;
  fetchUsers: () => void;
}

const DeleteAdminDialog: React.FC<Props> = ({
  open,
  setOpen,
  userId,
  fetchUsers,
}) => {
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const handleDelete = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await axios.delete(
        `${api}/admin/delete_user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.Status) {
        toast.success("User deleted successfully!");
        fetchUsers();
        setOpen(false);
      } else {
        toast.error(response.data.Error);
      }
    } catch {
      toast.error("Error deleting user.");
    } finally {
      setLoading(false);
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
          marginBottom: "10px",
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
          Confirm Delete
        </Typography>
        <IconButton
          onClick={() => setOpen(false)}
          sx={{ color: "grey", p: 0, mr: "10px" }}
        >
          <CloseIcon sx={{ width: "18px", height: "18px" }} />
        </IconButton>
      </Box>

      <DialogContent sx={{ paddingTop: 0 }}>
        <Typography fontSize="14px" mb={2}>
          Are you sure you want to delete this user?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ paddingRight: "8px", paddingBottom: "8px" }}>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={loading}
          size="small"
          sx={{ textTransform: "none", fontSize: "13px", borderRadius: "10px" }}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAdminDialog;
