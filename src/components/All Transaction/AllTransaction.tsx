import React, { useState, useEffect } from "react";
import ResponsiveDrawer from "../../ResponsiveDrawer";
import axios from "axios";
import dayjs from "dayjs";
import toast, { Toaster } from "react-hot-toast";
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TransactionDetailsDialog from "./TransactionDetailsDialog";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";

// Import the Auth hook
import { useAuth } from "../../context/AuthContext"; // Adjust the path as necessary

function AllTransaction() {
  const { token, isAuthenticated } = useAuth(); // Get token and auth status
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect or show error if not logged in
      toast.error("You must be logged in to view transactions.");
      navigate("/login"); // Redirect to login page or wherever
      return;
    }
    fetchTransactions();
  }, [isAuthenticated]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${api}/issues/all_issues`, {
        headers: {
          Authorization: `Bearer ${token}`, // Use token in Authorization header
        },
      });

      if (response.data.Status) {
        const transformedData = response.data.Issues.map((transaction: any) => {
          let issuedOn = dayjs(transaction.issued_on);

          if (issuedOn.isBefore("2024-01-01")) {
            issuedOn = dayjs(); // Fix old dates
          }

          const dueDate = issuedOn.add(7, "day").format("DD/MM/YYYY");

          return {
            ...transaction,
            issued_on: issuedOn.format("DD/MM/YYYY"),
            due_date: dueDate,
          };
        });

        setTransactions(transformedData);
        setFilteredTransactions(transformedData);
      } else {
        setError("No transactions found.");
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("An error occurred while fetching the transactions.");
    }
  };

  const handleDeleteTransaction = async (issue_id: string) => {
    try {
      const response = await axios.delete(
        `${api}/issues/delete_issue/${issue_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token here too
          },
        }
      );

      if (response.data.Status) {
        setSelectedTransaction(null);
        fetchTransactions();
        toast.success("Transaction successfully deleted!");
      }
    } catch (err) {
      console.error("Error deleting transaction:", err);
      toast.error("Failed to delete transaction.");
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = transactions.filter((transaction) =>
      `${transaction.title_of_the_book} ${transaction.student_name}`
        .toLowerCase()
        .includes(query)
    );

    setFilteredTransactions(filtered);
    setPage(0);
  };

  const handleChangePage = (_: any, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <ResponsiveDrawer>
      <Toaster position="top-center" />
      <Container
        maxWidth={false}
        sx={{ padding: 3, height: "100%", width: "100%", mt: "80px" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#333333",
            color: "#ffffff",
            padding: "10px 16px",
            borderRadius: "0 10px 10px 0", // Right border radius only
            marginBottom: 2,
            width: "187px", // Fixed width
            height: "44px", // Fixed height
            marginLeft: "-40px", // Moved further to the left (marked place)
            cursor: "pointer", // Make the entire box clickable
            mt: "-55px",
          }}
          onClick={handleBack} // Handle the back button click
        >
          <IconButton sx={{ color: "#ffffff", marginLeft: "-15px" }}>
            <ArrowBackIcon sx={{ fontSize: "20px" }} />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 500, fontSize: "13px" }}>
            Transaction History{" "}
          </Typography>
        </Box>
        {/* Centered Search Bar */}
        <Box
          sx={{ display: "flex", justifyContent: "center", mb: 2, mt: "8px" }}
        >
          <TextField
            placeholder="Search by Title or Name"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearch}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#666", fontSize: "24px" }} />
                </InputAdornment>
              ),
              sx: {
                height: "30px",
                borderRadius: "10px",
                fontSize: "0.8rem",
                color: "#666",
                fontWeight: 600,
                fontFamily: "Poppins, sans-serif",
                paddingX: "6px",
              },
            }}
            sx={{
              width: "366px",
              "& .MuiOutlinedInput-root": {
                height: "30px",
                borderRadius: "10px",
                fontSize: "0.8rem",
              },
              "& input": {
                paddingY: 0,
                paddingX: 1,
                color: "#666",
                fontWeight: 600,
              },
            }}
          />
        </Box>

        {error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Paper
            sx={{
              width: "100%",
              overflow: "hidden",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            {/* Pagination on top */}
            <TablePagination
              rowsPerPageOptions={[20, 50, 100, 200]}
              component="div"
              count={filteredTransactions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              labelRowsPerPage="Rows per page:"
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                backgroundColor: "#fff",
                zIndex: 2,
              }}
            />

            <TableContainer
              component={Paper}
              elevation={3}
              sx={{
                maxHeight: "calc(100vh - 180px)",
                border: "1px solid #ddd",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {[
                      "#",
                      "Book Title",
                      "Borrower Name",
                      "Issued On",
                      "Due Date",
                      "Status",
                    ].map((header) => (
                      <TableCell
                        key={header}
                        sx={{
                          fontWeight: "bold",
                          fontFamily: "Poppins, sans-serif",
                          backgroundColor: "#333",
                          color: "#fff",
                          position: "sticky",
                          top: 0,
                          zIndex: 3,
                          paddingY: "6px",
                          paddingX: "8px",
                          fontSize: "0.85rem",
                        }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((transaction, index) => (
                        <TableRow
                          key={index}
                          hover
                          onClick={() => setSelectedTransaction(transaction)}
                          sx={{
                            cursor: "pointer",
                            backgroundColor: "#fff",
                            "&:hover": { backgroundColor: "#f5f5f5" },
                          }}
                        >
                          {[
                            page * rowsPerPage + index + 1,
                            transaction.title_of_the_book,
                            transaction.student_name,
                            transaction.issued_on,
                            transaction.due_date,
                            transaction.status,
                          ].map((cellData, i) => (
                            <TableCell
                              key={i}
                              sx={{
                                fontFamily: "Poppins, sans-serif",
                                fontWeight: i === 5 ? "bold" : "normal",
                                color:
                                  i === 5
                                    ? transaction.status === "Pending"
                                      ? "orange"
                                      : "green"
                                    : "inherit",
                                paddingY: "6px",
                                fontSize: "0.85rem",
                              }}
                            >
                              {cellData}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        align="center"
                        sx={{ paddingY: "10px" }}
                      >
                        No transactions available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {selectedTransaction && (
          <TransactionDetailsDialog
            open={Boolean(selectedTransaction)}
            handleClose={() => setSelectedTransaction(null)}
            handleDeleteTransaction={handleDeleteTransaction}
            transaction={{
              ...selectedTransaction,
              due_date: dayjs(selectedTransaction.issued_on, "DD/MM/YYYY")
                .add(7, "day")
                .format("DD/MM/YYYY"),
            }}
          />
        )}
      </Container>
    </ResponsiveDrawer>
  );
}

export default AllTransaction;
