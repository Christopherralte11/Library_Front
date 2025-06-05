import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AuthProvider, useAuth } from "./context/AuthContext"; // Ensure the path is correct

import Login from "./components/Login";
import BookManagement from "./components/BookManagement/BookManagement";
import IssueReturn from "./components/IssueReturn/IssueReturn";
import DuePendingList from "./components/DuePending/DuePendingList";
import AllTransaction from "./components/All Transaction/AllTransaction";
import Support from "./components/Support";
import Tutorial from "./components/Tutorial";
import AdminCreation from "./components/AdminCreation/AdminCreation"; // Import AdminCreation
import Dashboard from "./components/Dashboard/Dashboard";
import ReturnBooks from "./components/ReturnBooks/ReturnBooks";

// Create MUI theme and set Poppins as the default font
const theme = createTheme({
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
});

const AppRoutes = () => {
  const { isAuthenticated } = useAuth(); // Ensure AuthProvider wraps this component

  return (
    <Routes>
      {isAuthenticated ? (
        <>
          <Route path="/" element={<Dashboard />} />
          <Route path="/return" element={<ReturnBooks />} />
          <Route path="/book-management" element={<BookManagement />} />
          <Route path="/issue-return" element={<IssueReturn />} />
          <Route path="/due-pending" element={<DuePendingList />} />
          <Route path="/all-transactions" element={<AllTransaction />} />
          <Route path="/support" element={<Support />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/admin-creation" element={<AdminCreation />} />{" "}
          {/* Added AdminCreation route */}
          <Route path="*" element={<Navigate to="/" replace />} />{" "}
          {/* Redirect unknown routes */}
        </>
      ) : (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />{" "}
          {/* Redirect to login */}
        </>
      )}
    </Routes>
  );
};

const App = () => (
  <AuthProvider>
    <ThemeProvider theme={theme}>
      <Router>
        <AppRoutes /> {/* Now wrapped inside AuthProvider */}
      </Router>
    </ThemeProvider>
  </AuthProvider>
);

export default App;
