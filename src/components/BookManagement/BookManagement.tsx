import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import ResponsiveDrawer from "../../ResponsiveDrawer";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TableComponent from "./TableComponent";
import BookDetailsDialog from "./BookDetailsDialog";
import BookEditDialog from "./BookEditDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import AddBookDialog from "./AddBookDialog";
import Fabs from "./Fabs";
import { api } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { useScanner } from "../useScanner"; // Scanner hook

function BookManagement() {
  const { isAuthenticated, role, token, logout } = useAuth();

  const [book, setBook] = useState({
    accession_no: "",
    class_no: "",
    title_of_the_book: "",
    name_of_the_author: "",
    volume_no: "",
    publisher: "",
    year: "",
    place: "",
    price: "",
    isbn_issn_no: "",
    language: "",
    subject_heading: "",
    no_of_pages_contain: "",
    source: "",
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [addedBooks, setAddedBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBooks();
    } else {
      toast.error("You must be logged in to access this page.");
    }
  }, [isAuthenticated]);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${api}/books/all_books`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.Status === true) {
        setAddedBooks(data.Books);
      } else {
        toast.error("Failed to fetch books: " + data.Error);
      }
    } catch (error) {
      toast.error("Error fetching books: " + error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBook({
      ...book,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${api}/books/add_book`, book, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.Status === true) {
        toast.success("Book added successfully!");
        fetchBooks();
        setBook({
          accession_no: "",
          class_no: "",
          title_of_the_book: "",
          name_of_the_author: "",
          volume_no: "",
          publisher: "",
          year: "",
          place: "",
          price: "",
          isbn_issn_no: "",
          language: "",
          subject_heading: "",
          no_of_pages_contain: "",
          source: "",
        });
        setOpenDialog(false);
      } else {
        toast.error("Failed to add book: " + response.data.Error);
      }
    } catch (error) {
      toast.error("Error adding book: " + error);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleRowClick = (book: any) => {
    setSelectedBook(book);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setTimeout(() => {
      setSelectedBook(null);
    }, 300);
  };

  const handleEditClick = () => {
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedBook({ ...selectedBook, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    try {
      const response = await axios.put(
        `${api}/books/edit_book/${selectedBook.id}`,
        selectedBook,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.Status === true) {
        toast.success("Book updated successfully!");
        setAddedBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.id === selectedBook.id ? selectedBook : book
          )
        );
        handleCloseEditDialog();
        handleCloseDetailsDialog();
      } else {
        toast.error("Failed to update book: " + response.data.Error);
      }
    } catch (error) {
      toast.error("Error updating book: " + error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${api}/books/delete_book/${selectedBook.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.Status === true) {
        toast.success("Book deleted successfully!");
        fetchBooks();
        handleCloseDetailsDialog();
        handleDeleteClose();
      } else {
        toast.error("Failed to delete book: " + response.data.Error);
      }
    } catch (error) {
      toast.error("Error deleting book: " + error);
    }
  };

  const handleDeleteOpen = () => setOpen(true);
  const handleDeleteClose = () => setOpen(false);

  const handleExport = () => {
    axios
      .get(`${api}/books/export_books`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "books.xlsx");
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error("Error exporting file:", error);
      });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    toast.loading("Importing books...");

    axios
      .post(`${api}/books/import_books`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        toast.dismiss();
        if (response.data.Status === true) {
          toast.success("Books imported successfully!");
          fetchBooks();
        } else {
          toast.error("Failed to import books: " + response.data.Error);
        }
      })
      .catch((error) => {
        toast.dismiss();
        console.error("Error importing file:", error);
        toast.error("Error importing file");
      });
  };

  // Scanner logic - updates accession_no and opens AddBookDialog
  useScanner({
    onAccessionScan: (accessionNo) => {
      setBook((prev) => ({
        ...prev,
        accession_no: accessionNo,
      }));
      setOpenDialog(true);
    },
  });

  if (!isAuthenticated) {
    return (
      <Box sx={{ padding: 3, mt: 10 }}>
        <Typography variant="h6" color="error" align="center">
          You must be logged in to view this page.
        </Typography>
      </Box>
    );
  }

  return (
    <ResponsiveDrawer>
      <Box sx={{ padding: 3, height: "100%", width: "100%", mt: "50px" }}>
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
            cursor: "pointer",
            mt: "-25px",
            ml: "-40px",
          }}
          onClick={() => window.history.back()}
        >
          <IconButton sx={{ color: "#ffffff", marginLeft: "-15px" }}>
            <ArrowBackIcon sx={{ fontSize: "20px" }} />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 500, fontSize: "13px" }}>
            Book Management
          </Typography>
        </Box>

        <Fabs
          handleOpenDialog={handleOpenDialog}
          handleExport={handleExport}
          handleImport={handleImport}
        />
        <TableComponent
          addedBooks={addedBooks}
          handleRowClick={handleRowClick}
        />
        <BookDetailsDialog
          open={openDetailsDialog}
          selectedBook={selectedBook}
          handleClose={handleCloseDetailsDialog}
          handleEditClick={handleEditClick}
          handleDeleteOpen={handleDeleteOpen}
        />
        <BookEditDialog
          open={openEditDialog}
          selectedBook={selectedBook}
          handleClose={handleCloseEditDialog}
          handleEditChange={handleEditChange}
          handleEditSubmit={handleEditSubmit}
        />
        <DeleteConfirmationDialog
          open={open}
          handleClose={handleDeleteClose}
          handleDelete={handleDelete}
        />
        <AddBookDialog
          open={openDialog}
          book={book}
          handleCloseDialog={handleCloseDialog}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </Box>
      <Toaster position="top-center" />
    </ResponsiveDrawer>
  );
}

export default BookManagement;
