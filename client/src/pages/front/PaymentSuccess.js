import { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Box, Button, Chip, Container, Skeleton, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Layout from "./Layout";
import useSingle from "../../hooks/useSingle";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { data: order, loading, refetch } = useSingle(
    orderId ? `/api/orders/${orderId}` : ""
  );

  // The order's status is flipped by an event coming through RabbitMQ, so
  // it can lag a beat behind the Stripe redirect landing here. One retry
  // a couple of seconds later is enough to pick up a "complete" status
  // that wasn't there yet on the first load, without polling forever.
  const retried = useRef(false);
  useEffect(() => {
    if (order?.status && order.status !== "complete" && !retried.current) {
      retried.current = true;
      const timer = setTimeout(() => refetch(), 2000);
      return () => clearTimeout(timer);
    }
  }, [order?.status, refetch]);

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
              <CheckCircleIcon sx={{ fontSize: 56, color: "rgb(84 214 44)", mb: 1 }} />
              <Typography variant="h5" sx={{ color: "#fafafa", mb: 1 }}>
                Payment successful
              </Typography>

              {!orderId ? (
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                  Your payment went through. Check your orders for the details.
                </Typography>
              ) : loading ? (
                <Box sx={{ mt: 2 }}>
                  <Skeleton variant="text" width="60%" sx={{ mx: "auto", bgcolor: "rgba(255,255,255,0.1)" }} />
                  <Skeleton variant="text" width="40%" sx={{ mx: "auto", bgcolor: "rgba(255,255,255,0.1)" }} />
                </Box>
              ) : (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" sx={{ color: "#fafafa" }}>
                    {order?.ticket?.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 1.5 }}>
                    ${order?.ticket?.price}
                  </Typography>
                  <Chip
                    size="small"
                    label={order?.status === "complete" ? "Paid" : "Processing payment..."}
                    color={order?.status === "complete" ? "success" : "warning"}
                  />
                </Box>
              )}

              <Box sx={{ mt: 3, display: "flex", gap: 1.5, justifyContent: "center", flexWrap: "wrap" }}>
                <Button
                  component={Link}
                  to="/orders"
                  sx={{ bgcolor: "green", color: "white" }}
                >
                  View my orders
                </Button>
                <Button
                  component={Link}
                  to="/"
                  variant="outlined"
                  sx={{ color: "#fafafa", borderColor: "rgba(255,255,255,0.3)" }}
                >
                  Back to home
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default PaymentSuccess;
