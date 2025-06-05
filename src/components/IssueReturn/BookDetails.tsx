import React from "react";
import {
  Typography,
  Box,
  Button,
  Stack,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";

interface BookDetailsProps {
  bookDetails: {
    title_of_the_book: string;
    name_of_the_author: string;
    accession_no: string;
  };
  onIssueClick: () => void;
  onRemoveClick: () => void;
}

function BookDetails({
  bookDetails,
  onIssueClick,
  onRemoveClick,
}: BookDetailsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        marginTop: "32px",
        padding: "16px",
        border: "1px dashed #000",
        borderRadius: "10px",
        maxWidth: "490px",
        marginX: "auto", // Center horizontally
        textAlign: "left",
        borderColor: "primary.main",
        display: "flex",
        flexDirection: "column",
        ...(isMobile ? {} : { marginLeft: "335px" }), // Adjust marginLeft to move it right
      }}
    >
      {/* Book Details Heading */}
      <Typography
        sx={{
          fontSize: "16px",
          fontWeight: "bold",
          marginBottom: "16px",
        }}
      >
        Book Details
      </Typography>

      <Grid container spacing={1}>
        {/* Title, Author, Accession No. */}
        <Grid item xs={5}>
          <Typography sx={{ fontSize: "13px" }}>Title</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography sx={{ fontSize: "13px" }}>:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={{ fontSize: "13px", textAlign: "left" }}>
            {bookDetails.title_of_the_book}
          </Typography>
        </Grid>

        {/* Author */}
        <Grid item xs={5}>
          <Typography sx={{ fontSize: "13px" }}>Author</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography sx={{ fontSize: "13px" }}>:</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "left" }}>
          <Typography sx={{ fontSize: "13px" }}>
            {bookDetails.name_of_the_author}
          </Typography>
        </Grid>

        {/* Accession No. */}
        <Grid item xs={5}>
          <Typography sx={{ fontSize: "13px" }}>Accession No.</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography sx={{ fontSize: "13px" }}>:</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "left" }}>
          <Typography sx={{ fontSize: "13px" }}>
            {bookDetails.accession_no}
          </Typography>
        </Grid>
      </Grid>

      {/* Buttons */}
      <Stack
        direction="row"
        spacing={1}
        justifyContent="flex-end" // Align buttons to the right
        sx={{ marginTop: "25px", mb: "-5px" }}
      >
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={onIssueClick}
          sx={{
            textTransform: "none",
            borderRadius: "7px",
            fontSize: "13px",
            width: "123px",
            height: "30px",
          }}
        >
          Issue
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={onRemoveClick}
          sx={{
            textTransform: "none",
            borderRadius: "7px",
            fontSize: "13px",
            width: "123px",
            height: "30px",
            backgroundColor: "#FF0606",
          }}
        >
          Remove
        </Button>
      </Stack>
    </Box>
  );
}

export default BookDetails;
