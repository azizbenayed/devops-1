import { Link, useSearchParams } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import Layout from "./Layout";

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <Layout>
      <Box
        sx={{
          bgcolor: "oklch(0.27642 0.055827 233.809)",
          minHeight: "calc(100vh - 140px)",
        }}
      >
        <Container>
          <Box sx={{ pt: 4, pb: 3, display: "flex", justifyContent: "center" }}>
            <Box
              sx={{
                maxWidth: "500px",
                width: "100%",
                bgcolor: "#031d2a",
                border: "1px solid oklch(0.382774 0.071686 233.169)",
                p: 3,
                textAlign: "center",
              }}
            >
              <CancelIcon sx={{ fontSize: 56, color: "rgb(255 99 99)", mb: 1 }} />
              <Typography variant="h5" sx={{ color: "#fafafa", mb: 1 }}>
                Payment cancelled
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                No charge was made. Your reservation stays on hold until it
                expires, so you can still try to pay again if there's time
                left.
              </Typography>

              <Box sx={{ mt: 3, display: "flex", gap: 1.5, justifyContent: "center", flexWrap: "wrap" }}>
                {orderId && (
                  <Button
                    component={Link}
                    to={`/orders/${orderId}`}
                    sx={{ bgcolor: "green", color: "white" }}
                  >
                    Try again
                  </Button>
                )}
                <Button
                  component={Link}
                  to="/orders"
                  variant="outlined"
                  sx={{ color: "#fafafa", borderColor: "rgba(255,255,255,0.3)" }}
                >
                  View my orders
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default PaymentCancel;
