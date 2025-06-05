import React from "react";
import { Box, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";

interface LinkData {
  title: string;
  links: { href: string; label: string; imgSrc: string; description: string }[];
}

const DashboardLinks: React.FC = () => {
  const linkSections: LinkData[] = [
    {
      title: "Book Issue and Return",
      links: [
        {
          href: "/issue-return",
          label: "Issue Books",
          imgSrc: "issueandreturn.png",
          description: "Issue a books",
        },
        {
          href: "/return",
          label: "Return Books",
          imgSrc: "alltransactions.png",
          description: "Return a book",
        },
      ],
    },
    {
      title: "Library Book Due and Transaction",
      links: [
        {
          href: "/all-transactions",
          label: "Transaction History",
          imgSrc: "overallattendance.png",
          description: "View all book Transaction History",
        },
        {
          href: "/due-pending",
          label: "Due and Pending List",
          imgSrc: "returnpending.png",
          description: "View Due or Pending List",
        },
      ],
    },
    {
      title: "Library Management",
      links: [
        {
          href: "/book-management",
          label: "Book Management",
          imgSrc: "bookmanagement.png",
          description: "Manage Library Books Inventory",
        },
      ],
    },
    {
      title: "Admin Access",
      links: [
        {
          href: "/admin-creation",
          label: "Admin Creation",
          imgSrc: "admin.png",
          description: "Add or Manage Admins",
        },
      ],
    },
  ];

  return (
    <>
      {linkSections.map((section, index) => {
        const isLastSection = index === linkSections.length - 1;

        return (
          <Box
            key={index}
            sx={{
              marginTop: index > 0 ? 2 : 0,
              paddingBottom: isLastSection ? "30px" : 0, // Add bottom padding to last section
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: 2,
                mt: 5,
              }}
            >
              <DashboardIcon sx={{ marginRight: 1 }} />
              <Typography
                sx={{ fontSize: "15px", mb: "-4px", fontWeight: "bold" }}
                gutterBottom
              >
                {section.title}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                gap: 2,
                pl: 4,
                minHeight: "130px",
              }}
            >
              {section.links.map((link, idx) => (
                <Box
                  key={idx}
                  component="a"
                  href={link.href}
                  sx={{
                    padding: 2,
                    borderRadius: "10px",
                    backgroundColor: "#DFE6FF",
                    color: "#000",
                    textAlign: "left",
                    textDecoration: "none",
                    width: "287px",
                    height: "120px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    "&:hover": {
                      backgroundColor: "#B5C5FF",
                    },
                    "@media (max-width: 600px)": {
                      width: "100%",
                    },
                  }}
                >
                  <img
                    src={link.imgSrc}
                    alt={link.label}
                    style={{
                      maxWidth: "40px",
                      maxHeight: "40px",
                      marginBottom: "8px",
                    }}
                  />
                  <Typography sx={{ fontWeight: "bold" }}>
                    {link.label}
                  </Typography>
                  <Typography sx={{ fontSize: "12px", color: "gray" }}>
                    {link.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        );
      })}
    </>
  );
};

export default DashboardLinks;
