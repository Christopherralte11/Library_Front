import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ResponsiveDrawer from "../../ResponsiveDrawer";
import axios from "axios";
import DashboardBoxes from "./DashboardBoxes";
import dayjs from "dayjs";
import DashboardLinks from "./DashboardLinks";
import { api } from "../../api/api";
import { useAuth } from "../../context/AuthContext"; // Adjust path if needed

interface Book {
  title_of_the_book: string;
  name_of_the_author: string;
  accession_no: string;
  added_on: string;
}

interface IssuedBook {
  accession_no: string;
  issued_count: number;
}

const Dashboard: React.FC = () => {
  const { isAuthenticated, token, role } = useAuth();

  const [issuedBooks, setIssuedBooks] = useState<IssuedBook[]>([]);
  const [bookList, setBookList] = useState<Book[]>([]);
  const [pendingBooksCount, setPendingBooksCount] = useState<number>(0);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [issuedBooksData, books, pendingCount] = await Promise.all([
          fetchIssuedBooksCount(),
          fetchBookList(),
          fetchPendingBooksCount(),
        ]);

        setIssuedBooks(issuedBooksData);
        setBookList(books);
        setPendingBooksCount(pendingCount);

        let years = Array.from(
          new Set(books.map((book) => dayjs(book.added_on).year().toString()))
        );

        if (!years.includes("2024")) years.push("2024");
        if (!years.includes("2025")) years.push("2025");

        years.sort((a, b) => Number(b) - Number(a));

        setAvailableYears(years);
        if (years.length > 0) {
          setSelectedYear(years[0]);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const fetchIssuedBooksCount = async (): Promise<IssuedBook[]> => {
    try {
      const response = await axios.get(`${api}/issues/issued_books_count`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      return response.data.IssuedBooks ?? [];
    } catch (error: any) {
      console.error("Error fetching issued books count:", error);
      return [];
    }
  };

  const fetchPendingBooksCount = async (): Promise<number> => {
    try {
      const response = await axios.get(`${api}/issues/count_pending_books`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      return Number(response.data.PendingBooksCount) || 0;
    } catch (error: any) {
      console.error("Error fetching pending books data:", error);
      return 0;
    }
  };

  const fetchBookList = async (): Promise<Book[]> => {
    try {
      const response = await axios.get(`${api}/books/all_books`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      return response.data?.Books ?? [];
    } catch (error: any) {
      console.error("Error fetching book list:", error);
      return [];
    }
  };

  const filteredBookList = bookList.filter((book) => {
    const bookYear = dayjs(book.added_on).year().toString();
    const bookMonth = dayjs(book.added_on).format("MM");

    return (
      bookYear === selectedYear &&
      (selectedMonth === "" || bookMonth === selectedMonth)
    );
  });

  const issuedBooksMap = new Map(
    issuedBooks.map((book) => [book.accession_no, Number(book.issued_count)])
  );

  const filteredIssuedBooks = filteredBookList
    .map((book) => Number(issuedBooksMap.get(book.accession_no) || 0))
    .reduce((total, count) => total + count, 0);

  const pendingCount =
    selectedYear === availableYears[0] &&
    (selectedMonth === "" || dayjs().format("MM") === selectedMonth)
      ? pendingBooksCount
      : 0;

  const booksCount = filteredBookList.length;

  return (
    <ResponsiveDrawer>
      <Box sx={{ padding: 0, marginTop: "60px", width: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
          <DashboardIcon sx={{ marginRight: 1 }} />
          <Typography
            sx={{ fontSize: "15px", mb: "-4px", fontWeight: "bold" }}
            gutterBottom
          >
            Dashboard
          </Typography>
        </Box>

        {/* Removed logged in as and logout */}

        <DashboardBoxes
          booksCount={booksCount}
          issuedCount={filteredIssuedBooks}
          pendingCount={pendingCount}
          loading={loading}
        />

        <DashboardLinks />
      </Box>
    </ResponsiveDrawer>
  );
};

export default Dashboard;
