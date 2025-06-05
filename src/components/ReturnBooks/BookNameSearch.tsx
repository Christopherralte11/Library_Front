import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Box,
  IconButton,
  Typography,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface DuePendingTableProps {
  issues: any[];
  setSelectedIssue: (issue: any) => void;
}

function BookNameSearch({ issues, setSelectedIssue }: DuePendingTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20); // Default to 20
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate(); // Initialize navigate

  // Handle pagination
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  // Filter issues based on search query
  const filteredIssues = issues.filter(
    (issue) =>
      issue.title_of_the_book
        ?.toLowerCase()
        .includes(searchText.toLowerCase()) ||
      issue.student_name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const paginatedIssues = filteredIssues.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handle back button click (navigate to previous page)
  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <>
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
          mt: "-140px",
        }}
        onClick={handleBack} // Handle the back button click
      >
        <IconButton sx={{ color: "#ffffff", marginLeft: "-15px" }}>
          <ArrowBackIcon sx={{ fontSize: "20px" }} />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 500, fontSize: "12.8px" }}>
          Return Books{" "}
        </Typography>
      </Box>

      {/* Centered Search Bar */}
      <Box
        sx={{ display: "flex", justifyContent: "center", mb: 2, mt: "150px" }}
      >
        <TextField
          placeholder="Search by Book Name"
          variant="outlined"
          value={searchText}
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

      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        {/* Pagination on top */}
        <TablePagination
          rowsPerPageOptions={[20, 50, 100, 200]} // Only these options
          component="div"
          count={filteredIssues.length}
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
                  "Student Name",
                  "Issued On",
                  "Due Date",
                  "Overdue",
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
              {paginatedIssues.length > 0 ? (
                paginatedIssues.map((issue, index) => (
                  <TableRow
                    key={index}
                    hover
                    onClick={() => setSelectedIssue(issue)}
                    sx={{
                      cursor: "pointer",
                      backgroundColor: "#fff",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                  >
                    {[
                      page * rowsPerPage + index + 1,
                      issue.title_of_the_book,
                      issue.student_name,
                      issue.issued_on,
                      issue.due_date,
                      issue.overdue === "No" ? "-" : issue.overdue,
                      issue.status,
                    ].map((cellData, i) => (
                      <TableCell
                        key={i}
                        sx={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: i === 6 ? "bold" : "normal",
                          color:
                            i === 5 && issue.overdue !== "No"
                              ? "red"
                              : i === 6
                              ? issue.status === "Pending"
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
                    colSpan={7}
                    align="center"
                    sx={{ paddingY: "10px" }}
                  >
                    No pending transactions available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}

export default BookNameSearch;
