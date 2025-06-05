import React from "react";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";

interface StatisticsBoxesProps {
  booksCount: number | null;
  issuedCount: number | null;
  pendingCount: number | null;
  loading: boolean;
}

const StatisticsBoxes: React.FC<StatisticsBoxesProps> = ({
  booksCount,
  issuedCount,
  pendingCount,
  loading,
}) => {
  const titles = [
    "Total Books in Library",
    "Total Issued Books",
    "Pending Books",
  ];
  const counts = [booksCount, issuedCount, pendingCount];
  const colors = ["#FFEEDE", "#DFF7FF", "#F7FFDF"]; // Background colors for each box

  return (
    <Grid container spacing={2} justifyContent="flex-start" sx={{ pl: 4 }}>
      {titles.map((title, index) => (
        <Grid item xs={12} sm={4} md={4} lg={2} key={index}>
          <Box
            sx={{
              height: 90, // Smaller height
              backgroundColor: colors[index],
              borderRadius: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start", // Align items to the left
              justifyContent: "center",
              textAlign: "left", // Align text to the left
              padding: 2, // Reduced padding
              width: "100%",
            }}
          >
            {loading ? (
              <CircularProgress />
            ) : (
              <>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {counts[index]}
                </Typography>

                <Typography variant="body2" gutterBottom>
                  {title}
                </Typography>
              </>
            )}
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatisticsBoxes;
