import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Paper,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { api } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

interface DuePendingTableProps {
  setSelectedIssue: (issue: any) => void;
}

function PhoneNumberSearch({ setSelectedIssue }: DuePendingTableProps) {
  const [searchText, setSearchText] = useState("");
  const [filteredIssues, setFilteredIssues] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [toastShown, setToastShown] = useState(false);
  const navigate = useNavigate();

  const { token, logout } = useAuth();

  const handleBack = () => navigate(-1);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${api}/issues/all_issues`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.Status) {
        const transformedData = response.data.Issues.map((transaction: any) => {
          let issuedOn = dayjs(transaction.issued_on);
          if (issuedOn.isBefore("2024-01-01")) {
            issuedOn = dayjs();
          }
          const dueDate = issuedOn.add(7, "day").format("DD/MM/YYYY");

          return {
            ...transaction,
            issued_on: issuedOn.format("DD/MM/YYYY"),
            due_date: dueDate,
          };
        });

        setTransactions(transformedData);
        setFilteredIssues(transformedData);
      } else {
        toast.error("No transactions found.");
      }
    } catch (err: any) {
      console.error("Error fetching transactions:", err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Logging out.");
        logout(); // 👈 Logout on 401
      } else {
        toast.error("An error occurred while fetching the transactions.");
      }
    }
  };

  const handleSearch = () => {
    setIsSearchClicked(true);
    setToastShown(false);

    if (searchText.trim() === "") {
      setFilteredIssues([]);
      return;
    }

    const filtered = transactions.filter(
      (issue) => issue.phone_no?.toLowerCase() === searchText.toLowerCase()
    );

    if (filtered.length === 0 && !toastShown) {
      toast.error("No records found.");
      setToastShown(true);
    }

    setFilteredIssues(filtered);
  };

  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearchText(text);

    if (text.trim() === "") {
      setFilteredIssues([]);
    } else {
      setIsSearchClicked(false);
    }
  };

  const getTransactionCounts = () => {
    let pendingCount = 0;
    filteredIssues.forEach((issue) => {
      if (issue.status === "Pending") {
        pendingCount++;
      }
    });
    return { pendingCount };
  };

  const handleDetailsClick = (issue: any) => {
    setSelectedIssue(issue);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const { pendingCount } = getTransactionCounts();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#333333",
          color: "#ffffff",
          padding: "10px 16px",
          borderRadius: "0 10px 10px 0",
          marginBottom: 2,
          width: "187px",
          height: "44px",
          marginLeft: "-40px",
          cursor: "pointer",
          mt: "-140px",
        }}
        onClick={handleBack}
      >
        <IconButton sx={{ color: "#ffffff", marginLeft: "-15px" }}>
          <ArrowBackIcon sx={{ fontSize: "20px" }} />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 500, fontSize: "12.8px" }}>
          Return Books
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 2,
          mt: "150px",
          px: 2,
        }}
      >
        <TextField
          placeholder="Search by Phone Number"
          variant="outlined"
          value={searchText}
          onChange={handleSearchTextChange}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#666", fontSize: "24px" }} />
              </InputAdornment>
            ),
            sx: {
              height: "30px",
              borderRadius: "5px",
              color: "#666",
              fontWeight: 600,
              fontFamily: "Poppins, sans-serif",
              paddingX: "6px",
            },
          }}
          sx={{
            width: "100%",
            maxWidth: "370px",
            height: "30px",
            "& .MuiOutlinedInput-root": {
              height: "30px",
              borderRadius: "5px",
              fontSize: "13px",
            },
            "& input": {
              paddingY: 0,
              paddingX: 1,
              color: "#666",
              fontWeight: 600,
            },
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <Button
          onClick={handleSearch}
          sx={{
            marginLeft: "10px",
            backgroundColor: "#3565DD",
            color: "#fff",
            borderRadius: "5px",
            height: "30px",
            width: "87px",
            padding: "0 16px",
            fontSize: "13px",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "#2858A6",
            },
            textTransform: "none",
          }}
        >
          Search
        </Button>
      </Box>

      {isSearchClicked &&
        searchText.trim() !== "" &&
        filteredIssues.length > 0 && (
          <Paper
            elevation={0}
            sx={{
              borderRadius: "10px",
              p: 2,
              mx: "auto",
              width: "100%",
              maxWidth: "501px",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            <Box
              sx={{
                border: "1px dashed #3565DD",
                borderRadius: "10px",
                p: 2,
                mb: 2,
                fontFamily: "Poppins, sans-serif",
                width: "100%",
                maxWidth: "501px",
                height: "108px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Typography
                sx={{
                  mb: 0.5,
                  alignSelf: "flex-start",
                  mt: "-10px",
                  ml: "-5px",
                  fontSize: "14px",
                }}
              >
                Borrower Details
              </Typography>

              <Grid container spacing={1}>
                {/* Phone Number */}
                <Grid item xs={5}>
                  <Typography sx={{ fontSize: "13px", ml: "-5px", mt: "-1px" }}>
                    Phone Number
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography sx={{ fontSize: "13px", mt: "-1px" }}>
                    :
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    sx={{ fontSize: "13px", textAlign: "left", mt: "-1px" }}
                  >
                    {searchText}
                  </Typography>
                </Grid>

                {/* No of Book Borrowed */}
                <Grid item xs={5}>
                  <Typography sx={{ fontSize: "13px", ml: "-5px", mt: "-5px" }}>
                    No of Book Borrowed
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography sx={{ fontSize: "13px", mt: "-5px" }}>
                    :
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    sx={{ fontSize: "13px", textAlign: "left", mt: "-5px" }}
                  >
                    {filteredIssues.length}
                  </Typography>
                </Grid>

                {/* No of Book Pending */}
                <Grid item xs={5}>
                  <Typography sx={{ fontSize: "13px", ml: "-5px", mt: "-5px" }}>
                    No of Book Pending
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography sx={{ fontSize: "13px", mt: "-5px" }}>
                    :
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    sx={{ fontSize: "13px", textAlign: "left", mt: "-5px" }}
                  >
                    {pendingCount}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {filteredIssues
              .filter((issue) => issue.status === "Pending")
              .map((issue, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1,
                    mb: 1,
                    border: "1px dashed red",
                    borderRadius: "8px",
                    width: "100%",
                    maxWidth: "501px",
                    height: "170px",
                    position: "relative", // Add relative position for the parent box
                  }}
                >
                  {/* Heading for the Box */}
                  <Typography
                    sx={{
                      position: "absolute", // Position it at the top left
                      top: "5px",
                      left: "8px",
                      fontSize: "14px",
                    }}
                  >
                    Book Issued
                  </Typography>

                  <Grid container spacing={1}>
                    {/* Book Title */}
                    <Grid item xs={5}>
                      <Typography sx={{ fontSize: "13px" }}>
                        Book Title
                      </Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography sx={{ fontSize: "13px" }}>:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={{ fontSize: "13px", textAlign: "left" }}>
                        {issue.title_of_the_book}
                      </Typography>
                    </Grid>

                    {/* Accession No */}
                    <Grid item xs={5}>
                      <Typography sx={{ fontSize: "13px" }}>
                        Accession No
                      </Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography sx={{ fontSize: "13px" }}>:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={{ fontSize: "13px", textAlign: "left" }}>
                        {issue.accession_no}
                      </Typography>
                    </Grid>

                    {/* Issued On */}
                    <Grid item xs={5}>
                      <Typography sx={{ fontSize: "13px" }}>
                        Issued On
                      </Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography sx={{ fontSize: "13px" }}>:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={{ fontSize: "13px", textAlign: "left" }}>
                        {issue.issued_on || "N/A"}
                      </Typography>
                    </Grid>

                    {/* Due Date */}
                    <Grid item xs={5}>
                      <Typography sx={{ fontSize: "13px" }}>
                        Due Date
                      </Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography sx={{ fontSize: "13px" }}>:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={{ fontSize: "13px", textAlign: "left" }}>
                        {issue.due_date || "N/A"}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Button
                    onClick={() => handleDetailsClick(issue)}
                    sx={{
                      backgroundColor: "#008000",
                      color: "#fff",
                      borderRadius: "5px",
                      fontSize: "12px",
                      fontWeight: 600,
                      textTransform: "none",
                      position: "absolute", // Set the button's position to absolute
                      bottom: "10px", // Adjust bottom distance
                      right: "10px", // Adjust right distance
                      "&:hover": {
                        backgroundColor: "#006400",
                      },
                    }}
                  >
                    Book Details
                  </Button>
                </Box>
              ))}
          </Paper>
        )}
    </>
  );
}

export default PhoneNumberSearch;
