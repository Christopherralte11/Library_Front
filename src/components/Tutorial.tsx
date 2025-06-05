import React from "react";
import ResponsiveDrawer from "../ResponsiveDrawer";
import { Box } from "@mui/material";

const Tutorial = () => {
  return (
    <ResponsiveDrawer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 64px)", // Adjust height to account for header/footer if needed
          textAlign: "center",
          width: "100%", // Ensure full width
        }}
      >
        <img
          src="/construction-BTaxAogI.png"
          alt="Under Construction"
          style={{
            width: "40vh", // Consistent size
            maxWidth: "100%",
            objectFit: "contain",
          }}
        />
      </Box>
    </ResponsiveDrawer>
  );
};

export default Tutorial;
