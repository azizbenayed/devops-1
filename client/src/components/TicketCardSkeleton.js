import { Card, CardContent, Skeleton, Box } from "@mui/material";

const TicketCardSkeleton = () => (
  <Card
    sx={{
      bgcolor: "#031d2a",
      border: "1px solid oklch(0.382774 0.071686 233.169)",
    }}
  >
    <CardContent>
      <Skeleton variant="text" width="70%" height={32} sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
      <Box sx={{ mt: 1 }}>
        <Skeleton variant="text" width="40%" sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
      </Box>
      <Skeleton
        variant="rounded"
        width="30%"
        height={28}
        sx={{ mt: 2, bgcolor: "rgba(255,255,255,0.1)" }}
      />
    </CardContent>
  </Card>
);

export default TicketCardSkeleton;
