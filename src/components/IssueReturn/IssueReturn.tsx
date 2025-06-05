import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import ResponsiveDrawer from "../../ResponsiveDrawer";
import {
  Typography,
  Container,
  Box,
  Button,
  Grid,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import BookDetails from "./BookDetails";
import BookSearch from "./BookSearch";
import IssueDialog from "./IssueDialog";
import EditIssueDialog from "./EditIssueDialog";
import dayjs from "dayjs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import { useAuth } from "../../context/AuthContext"; // <-- Import AuthContext here

interface BookDetails {
  title_of_the_book: string;
  name_of_the_author: string;
  accession_no: string;
  volume_no: string;
  year: string;
  place: string;
  price: string;
  isbn_issn_no: string;
  language: string;
  subject_heading: string;
  no_of_pages_contain: string;
  source: string;
}

function IssueReturn() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { isAuthenticated, token, role } = useAuth(); // <-- Use Auth Context

  const [accessionNo, setAccessionNo] = useState("");
  const [bookDetails, setBookDetails] = useState<BookDetails | null>(null);
  const [error, setError] = useState("");
  const [openIssueDialog, setOpenIssueDialog] = useState(false);
  const [showConfirmationBox, setShowConfirmationBox] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [issueData, setIssueData] = useState({
    student_name: "",
    phone_no: "",
    parental: "",
    remark: "",
    issued_on: "",
    status: "pending",
    volume_no: "",
    year: "",
    place: "",
    price: "",
    isbn_issn_no: "",
    language: "",
    subject_heading: "",
    no_of_pages_contain: "",
    source: "",
    title_of_the_book: "",
    name_of_the_author: "",
    accession_no: "",
  });

  // Fetch Book Details with token in headers
  const fetchBookDetails = async () => {
    if (!isAuthenticated || !token) {
      toast.error("You must be logged in to fetch book details.");
      return;
    }
    try {
      const response = await axios.get(
        `${api}/issues/pending_book/${accessionNo}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.Status) {
        setBookDetails(response.data.BookDetails);
        setError("");
      } else {
        setBookDetails(null);
        setError(response.data.Error || "Accession No not found!");
        toast.error("Accession No not found!");
      }
    } catch (err) {
      console.error("Error fetching book:", err);
      setBookDetails(null);
      toast.error("Accession No not found!");
    }
  };

  // Handle Issue Dialog Open
  const handleIssueClick = () => {
    if (bookDetails) {
      setIssueData((prevState) => ({ ...prevState, ...bookDetails }));
    }
    setOpenIssueDialog(true);
  };

  // Handle input changes in Issue Data
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setIssueData((prevState) => ({ ...prevState, [name]: value }));
  };

  // Handle the Submission of Issue
  const handleSubmitIssue = async () => {
    setOpenIssueDialog(false);
    setShowConfirmationBox(true);
  };

  // Handle Confirmation of Issue with token in headers
  const handleConfirmIssue = async () => {
    if (!isAuthenticated || !token) {
      toast.error("You must be logged in to issue a book.");
      return;
    }
    try {
      const response = await axios.post(
        `${api}/issues/issue_book`,
        {
          ...issueData,
          title_of_the_book: bookDetails?.title_of_the_book,
          accession_no: bookDetails?.accession_no,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.Status) {
        toast.success("Book issued successfully!");
        setShowConfirmationBox(false);
      } else {
        toast.error(response.data.Error || "Failed to issue book.");
      }
    } catch (err) {
      console.error("Error issuing book:", err);
      toast.error("An error occurred while issuing the book.");
    }
  };

  // Calculate Due Date (7 days from issued_on)
  const dueDate = issueData.issued_on
    ? dayjs(issueData.issued_on).add(7, "day").format("YYYY-MM-DD")
    : "";

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <ResponsiveDrawer>
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
          marginLeft: "-16px", // Moved further to the left (marked place)
          cursor: "pointer", // Make the entire box clickable
          mt: "49px",
        }}
        onClick={handleBack} // Handle the back button click
      >
        <IconButton sx={{ color: "#ffffff", marginLeft: "-15px" }}>
          <ArrowBackIcon sx={{ fontSize: "20px" }} />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 500, fontSize: "12.8px" }}>
          Issue Books{" "}
        </Typography>
      </Box>
      <Toaster position="top-center" />
      <Container>
        <BookSearch
          accessionNo={accessionNo}
          setAccessionNo={setAccessionNo}
          handleSearch={fetchBookDetails}
        />
        {error && (
          <Typography color="error" sx={{ mt: 2 }} align="center">
            {error}
          </Typography>
        )}
        {bookDetails && (
          <BookDetails
            bookDetails={bookDetails}
            onIssueClick={handleIssueClick}
            onRemoveClick={() => setBookDetails(null)}
          />
        )}
      </Container>
      <IssueDialog
        open={openIssueDialog}
        issueData={issueData}
        bookDetails={bookDetails}
        handleInputChange={handleInputChange}
        handleClose={() => setOpenIssueDialog(false)}
        handleSubmit={handleSubmitIssue}
        handleEditOpen={() => setOpenEditDialog(true)}
      />
      <EditIssueDialog
        open={openEditDialog}
        issueData={issueData}
        handleInputChange={handleInputChange}
        handleClose={() => setOpenEditDialog(false)}
        handleSave={() => setOpenEditDialog(false)}
      />
      {showConfirmationBox && (
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 4,
          }}
        >
          <Box
            sx={{
              border: "1px dashed #FF0606",
              borderRadius: "8px",
              p: 2,
              maxWidth: 490,
              width: "100%",
              textAlign: "left",
              backgroundColor: "#fff",
              mr: isMobile ? 0 : "-8px",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: "15px",
                fontWeight: "bold",
                marginBottom: "12px",
                textAlign: "left", // Align to the left
              }}
            >
              Book Issue to
            </Typography>
            <Grid container spacing={1}>
              {/* Student Name */}
              <Grid item xs={5}>
                <Typography sx={{ fontSize: "13px" }}>Student Name</Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography sx={{ fontSize: "13px" }}>:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ fontSize: "13px", textAlign: "left" }}>
                  {issueData.student_name}
                </Typography>
              </Grid>

              {/* Phone No */}
              <Grid item xs={5}>
                <Typography sx={{ fontSize: "13px" }}>Phone No</Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography sx={{ fontSize: "13px" }}>:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ fontSize: "13px", textAlign: "left" }}>
                  {issueData.phone_no}
                </Typography>
              </Grid>

              {/* Title */}
              <Grid item xs={5}>
                <Typography sx={{ fontSize: "13px" }}>Title</Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography sx={{ fontSize: "13px" }}>:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ fontSize: "13px", textAlign: "left" }}>
                  {bookDetails?.title_of_the_book}
                </Typography>
              </Grid>

              {/* Accession No */}
              <Grid item xs={5}>
                <Typography sx={{ fontSize: "13px" }}>Accession No.</Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography sx={{ fontSize: "13px" }}>:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ fontSize: "13px", textAlign: "left" }}>
                  {bookDetails?.accession_no}
                </Typography>
              </Grid>

              {/* Issued On */}
              <Grid item xs={5}>
                <Typography sx={{ fontSize: "13px" }}>Issued On</Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography sx={{ fontSize: "13px" }}>:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ fontSize: "13px", textAlign: "left" }}>
                  {issueData.issued_on}
                </Typography>
              </Grid>

              {/* Due Date */}
              <Grid item xs={5}>
                <Typography sx={{ fontSize: "13px" }}>Due Date</Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography sx={{ fontSize: "13px" }}>:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  sx={{ fontSize: "13px", textAlign: "left", color: "#FF0606" }}
                >
                  {dueDate}
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleConfirmIssue}
                sx={{
                  mr: 1,
                  backgroundColor: "#008000",
                  textTransform: "none",
                  borderRadius: "7px",
                  fontSize: "13px",
                  width: "123px",
                  height: "30px",
                }}
              >
                Submit
              </Button>
              <Button
                variant="contained"
                onClick={() => setShowConfirmationBox(false)}
                sx={{
                  textTransform: "none",
                  borderRadius: "7px",
                  fontSize: "13px",
                  width: "123px",
                  height: "30px",
                  backgroundColor: "#FF0606",
                }}
              >
                Cancel Issue
              </Button>
            </Box>
          </Box>
        </Container>
      )}
    </ResponsiveDrawer>
  );
}

export default IssueReturn;
