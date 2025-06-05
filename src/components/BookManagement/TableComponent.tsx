import React, { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TablePagination,
  useMediaQuery,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { api } from "../../api/api";

// Import useAuth from your AuthContext file
import { useAuth } from "../../context/AuthContext"; // adjust path as needed

interface Book {
  accession_no: string;
  title_of_the_book: string;
  name_of_the_author: string;
  class_no: string;
}

interface TableProps {
  addedBooks: Book[];
  handleRowClick: (book: Book) => void;
}

const TableComponent: React.FC<TableProps> = ({
  addedBooks,
  handleRowClick,
}) => {
  // Access auth context here
  const { isAuthenticated, token, role } = useAuth();

  const [borrowedCounts, setBorrowedCounts] = useState<{
    [key: string]: number;
  }>({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useMediaQuery("(max-width:600px)");

  // Fetch borrowed count for each book, optionally using the token if needed for auth
  useEffect(() => {
    const fetchBorrowedCount = async (accessionNo: string) => {
      try {
        const response = await fetch(
          `${api}/issues/issued_books_count/${accessionNo}`,
          {
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {},
          }
        );
        const data = await response.json();
        if (data.Status) {
          setBorrowedCounts((prev) => ({
            ...prev,
            [accessionNo]: data.IssuedCount,
          }));
        }
      } catch (error) {
        console.error("Error fetching borrowed count:", error);
      }
    };

    addedBooks.forEach((book) => fetchBorrowedCount(book.accession_no));
  }, [addedBooks, token]); // depend on token to refetch if it changes

  // rest of your handlers and rendering logic unchanged...

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
    setPage(0);
  };

  const filteredBooks = addedBooks.filter(
    (book) =>
      book.title_of_the_book.toLowerCase().includes(searchQuery) ||
      book.accession_no.toLowerCase().includes(searchQuery)
  );

  const paginatedBooks = filteredBooks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ mt: isMobile ? 12 : -3 }}>
      {/* Search Bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <TextField
          placeholder="Search Book by Name, Accession No"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
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

      {/* Table */}
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <TablePagination
          rowsPerPageOptions={[20, 50, 100, 200]}
          component="div"
          count={filteredBooks.length}
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

        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {[
                  "#",
                  "Accession No.",
                  "Title of Book",
                  "Name of Author",
                  "Class No.",
                  "Borrowed Count",
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
              {paginatedBooks.length > 0 ? (
                paginatedBooks.map((book, index) => (
                  <TableRow
                    key={index}
                    onClick={() => handleRowClick(book)}
                    sx={{
                      cursor: "pointer",
                      backgroundColor: "#fff",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    <TableCell sx={{ paddingY: "6px", fontSize: "0.85rem" }}>
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell sx={{ paddingY: "6px", fontSize: "0.85rem" }}>
                      {book.accession_no}
                    </TableCell>
                    <TableCell sx={{ paddingY: "6px", fontSize: "0.85rem" }}>
                      {book.title_of_the_book}
                    </TableCell>
                    <TableCell sx={{ paddingY: "6px", fontSize: "0.85rem" }}>
                      {book.name_of_the_author}
                    </TableCell>
                    <TableCell sx={{ paddingY: "6px", fontSize: "0.85rem" }}>
                      {book.class_no}
                    </TableCell>
                    <TableCell sx={{ paddingY: "6px", fontSize: "0.85rem" }}>
                      {borrowedCounts[book.accession_no] || 0}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{ paddingY: "10px" }}
                  >
                    No books available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default TableComponent;
