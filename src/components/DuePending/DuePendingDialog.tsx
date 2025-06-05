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

function DuePendingDialog({
  selectedIssue,
  setSelectedIssue,
  handleReturnBook,
  handleDeleteIssue,
}: DuePendingDialogProps) {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmReturnOpen, setConfirmReturnOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  if (!selectedIssue) return null;

  const renderRow = (label: string, value: any, isOverdue = false) => (
    <Grid container alignItems="center" sx={{ mb: 1 }}>
      <Grid item xs={5}>
        <Typography
          sx={{ fontWeight: "bold", textAlign: "left" }}
          variant="subtitle2"
        >
          {label}
        </Typography>
      </Grid>

      <Grid
        item
        xs={0.3}
        sx={{
          textAlign: "left",
          fontWeight: "bold",
          userSelect: "none",
          px: 0.5,
        }}
      >
        :
      </Grid>

      <Grid item xs={6}>
        <Typography
          sx={{
            textAlign: "left",
            color: isOverdue && value !== "No" ? "red" : "inherit",
          }}
          variant="subtitle2"
        >
          {value || "-"}
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
              {renderRow("Name", selectedIssue.student_name)}
              {renderRow("Phone", selectedIssue.phone_no)}
              {renderRow("Secondary Contact", selectedIssue.parental)}
              {renderRow("Remark", selectedIssue.remark)}
              {renderRow(
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
              {renderRow("Title", selectedIssue.title_of_the_book)}
              {renderRow("Author", selectedIssue.name_of_the_author)}
              {renderRow("Accession No.", selectedIssue.accession_no)}
              {renderRow(
                "Issued On",
                dayjs(selectedIssue.issued_on).format("DD-MM-YYYY")
              )}
              {renderRow(
                "Due Date",
                dayjs(selectedIssue.due_date).format("DD-MM-YYYY")
              )}
              {renderRow(
                "Overdue",
                selectedIssue.overdue === "No" ? "-" : selectedIssue.overdue,
                selectedIssue.overdue !== "No"
              )}
              {renderRow("Volume No.", selectedIssue.volume_no)}
              {renderRow("Year", selectedIssue.year)}
              {renderRow("Price", selectedIssue.price)}
              {renderRow("Language", selectedIssue.language)}
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
              minWidth: 100,
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
              minWidth: 100,
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

export default DuePendingDialog;
