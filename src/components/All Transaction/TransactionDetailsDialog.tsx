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

interface TransactionDetailsDialogProps {
  open: boolean;
  handleClose: () => void;
  transaction: any;
  handleDeleteTransaction: (issue_id: string) => void;
}

function TransactionDetailsDialog({
  open,
  handleClose,
  transaction,
  handleDeleteTransaction,
}: TransactionDetailsDialogProps) {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  if (!transaction) return null;

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
          variant={smallText ? "caption" : "subtitle2"}
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
        open={open}
        onClose={handleClose}
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
          <IconButton onClick={handleClose} size="small">
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
              {formatRow("Name", transaction.student_name)}
              {formatRow("Phone", transaction.phone_no)}
              {formatRow("Parental", transaction.parental)}
              {formatRow("Remark", transaction.remark)}
              {formatRow(
                "Status",
                <Typography
                  variant="subtitle2"
                  sx={{
                    color:
                      transaction.status === "Pending"
                        ? "warning.main"
                        : transaction.status === "Returned"
                        ? "success.main"
                        : "inherit",
                  }}
                >
                  {transaction.status}
                </Typography>
              )}
            </>
          )}

          {tabIndex === 1 && (
            <>
              {formatRow("Title", transaction.title_of_the_book)}
              {formatRow("Author", transaction.name_of_the_author)}
              {formatRow("Accession No.", transaction.accession_no)}
              {formatRow(
                "Issued On",
                dayjs(transaction.issued_on).format("DD-MM-YYYY")
              )}
              {formatRow(
                "Due Date",
                dayjs(transaction.due_date).format("DD-MM-YYYY")
              )}
              {formatRow(
                "Overdue",
                transaction.overdue === "No" ? "-" : transaction.overdue,
                transaction.overdue !== "No"
              )}
              {formatRow("Volume No.", transaction.volume_no)}
              {formatRow("Year", transaction.year)}
              {formatRow("Price", transaction.price)}
              {formatRow("Language", transaction.language)}
            </>
          )}
        </DialogContent>

        <DialogActions>
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
            Are you sure you want to delete this transaction? This action cannot
            be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 3 }}>
          <Button
            onClick={() => {
              handleDeleteTransaction(transaction.issue_id);
              setConfirmDeleteOpen(false);
              handleClose();
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
    </>
  );
}

export default TransactionDetailsDialog;
