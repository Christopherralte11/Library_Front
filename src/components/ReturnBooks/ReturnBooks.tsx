import React, { useState, useEffect } from "react";
import ResponsiveDrawer from "../../ResponsiveDrawer";
import axios from "axios";
import dayjs from "dayjs";
import {
  Container,
  Typography,
  Box,
  Button,
  useMediaQuery,
} from "@mui/material";
import BookNameSearch from "./BookNameSearch";
import PhoneNumberSearch from "./PhoneNumberSearch";
import ReturnDialog from "./ReturnDialog";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../../api/api";
import { useAuth } from "../../context/AuthContext"; // <-- Adjust path as needed

function ReturnBooks() {
  const { isAuthenticated, token, role } = useAuth(); // <-- Access auth context
  const [issues, setIssues] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [selectedIssue, setSelectedIssue] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<string>("phone");

  const isMobile = useMediaQuery("(max-width: 600px)");

  useEffect(() => {
    if (isAuthenticated) {
      fetchIssues();
    } else {
      setError("You are not authorized to view this page.");
    }
  }, [isAuthenticated]);

  const fetchIssues = async () => {
    try {
      const response = await axios.get(`${api}/issues/all_issues`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.Status) {
        const pendingIssues = response.data.Issues.filter(
          (issue: any) => issue.status === "Pending"
        ).map((issue: any) => {
          const issuedOn = dayjs(issue.issued_on);
          const dueDate = issuedOn.add(7, "day");
          const isOverdue = dayjs().isAfter(dueDate);

          return {
            ...issue,
            issued_on: issuedOn.format("DD/MM/YYYY"),
            due_date: dueDate.format("DD/MM/YYYY"),
            overdue: isOverdue ? "Yes" : "No",
          };
        });
        setIssues(pendingIssues);
      } else {
        setError("No due or pending books found.");
      }
    } catch (err) {
      console.error("Error fetching issues:", err);
      setError("An error occurred while fetching the issues.");
    }
  };

  const handleReturnBook = async (issue_id: string) => {
    try {
      const response = await axios.put(
        `${api}/issues/return_book/${issue_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.Status) {
        setSelectedIssue(null);
        fetchIssues();
        toast.success("Book returned successfully!", {
          position: "top-center",
        });
      } else {
        toast.error("Failed to return book", { position: "top-center" });
      }
    } catch (err) {
      console.error("Error returning book:", err);
      toast.error("An error occurred while returning the book.", {
        position: "top-center",
      });
    }
  };

  const handleDeleteIssue = async (issue_id: string) => {
    try {
      const response = await axios.delete(
        `${api}/issues/delete_issue/${issue_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.Status) {
        setSelectedIssue(null);
        fetchIssues();
        toast.success("Issue deleted successfully!", {
          position: "top-center",
        });
      } else {
        toast.error("Failed to delete issue", { position: "top-center" });
      }
    } catch (err) {
      console.error("Error deleting issue:", err);
      toast.error("An error occurred while deleting the issue.", {
        position: "top-center",
      });
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <ResponsiveDrawer>
      <Toaster />
      <Container
        maxWidth={false}
        sx={{
          padding: 3,
          height: "100%",
          width: "100%",
          mt: isMobile ? "60px" : "119px", // Apply different margins based on screen size
        }}
      >
        {error && <Typography color="error">{error}</Typography>}

        {/* Center the tabs */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center", // Center tabs horizontally
            alignItems: "center", // Center tabs vertically
            mb: 2,
            gap: isMobile ? 1 : 2, // Reduced gap for mobile
            flexDirection: isMobile ? "column" : "row", // Stack tabs vertically on mobile
            mt: isMobile ? "20px" : "0px", // Add margin-top to create space between tabs and back button
          }}
        >
          <Button
            onClick={() => handleTabChange("phone")}
            sx={{
              backgroundColor:
                activeTab === "phone" ? "#3565DD" : "transparent",
              color: activeTab === "phone" ? "white" : "text.primary",
              borderRadius: "5px",
              width: isMobile ? "100%" : "200px", // Full width on mobile
              height: "30px",
              textTransform: "none",
              boxShadow: activeTab === "phone" ? 2 : "none",
            }}
          >
            Search By Phone Number
          </Button>
          <Button
            onClick={() => handleTabChange("book")}
            sx={{
              backgroundColor: activeTab === "book" ? "#3565DD" : "transparent",
              color: activeTab === "book" ? "white" : "text.primary",
              borderRadius: "5px",
              width: isMobile ? "100%" : "180px", // Full width on mobile
              height: "30px",
              textTransform: "none",
              boxShadow: activeTab === "book" ? 2 : "none",
            }}
          >
            Search By Book List
          </Button>
        </Box>

        {/* Render the active tab content */}
        {activeTab === "phone" && (
          <PhoneNumberSearch setSelectedIssue={setSelectedIssue} />
        )}
        {activeTab === "book" && (
          <BookNameSearch issues={issues} setSelectedIssue={setSelectedIssue} />
        )}

        <ReturnDialog
          selectedIssue={selectedIssue}
          setSelectedIssue={setSelectedIssue}
          handleReturnBook={handleReturnBook}
          handleDeleteIssue={handleDeleteIssue}
        />
      </Container>
    </ResponsiveDrawer>
  );
}

export default ReturnBooks;
