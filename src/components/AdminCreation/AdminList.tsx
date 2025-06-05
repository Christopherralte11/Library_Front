import React, { useState } from "react";
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
  IconButton,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddUserButton from "./Fabs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Make sure to import this

interface User {
  user_id: string;
  username: string;
  password: string;
}

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  navigate: (path: number) => void;
  onAddClick: () => void;
}

const AdminList: React.FC<Props> = ({
  users,
  onEdit,
  onDelete,
  onAddClick,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
    setPage(0);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery)
  );

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ mt: isMobile ? 12 : 10 }}>
      {/* Header and Back Button */}

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
          cursor: "pointer", // Make the entire box clickable
          mt: "-60px",
          ml: "-16px",
        }}
        onClick={() => window.history.back()} // Handle the back button click
      >
        <IconButton sx={{ color: "#ffffff", marginLeft: "-15px" }}>
          <ArrowBackIcon sx={{ fontSize: "20px" }} />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 500, fontSize: "13px" }}>
          Admin List
        </Typography>
      </Box>

      {/* Add User and Search Section */}
      {isMobile ? (
        // Mobile: Stack Add button above centered search bar
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 2,
            px: 2,
            gap: 1,
          }}
        >
          <AddUserButton onClick={onAddClick} />
          <TextField
            placeholder="Search Admin by Username"
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
              width: "100%",
              maxWidth: "366px",
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
      ) : (
        // Desktop: Add button left, search bar center, empty right placeholder
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
            px: 2,
          }}
        >
          <Box
            sx={{
              flexBasis: "33%",
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <AddUserButton onClick={onAddClick} />
          </Box>
          <Box
            sx={{ flexBasis: "33%", display: "flex", justifyContent: "center" }}
          >
            <TextField
              placeholder="Search Admin by Username"
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
          <Box sx={{ flexBasis: "33%" }} />
        </Box>
      )}

      {/* Table */}
      <Paper
        sx={{
          width: "97%",
          margin: "auto",
          overflow: "hidden",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <TablePagination
          rowsPerPageOptions={[20, 50, 100, 200]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          labelRowsPerPage="Rows per page:"
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ backgroundColor: "#fff", zIndex: 2 }}
        />

        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {["#", "Username", "Actions"].map((header) => (
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
                      paddingX: "16px",
                      fontSize: "0.85rem",
                      textAlign: header === "Actions" ? "center" : "left",
                      ...(header === "Username" && { width: "50%" }),
                      ...(header === "Actions" && { width: "10%" }),
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, index) => (
                  <TableRow
                    key={user.user_id}
                    sx={{
                      backgroundColor: "#fff",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                  >
                    <TableCell sx={{ paddingY: "6px", fontSize: "0.85rem" }}>
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell sx={{ paddingY: "6px", fontSize: "0.85rem" }}>
                      {user.username}
                    </TableCell>
                    <TableCell
                      sx={{
                        paddingY: "0px",
                        paddingX: "8px",
                        fontSize: "0.85rem",
                        textAlign: "center",
                      }}
                    >
                      <IconButton color="primary" onClick={() => onEdit(user)}>
                        <EditIcon sx={{ fontSize: "18px" }} />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => onDelete(user.user_id)}
                      >
                        <DeleteIcon sx={{ fontSize: "18px" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    align="center"
                    sx={{ paddingY: "10px" }}
                  >
                    No admins found.
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

export default AdminList;
