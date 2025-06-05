import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Grid,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Book {
  [key: string]: any;
}

interface BookEditDialogProps {
  open: boolean;
  selectedBook: Book | null;
  handleClose: () => void;
  handleEditChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditSubmit: () => void;
}

function BookEditDialog({
  open,
  selectedBook,
  handleClose,
  handleEditChange,
  handleEditSubmit,
}: BookEditDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "15px",
        },
      }}
    >
      {/* Title box with X button inside */}
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
          Edit Book
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{ color: "grey", p: 0, mr: "10px" }}
        >
          <CloseIcon sx={{ width: "18px", height: "18px" }} />
        </IconButton>
      </Box>

      {/* Content Fields */}
      <DialogContent>
        {selectedBook && (
          <Grid container spacing={1}>
            {[
              { name: "accession_no", label: "Accession No" },
              { name: "class_no", label: "Class No" },
              { name: "title_of_the_book", label: "Title of the Book" },
              { name: "name_of_the_author", label: "Name of the Author" },
              { name: "volume_no", label: "Volume No" },
              { name: "publisher", label: "Publisher" },
              { name: "year", label: "Year" },
              { name: "place", label: "Place" },
              { name: "price", label: "Price" },
              { name: "isbn_issn_no", label: "ISBN/ISSN No" },
              { name: "language", label: "Language" },
              { name: "subject_heading", label: "Subject Heading" },
              { name: "no_of_pages_contain", label: "No of Pages Contain" },
              { name: "source", label: "Source" },
            ].map((field) => (
              <Grid key={field.name} item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  name={field.name}
                  label={
                    <Typography
                      sx={{
                        fontSize: "12px",
                        marginLeft: "-1px",
                        marginTop: "-2px",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {field.label}
                    </Typography>
                  }
                  value={selectedBook[field.name] || ""}
                  onChange={handleEditChange}
                  margin="dense"
                  InputProps={{
                    style: {
                      borderRadius: "10px",
                      height: "30px",
                      fontSize: "15px",
                      fontFamily: "Poppins, sans-serif",
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>

      {/* Update Button */}
      <DialogActions>
        <Button
          onClick={handleEditSubmit}
          sx={{
            textTransform: "none",
            fontFamily: "Poppins, sans-serif",
            fontSize: "12px",
            borderRadius: "10px",
          }}
          size="small"
          variant="contained"
          color="success"
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default BookEditDialog;
