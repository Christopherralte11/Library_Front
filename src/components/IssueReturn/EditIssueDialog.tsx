import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Button,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface EditIssueDialogProps {
  open: boolean;
  issueData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClose: () => void;
  handleSave: () => void;
}

function EditIssueDialog({
  open,
  issueData,
  handleInputChange,
  handleClose,
  handleSave,
}: EditIssueDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiPaper-root": {
          borderRadius: "10px",
          padding: "10px",
          maxWidth: 600,
          width: "100%",
        },
      }}
    >
      {/* Custom header with flexbox */}
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
          Edit
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{ color: "grey", p: 0, mr: "10px" }}
          size="small"
          aria-label="close edit dialog"
        >
          <CloseIcon sx={{ width: "18px", height: "18px" }} />
        </IconButton>
      </Box>

      <DialogContent>
        <Grid container spacing={2}>
          {/* Student Name (Full Width) */}
          <Grid item xs={12}>
            <TextField
              label="Student Name"
              name="student_name"
              value={issueData.student_name}
              onChange={handleInputChange}
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  height: "30px",
                  fontSize: "13px",
                  marginTop: "16px",
                },
              }}
              InputLabelProps={{
                style: { fontSize: "13px", marginTop: "13px" },
              }}
            />
          </Grid>

          {/* Phone No. and Parental (Two Columns) */}
          <Grid item xs={6}>
            <TextField
              label="Phone No."
              name="phone_no"
              value={issueData.phone_no}
              onChange={handleInputChange}
              fullWidth
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
              InputLabelProps={{
                style: { fontSize: "13px", marginTop: "-3px" },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Parental"
              name="parental"
              value={issueData.parental}
              onChange={handleInputChange}
              fullWidth
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
              InputLabelProps={{
                style: { fontSize: "13px", marginTop: "-3px" },
              }}
            />
          </Grid>

          {/* Title (Full Width) */}
          <Grid item xs={12}>
            <TextField
              label="Title"
              name="title_of_the_book"
              value={issueData.title_of_the_book}
              onChange={handleInputChange}
              fullWidth
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
              InputLabelProps={{
                style: { fontSize: "13px", marginTop: "-3px" },
              }}
            />
          </Grid>

          {/* Author (Full Width) */}
          <Grid item xs={12}>
            <TextField
              label="Author"
              name="name_of_the_author"
              value={issueData.name_of_the_author}
              onChange={handleInputChange}
              fullWidth
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
              InputLabelProps={{
                style: { fontSize: "13px", marginTop: "-3px" },
              }}
            />
          </Grid>

          {/* Other Fields Two per Row */}
          {[
            { label: "Accession No.", name: "accession_no" },
            { label: "Volume No.", name: "volume_no" },
            { label: "Year", name: "year" },
            { label: "Place", name: "place" },
            { label: "Price", name: "price" },
            { label: "ISBN/ISSN No.", name: "isbn_issn_no" },
            { label: "Language", name: "language" },
            { label: "Subject Heading", name: "subject_heading" },
            { label: "No. of Pages", name: "no_of_pages_contain" },
            { label: "Source", name: "source" },
          ].map((field) => (
            <Grid item xs={6} key={field.name}>
              <TextField
                label={field.label}
                name={field.name}
                value={issueData[field.name]}
                onChange={handleInputChange}
                fullWidth
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
                InputLabelProps={{
                  style: { fontSize: "13px", marginTop: "-3px" },
                }}
              />
            </Grid>
          ))}

          {/* Issued On - Date Picker */}
          <Grid item xs={6}>
            <TextField
              label="Issued On"
              name="issued_on"
              type="date"
              value={issueData.issued_on}
              onChange={handleInputChange}
              fullWidth
              size="small"
              InputProps={{
                style: {
                  fontSize: "13px",
                  borderRadius: "10px",
                  height: "30px",
                },
              }}
              InputLabelProps={{
                style: { fontSize: "13px" },
                shrink: true,
              }}
            />
          </Grid>

          {/* Due Date - Date Picker */}
          <Grid item xs={6}>
            <TextField
              label="Due Date"
              name="due_date"
              type="date"
              value={issueData.due_date}
              onChange={handleInputChange}
              fullWidth
              size="small"
              InputProps={{
                style: {
                  fontSize: "13px",
                  borderRadius: "10px",
                  height: "30px",
                },
              }}
              InputLabelProps={{
                style: { fontSize: "13px" },
                shrink: true,
              }}
            />
          </Grid>

          {/* Remark (Full Width) */}
          <Grid item xs={12}>
            <TextField
              label="Remarks"
              name="remark"
              value={issueData.remark}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
              size="small"
              InputProps={{
                style: { fontSize: "13px", borderRadius: "10px" },
              }}
              InputLabelProps={{
                style: { fontSize: "13px", marginTop: "-3px" },
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleSave}
          variant="contained"
          color="success"
          size="small"
          sx={{ fontSize: "13px", borderRadius: "10px", textTransform: "none" }}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditIssueDialog;
