import { useParams } from "react-router-dom";
import useSingle from "../../hooks/useSingle";
import Layout from "./Layout";
import { Box, Button, Container, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import EmptyState from "../../components/EmptyState";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const ShowOrder = () => {
  const { orderId } = useParams();
  const { data, loading } = useSingle(`/api/orders/${orderId}`);

  const [timeLeft, setTimeLeft] = useState("");
  const [payLoading, setPayLoading] = useState(false);

  useEffect(() => {
    const timefct = () => {
      if (data && data?.expiresAt) {
        const remainingTime = new Date(data?.expiresAt) - new Date();
        setTimeLeft(Math.round(remainingTime / 1000));
      }
    };
    timefct();
    const timer = setInterval(timefct, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [data]);

  const handlePayment = async () => {
    if (payLoading) return;
    setPayLoading(true);
    try {
      const payment = await fetch("/api/payments", {
        method: "POST",
        body: JSON.stringify({
          orderId,
          title: data?.ticket?.title,
          price: data?.ticket?.price,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!payment.ok) {
        throw new Error(`payment status: ${payment.status}`);
      }

      const res = await payment.json();
      if (res?.url) {
        window.location.href = res.url;
        return;
      }
    } catch (error) {
      console.log(error);
    }
    setPayLoading(false);
  };

  return (
    <Layout>
      <Box
        sx={{
          bgcolor: "oklch(0.27642 0.055827 233.809)",
          minHeight: "calc(100vh - 140px)",
        }}
      >
        <Container>
          <Box sx={{ pt: 4, pb: 3 }}>
            {loading ? (
              <Box sx={{ maxWidth: "620px" }}>
                <Skeleton variant="rounded" height={48} sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
                <Skeleton variant="text" width="50%" height={40} sx={{ mt: 2, bgcolor: "rgba(255,255,255,0.1)" }} />
                <Skeleton variant="text" width="30%" sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
              </Box>
            ) : timeLeft < 0 ? (
              <EmptyState
                icon={<AccessTimeIcon sx={{ fontSize: 56, mb: 2, opacity: 0.6 }} />}
                title="This order has expired"
                subtitle="The reservation window ran out before payment was completed. Go back to the ticket to try again."
              />
            ) : (
              <>
                <Box sx={{ maxWidth: "620px" }}>
                  <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                    {timeLeft}s remaining to complete the order
                  </Alert>
                </Box>
                <Box
                  sx={{
                    maxWidth: "600px",
                    bgcolor: "#031d2a",
                    border: "1px solid oklch(0.382774 0.071686 233.169)",
                    p: 2,
                    mt: 2,
                  }}
                >
                  <Typography variant="h5" component="div" sx={{ color: "#fafafa" }}>
                    Title: {data?.ticket?.title}
                  </Typography>
                  <Typography variant="subtitle1" component="div" sx={{ color: "#fafafa" }}>
                    Price: {data?.ticket?.price}
                  </Typography>
                  <Button
                    onClick={handlePayment}
                    disabled={payLoading}
                    sx={{
                      mt: 1,
                      bgcolor: "green",
                      color: "white",
                      "&.Mui-disabled": { bgcolor: "rgba(0,128,0,0.5)", color: "white" },
                    }}
                  >
                    {payLoading ? "Redirecting to payment..." : "Pay"}
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default ShowOrder;
