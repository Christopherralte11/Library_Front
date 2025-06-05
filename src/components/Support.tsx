import React from "react";
import ResponsiveDrawer from "../ResponsiveDrawer";
import { Box, Typography, Button } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneIcon from "@mui/icons-material/Phone";

function Support() {
  return (
    <ResponsiveDrawer>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Image Section */}
        <Box
          sx={{
            flexGrow: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="/support1-CDZvSYvb.png"
            alt="Support"
            style={{
              width: "30vh",
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </Box>

        {/* First Text: "Hi, How can we help?" */}
        <Typography
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: "bold",
            fontSize: "14px",
            marginTop: "16px",
          }}
        >
          Hi, How can we help?
        </Typography>

        {/* Second Text: "You can watch tutorial videos from the button below." */}
        <Typography
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: "normal",
            fontSize: "13px",
            marginTop: "8px",
          }}
        >
          You can watch tutorial videos from the button below.
        </Typography>

        {/* Tutorial Button */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: "red",
            color: "white",
            marginTop: "30px",
            fontSize: "13px",
            textTransform: "none",
            padding: "3px 12px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            "&:hover": {
              backgroundColor: "darkred",
            },
            fontFamily: "Poppins, sans-serif",
            borderRadius: "8px",
          }}
          href="/tutorial"
        >
          <PlayArrowIcon fontSize="small" />
          Tutorial
        </Button>

        {/* Or Text */}
        <Typography
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: "bold",
            fontSize: "14px",
            marginTop: "16px",
          }}
        >
          Or
        </Typography>

        {/* "You can contact one of Hereus agent below" */}
        <Typography
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "13px",
            marginTop: "8px",
          }}
        >
          You can contact one of Hereus agent below
        </Typography>
        <Typography
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "13px",
            marginTop: "2px",
          }}
        >
          By dropping a message at WhatsApp or Call us by clicking one of the
        </Typography>
        <Typography
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "13px",
            marginTop: "2px",
          }}
        >
          buttons below{" "}
        </Typography>
        <Typography
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "13px",
            marginTop: "2px",
          }}
        >
          Service hour: <b>10 AM to 5 PM</b>
        </Typography>

        {/* Dotted Line Box */}
        <Box
          sx={{
            border: "1px dashed blue", // 1px dashed blue border
            borderRadius: "10px",
            padding: "16px",
            marginTop: "24px",
            width: "230px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px", // General gap between elements
          }}
        >
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "12px",
              textAlign: "left",
              width: "100%",
              marginBottom: "-8px", // Reduced margin to -4px for tighter spacing
            }}
          >
            Hereus Agent
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "15px",
              textAlign: "left",
              width: "100%",
              marginBottom: "-8px", // Reduced margin to -4px
            }}
          >
            Freddie Sailo
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "18px",
              fontWeight: "bold",
              textAlign: "left",
              width: "100%",
              marginBottom: "-2px", // Slightly larger margin before buttons for balance
            }}
          >
            8014125849
          </Typography>

          {/* WhatsApp Heading */}
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "12px",
              fontWeight: "bold",
              textAlign: "left",
              width: "100%",
              marginBottom: "-4px", // Reduced margin to -4px
            }}
          >
            Chat on WhatsApp
          </Typography>
          <Button
            variant="outlined"
            sx={{
              color: "green",
              borderColor: "green",
              textTransform: "none",
              fontSize: "12px",
              fontFamily: "Poppins, sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              borderRadius: "10px",
              width: "200px",
              "&:hover": {
                backgroundColor: "rgba(0, 128, 0, 0.1)",
                borderColor: "green",
              },
            }}
            href="https://wa.me/8014125849"
            target="_blank"
          >
            <WhatsAppIcon fontSize="small" />
            WhatsApp
          </Button>

          {/* Phone Heading */}
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "12px",
              fontWeight: "bold",
              textAlign: "left",
              width: "100%",
              marginBottom: "-4px", // Reduced margin to -4px
            }}
          >
            Phone Call
          </Typography>
          <Button
            variant="outlined"
            sx={{
              color: "blue",
              borderColor: "blue",
              textTransform: "none",
              fontSize: "12px",
              fontFamily: "Poppins, sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              borderRadius: "10px",
              width: "200px",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 255, 0.1)",
                borderColor: "blue",
              },
            }}
            href="tel:+8014125849"
          >
            <PhoneIcon fontSize="small" />
            Phone
          </Button>
        </Box>
      </Box>
    </ResponsiveDrawer>
  );
}

export default Support;
