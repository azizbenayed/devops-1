import { Box, Typography } from "@mui/material";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

/**
 * Friendly placeholder shown instead of an empty list (no tickets found,
 * no orders yet, a search with no matches, ...).
 */
const EmptyState = ({ title, subtitle, icon }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#fafafa",
        opacity: 0.85,
        py: 8,
      }}
    >
      {icon || <SentimentDissatisfiedIcon sx={{ fontSize: 56, mb: 2, opacity: 0.6 }} />}
      <Typography variant="h6" sx={{ mb: 0.5 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ opacity: 0.7, maxWidth: 360 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default EmptyState;
