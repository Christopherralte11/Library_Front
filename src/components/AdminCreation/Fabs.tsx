import React from "react";
import { Button } from "@mui/material";

interface Props {
  onClick: () => void;
}

const AddUserButton: React.FC<Props> = ({ onClick }) => {
  return (
    <Button
      variant="contained"
      color="success"
      onClick={onClick}
      sx={{
        height: "30px",
        fontSize: "0.75rem",
        fontWeight: 600,
        fontFamily: "Poppins, sans-serif",
        textTransform: "none",
        borderRadius: "5px",
        ml: "9px",
      }}
    >
      Add User
    </Button>
  );
};

export default AddUserButton;
