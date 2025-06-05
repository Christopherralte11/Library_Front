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

interface UploadBookDialogProps {
  open: boolean;
  book: Record<string, any>;
  handleCloseDialog: () => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const UploadBookDialog: React.FC<UploadBookDialogProps> = ({
  open,
  book,
  handleCloseDialog,
  handleInputChange,
  handleSubmit,
}) => {
  const [errors, setErrors] = useState<Record<string, boolean>>({
    title_of_the_book: false,
    name_of_the_author: false,
    accession_no: false,
  });

  const handleValidationSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors = {
      title_of_the_book: !book.title_of_the_book?.trim(),
      name_of_the_author: !book.name_of_the_author?.trim(),
      accession_no: !book.accession_no?.trim(),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) return;

    handleSubmit(event);
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
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
          Upload New Book
        </Typography>
        <IconButton
          onClick={handleCloseDialog}
          sx={{ color: "grey", p: 0, mr: "10px" }}
        >
          <CloseIcon sx={{ width: "18px", height: "18px" }} />
        </IconButton>
      </Box>

      <DialogContent sx={{ paddingTop: 0 }}>
        <form onSubmit={handleValidationSubmit}>
          <Grid container spacing={2} sx={{ marginTop: "-5px" }}>
            {[
              {
                label: "Title of the Book",
                name: "title_of_the_book",
                required: true,
                xs: 12,
              },
              {
                label: "Author Name",
                name: "name_of_the_author",
                required: true,
                xs: 12,
              },
              {
                label: "Accession No",
                name: "accession_no",
                required: true,
                xs: 6,
              },
              { label: "Class No", name: "class_no", required: true, xs: 6 },
              { label: "Volume No", name: "volume_no", xs: 6 },
              { label: "Publisher", name: "publisher", required: true, xs: 6 },
              { label: "Year", name: "year", required: true, xs: 6 },
              { label: "Place", name: "place", xs: 6 },
              { label: "Price", name: "price", xs: 6 },
              { label: "ISBN/ISSN No.", name: "isbn_issn_no", xs: 6 },
              { label: "Language", name: "language", xs: 6 },
              { label: "Subject Heading", name: "subject_heading", xs: 6 },
              { label: "No. of Pages", name: "no_of_pages_contain", xs: 6 },
              { label: "Source", name: "source", xs: 6 },
            ].map((field, index) => (
              <Grid item xs={field.xs} key={index}>
                <TextField
                  label={field.label}
                  variant="outlined"
                  fullWidth
                  size="small"
                  name={field.name}
                  value={book[field.name] || ""}
                  onChange={handleInputChange}
                  required={field.required || false}
                  error={errors[field.name] || false}
                  helperText={
                    errors[field.name] ? `${field.label} is required` : ""
                  }
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
              color="primary"
              sx={{
                fontSize: "13px",
                borderRadius: "10px",
                textTransform: "none",
                marginRight: "-7px",
              }}
              size="small"
              variant="contained"
            >
              Upload Book
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadBookDialog;
