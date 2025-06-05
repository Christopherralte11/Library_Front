import React, { useState, useEffect } from "react";
import ResponsiveDrawer from "../../ResponsiveDrawer";
import axios from "axios";
import dayjs from "dayjs";
import { Container, Typography } from "@mui/material";
import DuePendingTable from "./DuePendingTable";
import DuePendingDialog from "./DuePendingDialog";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../../api/api";
import { useAuth } from "../../context/AuthContext"; // <-- import here

function DuePendingList() {
  const { token, isAuthenticated } = useAuth(); // get token and auth status

  const [issues, setIssues] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [selectedIssue, setSelectedIssue] = useState<any | null>(null);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchIssues();
    } else {
      setError("You are not authenticated. Please login.");
    }
  }, [isAuthenticated, token]);

  const fetchIssues = async () => {
    try {
      const response = await axios.get(`${api}/issues/all_issues`, {
        headers: {
          Authorization: `Bearer ${token}`, // pass token in headers for protected routes
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
        setError("");
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

  return (
    <ResponsiveDrawer>
      <Toaster /> {/* This ensures toast notifications appear */}
      <Container
        maxWidth={false}
        sx={{ padding: 3, height: "100%", width: "100%", mt: "50px" }}
      >
        {error && <Typography color="error">{error}</Typography>}

        <DuePendingTable issues={issues} setSelectedIssue={setSelectedIssue} />

        <DuePendingDialog
          selectedIssue={selectedIssue}
          setSelectedIssue={setSelectedIssue}
          handleReturnBook={handleReturnBook}
          handleDeleteIssue={handleDeleteIssue}
        />
      </Container>
    </ResponsiveDrawer>
  );
}

export default DuePendingList;
