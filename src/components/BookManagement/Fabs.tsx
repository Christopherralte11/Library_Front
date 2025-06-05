import React, { useRef } from "react";
import { Box, Button, useMediaQuery, Theme } from "@mui/material";

function Fabs({
  handleOpenDialog,
  handleExport,
  handleImport,
}: {
  handleOpenDialog: () => void;
  handleExport: () => void;
  handleImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if the screen size is mobile
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: 1,
        position: "static", // no fixed or relative positioning needed
        alignItems: "center",
        width: "100%",
        flexWrap: "wrap", // optional: prevent overflow if buttons are too wide
        marginTop: "50px",
        mb: isMobile ? "-70px" : "-20px",
        mt: isMobile ? "0" : "-5px",
      }}
    >
      {/* Add New Book Button */}
      <Button
        size="small"
        aria-label="add-new-book"
        onClick={handleOpenDialog}
        sx={{
          backgroundColor: "#388e3c", // Darker green color for better visibility
          color: "white",
          textTransform: "none", // Prevent text transformation
          borderRadius: "5px", // 5px border radius
          width: isMobile ? "60%" : "150px", // Set button width to 60% on mobile
          ml: "-2px",
        }}
      >
        Add New Book
      </Button>

      {/* Right-aligned buttons container with slight adjustment */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row", // Stack buttons vertically on mobile
          gap: 1,
          marginLeft: isMobile ? "0" : "auto", // Align buttons to the left on desktop
          width: isMobile ? "100%" : "auto", // Make the container full width on mobile
          alignItems: "center", // Center buttons on mobile layout
        }}
      >
        {/* Export Button (Export Book) */}
        <Button
          size="small"
          aria-label="export-book"
          onClick={handleExport}
          sx={{
            backgroundColor: "#1976d2", // Darker blue color for the primary button
            color: "white",
            textTransform: "none", // Prevent text transformation
            borderRadius: "5px", // 5px border radius
            width: isMobile ? "60%" : "130px", // Set button width to 60% on mobile
          }}
        >
          Export Book
        </Button>

        {/* Import Button (Upload Book Using Excel) */}
        <Button
          size="small"
          aria-label="upload-book-excel"
          onClick={() => fileInputRef.current?.click()} // Trigger file input
          sx={{
            backgroundColor: "#212121", // Darker black color for more emphasis
            color: "white",
            textTransform: "none", // Prevent text transformation
            borderRadius: "5px", // 5px border radius
            width: isMobile ? "60%" : "200px", // Set button width to 60% on mobile
          }}
        >
          Upload Book Using Excel
        </Button>
      </Box>

      {/* Hidden File Input for Importing */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".xlsx, .xls"
        onChange={handleImport}
      />
    </Box>
  );
}

export default Fabs;
