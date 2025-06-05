import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import dayjs from "dayjs"; // Make sure you have dayjs imported for date handling
import { api } from "../../api/api";
import { useAuth } from "../../context/AuthContext"; // adjust path accordingly

interface Book {
  [key: string]: any;
}

interface Transaction {
  student_name: string;
  issued_on: string;
}

interface BookDetailsDialogProps {
  open: boolean;
  selectedBook: Book | null;
  handleClose: () => void;
  handleEditClick: () => void;
  handleDeleteOpen: () => void;
}

function BookDetailsDialog({
  open,
  selectedBook,
  handleClose,
  handleEditClick,
  handleDeleteOpen,
}: BookDetailsDialogProps) {
  const [isTransactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useAuth(); // get token from context

  const handleTransactionOpen = async () => {
    if (!selectedBook?.accession_no) return;
    setTransactionDialogOpen(true);
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${api}/issues/returned_issues/${selectedBook.accession_no}`,
        {
          timeout: 10000,
          headers: {
            Authorization: `Bearer ${token}`, // attach token here
          },
        }
      );

      if (response.data.Status && response.data.ReturnedIssues.length > 0) {
        setTransactions(response.data.ReturnedIssues);
      } else {
        setTransactions([]);
        setError("No returned transactions found.");
      }
    } catch (err: any) {
      if (err.code === "ECONNABORTED") {
        setError("Request timed out. Please try again.");
      } else {
        setError(
          err?.response?.data?.Error || "Failed to fetch returned transactions"
        );
      }
    } finally {
      setLoading(false);
    }
  };
  const handleTransactionClose = () => {
    setTransactionDialogOpen(false);
    setTransactions([]);
    setError("");
  };

  const getDueDate = (issuedOn: string) => {
    return dayjs(issuedOn).add(7, "days").format("YYYY-MM-DD");
  };

  return (
    <>
      {/* Book Details Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        sx={{
          fontFamily: "Poppins, sans-serif",
          "& .MuiDialog-paper": {
            borderRadius: "15px",
            padding: "20px",
            minHeight: "500px",
          },
        }}
      >
        <Box
          sx={{
            backgroundColor: "#f5f5f5",
            borderRadius: "10px",
            padding: "10px",
            marginBottom: "15px",
            marginX: "auto",
            width: "calc(100% - 10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "40px",
          }}
        >
          <Typography sx={{ fontWeight: "bold", ml: "10px" }}>
            Book Details
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: "grey", p: 0 }}>
            <CloseIcon sx={{ width: "18px", height: "18px" }} />
          </IconButton>
        </Box>

        <DialogContent>
          {selectedBook && (
            <>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", fontSize: "16px", mb: "5px" }}
              >
                {selectedBook.title_of_the_book || ""}
              </Typography>

              <Typography variant="body1" sx={{ mb: "3px" }}>
                Accession No: {selectedBook.accession_no || ""}
              </Typography>

              <Typography variant="body1" sx={{ mb: "10px" }}>
                Author: {selectedBook.name_of_the_author || ""}
              </Typography>

              <Box>
                {[
                  "class_no",
                  "volume_no",
                  "publisher",
                  "year",
                  "place",
                  "price",
                  "isbn_issn_no",
                  "language",
                  "subject_heading",
                  "no_of_pages_contain",
                  "source",
                ].map((key) => {
                  const label = key
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase());
                  const displayValue = selectedBook?.[key] || "";

                  return (
                    <Box
                      key={key}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: "4px",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          flex: 1,
                          textAlign: "left",
                        }}
                      >
                        {label}
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          color: "gray",
                          textAlign: "center",
                          flex: 0.1,
                        }}
                      >
                        :
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ flex: 1, textAlign: "left" }}
                      >
                        {displayValue}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions
          sx={{ padding: "0", mb: "10px", justifyContent: "flex-end" }}
        >
          <Button
            onClick={handleTransactionOpen}
            color="secondary"
            variant="contained"
            size="small"
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              ml: "10px",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            View Transaction
          </Button>
          <Button
            onClick={handleEditClick}
            color="primary"
            variant="contained"
            size="small"
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Edit
          </Button>
          <Button
            onClick={handleDeleteOpen}
            color="error"
            variant="contained"
            size="small"
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              ml: "10px",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Transaction Dialog */}
      <Dialog
        open={isTransactionDialogOpen}
        onClose={handleTransactionClose}
        maxWidth="sm"
        fullWidth
        sx={{
          fontFamily: "Poppins, sans-serif",
          "& .MuiDialog-paper": {
            borderRadius: "15px",
            padding: "20px",
          },
        }}
      >
        <Box
          sx={{
            backgroundColor: "#f5f5f5",
            borderRadius: "10px",
            padding: "10px",
            marginBottom: "15px",
            marginX: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "40px",
            width: "calc(100% - 10px)",
          }}
        >
          <Typography sx={{ fontWeight: "bold", ml: "10px" }}>
            Transaction Details
          </Typography>
          <IconButton
            onClick={handleTransactionClose}
            sx={{ color: "grey", p: 0 }}
          >
            <CloseIcon sx={{ width: "18px", height: "18px" }} />
          </IconButton>
        </Box>

        <DialogContent>
          {loading ? (
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography sx={{ color: "red", textAlign: "center" }}>
              {error}
            </Typography>
          ) : transactions.length === 0 ? (
            <Typography sx={{ textAlign: "center", color: "gray" }}>
              No returned transactions found.
            </Typography>
          ) : (
            transactions.map((txn, index) => (
              <Box
                key={index}
                sx={{
                  borderBottom: "1px solid #ccc",
                  mb: "10px",
                  pb: "10px",
                }}
              >
                <Typography>
                  <strong>Student Name:</strong> {txn.student_name}
                </Typography>
                <Typography>
                  <strong>Issued On:</strong> {txn.issued_on}
                </Typography>
                <Typography>
                  <strong>Due Date:</strong> {getDueDate(txn.issued_on)}
                </Typography>
              </Box>
            ))
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default BookDetailsDialog;
