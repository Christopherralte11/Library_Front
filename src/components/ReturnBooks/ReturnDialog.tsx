import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  IconButton,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";

interface DuePendingDialogProps {
  selectedIssue: any | null;
  setSelectedIssue: (issue: any | null) => void;
  handleReturnBook: (issue_id: string) => void;
  handleDeleteIssue: (issue_id: string) => void;
}

function ReturnDialog({
  selectedIssue,
  setSelectedIssue,
  handleReturnBook,
  handleDeleteIssue,
}: DuePendingDialogProps) {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmReturnOpen, setConfirmReturnOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  if (!selectedIssue) return null;

  const formatRow = (
    label: string,
    value: any,
    isOverdue?: boolean,
    smallText?: boolean
  ) => (
    <Grid container alignItems="center" sx={{ mb: 1 }}>
      <Grid item xs={5}>
        <Typography
          sx={{ fontWeight: "bold", textAlign: "left" }}
          variant="subtitle2"
        >
          {label}
        </Typography>
      </Grid>
      <Grid item xs={0.3}>
        <Typography sx={{ textAlign: "left" }} variant="subtitle2">
          :
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography
          sx={{
            textAlign: "left",
            color: isOverdue ? "red" : "inherit",
          }}
          variant="subtitle2"
        >
          {value !== undefined && value !== null ? value : "-"}
        </Typography>
      </Grid>
    </Grid>
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <Dialog
        open={Boolean(selectedIssue)}
        onClose={() => setSelectedIssue(null)}
        maxWidth="sm"
        fullWidth
        sx={{ "& .MuiDialog-paper": { borderRadius: "10px" } }}
      >
        <Box
          sx={{
            backgroundColor: "#f5f5f5",
            padding: "8px 16px",
            m: 2,
            borderRadius: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography fontWeight="bold">Transaction Details</Typography>
          <IconButton onClick={() => setSelectedIssue(null)} size="small">
            <CloseIcon sx={{ fontSize: "18px" }} />
          </IconButton>
        </Box>

        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          centered
          sx={{
            width: "100%",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: "bold",
            },
          }}
        >
          <Tab label="Borrower Details" />
          <Tab label="Book Details" />
        </Tabs>

        <DialogContent sx={{ maxHeight: "60vh", overflowY: "auto" }}>
          {tabIndex === 0 && (
            <>
              {formatRow("Name", selectedIssue.student_name)}
              {formatRow("Phone", selectedIssue.phone_no)}
              {formatRow("Parental", selectedIssue.parental)}
              {formatRow("Remark", selectedIssue.remark)}
              {formatRow(
                "Status",
                <Typography
                  variant="subtitle2"
                  sx={{
                    color:
                      selectedIssue.status === "Pending"
                        ? "warning.main"
                        : "inherit",
                  }}
                >
                  {selectedIssue.status}
                </Typography>
              )}
            </>
          )}

          {tabIndex === 1 && (
            <>
              {formatRow("Title", selectedIssue.title_of_the_book)}
              {formatRow("Author", selectedIssue.name_of_the_author)}
              {formatRow("Accession No.", selectedIssue.accession_no)}
              {formatRow(
                "Issued On",
                dayjs(selectedIssue.issued_on).format("DD-MM-YYYY")
              )}
              {formatRow(
                "Due Date",
                dayjs(selectedIssue.due_date).format("DD-MM-YYYY")
              )}
              {formatRow(
                "Overdue",
                selectedIssue.overdue === "No" ? "-" : selectedIssue.overdue,
                selectedIssue.overdue !== "No"
              )}
              {formatRow("Volume No.", selectedIssue.volume_no)}
              {formatRow("Year", selectedIssue.year)}
              {formatRow("Price", selectedIssue.price)}
              {formatRow("Language", selectedIssue.language)}
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setConfirmReturnOpen(true)}
            color="primary"
            variant="contained"
            size="medium"
            sx={{
              borderRadius: "10px",
              fontSize: "13px",
              textTransform: "none",
            }}
          >
            Return Book
          </Button>
          <Button
            onClick={() => setConfirmDeleteOpen(true)}
            color="error"
            variant="contained"
            size="medium"
            sx={{
              borderRadius: "10px",
              fontSize: "13px",
              textTransform: "none",
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{ "& .MuiDialog-paper": { borderRadius: "10px" } }}
      >
        <Box
          sx={{
            backgroundColor: "#f5f5f5",
            padding: "8px 16px",
            m: 2,
            borderRadius: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography fontWeight="bold">Confirm Delete</Typography>
          <IconButton onClick={() => setConfirmDeleteOpen(false)} size="small">
            <CloseIcon sx={{ fontSize: "20px" }} />
          </IconButton>
        </Box>
        <DialogContent sx={{ px: 4, pt: 3 }}>
          <Typography>
            Are you sure you want to delete this issue? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 3 }}>
          <Button
            onClick={() => {
              handleDeleteIssue(selectedIssue.issue_id);
              setConfirmDeleteOpen(false);
              setSelectedIssue(null);
            }}
            color="error"
            variant="contained"
            sx={{
              borderRadius: "10px",
              fontSize: "13px",
              textTransform: "none",
              px: 3,
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Return */}
      <Dialog
        open={confirmReturnOpen}
        onClose={() => setConfirmReturnOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{ "& .MuiDialog-paper": { borderRadius: "10px" } }}
      >
        <Box
          sx={{
            backgroundColor: "#f5f5f5",
            padding: "8px 16px",
            m: 2,
            borderRadius: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography fontWeight="bold">Confirm Return</Typography>
          <IconButton onClick={() => setConfirmReturnOpen(false)} size="small">
            <CloseIcon sx={{ fontSize: "20px" }} />
          </IconButton>
        </Box>
        <DialogContent sx={{ px: 4, pt: 3 }}>
          <Typography>
            Are you sure you want to return this book? Please confirm your
            action.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 3 }}>
          <Button
            onClick={() => {
              handleReturnBook(selectedIssue.issue_id);
              setConfirmReturnOpen(false);
              setSelectedIssue(null);
            }}
            color="primary"
            variant="contained"
            sx={{
              borderRadius: "10px",
              fontSize: "13px",
              textTransform: "none",
              px: 3,
            }}
          >
            Return
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ReturnDialog;
