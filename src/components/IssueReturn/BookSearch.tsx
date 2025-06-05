import React from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface BookSearchProps {
  accessionNo: string;
  setAccessionNo: (value: string) => void;
  handleSearch: () => void;
}

function BookSearch({
  accessionNo,
  setAccessionNo,
  handleSearch,
}: BookSearchProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Grid container justifyContent="center" sx={{ mt: 4 }}>
      <Grid
        item
        xs={12}
        sm={10}
        md={6}
        container
        spacing={1}
        direction={isMobile ? "column" : "row"}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={12} sm={8} md={7}>
          <TextField
            placeholder="Search by Accession No"
            variant="outlined"
            fullWidth
            size="small"
            value={accessionNo}
            onChange={(e) => setAccessionNo(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{
              width: isMobile ? "100%" : "330px",
              height: "30px",
              borderRadius: "10px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "7px",
                fontSize: "13px",
                height: "100%",
                border: "1px solid rgba(0, 0, 0, 0.05)", // Almost invisible border (very light)
                boxShadow: "0 1px 4px rgba(0, 0, 0, 0.02)", // Very subtle shadow
              },
              "& .MuiInputLabel-root": {
                fontSize: "13px",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{
                      fontSize: "25px",
                      fontWeight: "bold",
                      marginLeft: "-5px",
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={4} md={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            size="small"
            fullWidth
            sx={{
              fontSize: "13px",
              height: "30px",
              borderRadius: "7px",
              textTransform: "none",
              minWidth: isMobile ? "100%" : "145px",
            }}
          >
            <Typography sx={{ fontSize: "13px" }}>Search</Typography>
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default BookSearch;
