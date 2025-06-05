import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  DialogContentText,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface DeleteConfirmationDialogProps {
  open: boolean;
  handleClose: () => void;
  handleDelete: () => void;
}

function DeleteConfirmationDialog({
  open,
  handleClose,
  handleDelete,
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        fontFamily: "Poppins, sans-serif",
        "& .MuiDialog-paper": {
          borderRadius: "15px",
          fontFamily: "Poppins, sans-serif",
        },
      }}
    >
      {/* Custom Header Box */}
      <Box
        sx={{
          backgroundColor: "#f5f5f5",
          borderRadius: "10px",
          padding: "10px",
          marginBottom: "15px",
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
          Confirm Deletion
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{ color: "grey", p: 0, mr: "10px" }}
        >
          <CloseIcon sx={{ width: "18px", height: "18px" }} />
        </IconButton>
      </Box>

      <DialogContent sx={{ fontFamily: "Poppins, sans-serif" }}>
        <DialogContentText sx={{ fontFamily: "Poppins, sans-serif" }}>
          Are you sure you want to delete this item? This action cannot be
          undone.
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ fontFamily: "Poppins, sans-serif", px: 3, pb: 2 }}>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          sx={{
            textTransform: "none",
            fontFamily: "Poppins, sans-serif",
            fontSize: "12px",
            borderRadius: "10px",
          }}
          size="small"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteConfirmationDialog;
