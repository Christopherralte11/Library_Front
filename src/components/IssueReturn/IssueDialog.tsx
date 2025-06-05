import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";

interface IssueDialogProps {
  open: boolean;
  issueData: any;
  bookDetails: any;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClose: () => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleEditOpen: () => void;
}

const IssueDialog: React.FC<IssueDialogProps> = ({
  open,
  issueData,
  bookDetails,
  handleInputChange,
  handleClose,
  handleSubmit,
  handleEditOpen,
}) => {
  const [errors, setErrors] = useState<Record<string, boolean>>({
    student_name: false,
    phone_no: false,
    parental: false,
  });

  useEffect(() => {
    if (open) {
      const today = dayjs().format("YYYY-MM-DD");
      const dueDate = dayjs(today).add(7, "day").format("YYYY-MM-DD");

      handleInputChange({ target: { name: "issued_on", value: today } } as any);
      handleInputChange({
        target: { name: "due_date", value: dueDate },
      } as any);
    }
  }, [open]);

  const handleValidationSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors = {
      student_name: !issueData.student_name?.trim(),
      phone_no: !issueData.phone_no?.trim(),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) return;

    handleSubmit(event);
  };

  const handleIssuedOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const issuedOn = e.target.value;
    const dueDate = dayjs(issuedOn).add(7, "day").format("YYYY-MM-DD");

    handleInputChange({
      target: { name: "issued_on", value: issuedOn },
    } as any);
    handleInputChange({ target: { name: "due_date", value: dueDate } } as any);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "15px",
          padding: "10px",
        },
      }}
    >
      {/* Header box styled like your example */}
      <Box
        sx={{
          backgroundColor: "#f5f5f5",
          borderRadius: "10px",
          padding: "10px",
          marginBottom: "-5px",
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
          Issue Book
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{ color: "grey", p: 0, mr: "10px" }}
          size="small"
          aria-label="close issue dialog"
        >
          <CloseIcon sx={{ width: "18px", height: "18px" }} />
        </IconButton>
      </Box>

      <DialogContent sx={{ paddingTop: "8px" }}>
        <form onSubmit={handleValidationSubmit}>
          <Grid container spacing={2} sx={{ marginTop: "-5px" }}>
            {[
              {
                label: "Student Name",
                name: "student_name",
                required: true,
                xs: 12,
              },
              {
                label: "Phone Number",
                name: "phone_no",
                required: true,
                xs: 6,
              },
              {
                label: "Parental Consent",
                name: "parental",
                xs: 6,
              },
              {
                label: "Title",
                name: "title_of_the_book",
                disabled: true,
                xs: 12,
              },
              {
                label: "Author",
                name: "name_of_the_author",
                disabled: true,
                xs: 6,
              },
              {
                label: "Accession No",
                name: "accession_no",
                disabled: true,
                xs: 6,
              },
            ].map((field, index) => (
              <Grid item xs={field.xs} key={index}>
                <TextField
                  label={field.label}
                  variant="outlined"
                  fullWidth
                  size="small"
                  name={field.name}
                  value={issueData[field.name] || ""}
                  onChange={handleInputChange}
                  required={field.required || false}
                  disabled={field.disabled || false}
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

            {/* Issued On & Due Date */}
            <Grid container item xs={12} spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Issued On"
                  name="issued_on"
                  type="date"
                  value={issueData.issued_on || ""}
                  onChange={handleIssuedOnChange}
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

              <Grid item xs={6}>
                <TextField
                  label="Due Date (DD/MM/YYYY)"
                  name="due_date"
                  value={
                    issueData.due_date
                      ? dayjs(issueData.due_date, "YYYY-MM-DD").format(
                          "DD/MM/YYYY"
                        )
                      : ""
                  }
                  fullWidth
                  size="small"
                  disabled
                  InputProps={{
                    style: {
                      fontSize: "13px",
                      borderRadius: "10px",
                      height: "30px",
                    },
                  }}
                  InputLabelProps={{
                    shrink: true,
                    style: { fontSize: "13px" },
                  }}
                />
              </Grid>
            </Grid>

            {/* Remarks */}
            <Grid item xs={12}>
              <TextField
                label="Remarks"
                name="remark"
                value={issueData.remark || ""}
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

          <DialogActions
            sx={{
              justifyContent: "flex-end",
              paddingRight: "8px",
              paddingTop: "12px",
            }}
          >
            <Button
              onClick={handleEditOpen}
              color="success"
              sx={{
                fontSize: "13px",
                borderRadius: "10px",
                textTransform: "none",
                marginRight: "5px",
              }}
              size="small"
              variant="outlined"
            >
              Edit
            </Button>

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
              variant="outlined"
            >
              Issue Book
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default IssueDialog;
