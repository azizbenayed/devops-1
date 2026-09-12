import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import { Link } from "react-router-dom";

export default function TicketCard({ ticket }) {
  return (
    <Card
      sx={{
        bgcolor: "#031d2a",
        border: "1px solid oklch(0.382774 0.071686 233.169)",
        transition: "transform 0.15s ease, border-color 0.15s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          borderColor: "rgb(252 202 80)",
        },
      }}
    >
      <CardActionArea component={Link} to={`/ticket/${ticket.id}`}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
            <LocalActivityIcon sx={{ color: "rgb(252 202 80)", mt: 0.5 }} />
            <Box sx={{ minWidth: 0 }}>
              <Typography
                component="div"
                variant="h6"
                color="white"
                noWrap
                title={ticket.title}
              >
                {ticket.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.6)" }}
              >
                Ticket
              </Typography>
            </Box>
          </Box>
          <Chip
            label={`$${ticket.price}`}
            sx={{
              mt: 2,
              fontWeight: "bold",
              bgcolor: "rgb(252 202 80)",
              color: "#031d2a",
            }}
          />
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
