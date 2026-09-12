import { Box, Button, Chip, Container, IconButton, Skeleton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import Layout from "./Layout";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import useSingle from "../../hooks/useSingle";
import EmptyState from "../../components/EmptyState";
import { toast } from "react-toastify";

const SingleTicket = () => {
  const { id } = useParams();
  const { data, loading, error } = useSingle(`/api/tickets/${id}`);
  const navigate = useNavigate();
  const [buying, setBuying] = useState(false);

  const createOrder = async () => {
    if (buying) return; // guard against double-clicks
    setBuying(true);
    try {
      const order = await fetch("/api/orders", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ ticketId: id }),
      });
      const res = await order.json();
      if (res && res?.errors) {
        const errorResponse = res?.errors?.map((err) => err.message)?.join(" ");
        toast.error(errorResponse);
        setBuying(false);
        return;
      }
      toast("Order created");

      setTimeout(() => {
        navigate(`/orders/${res.id}`);
      }, 800);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong, please try again.");
      setBuying(false);
    }
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
            <IconButton
              onClick={() => navigate(-1)}
              sx={{ color: "#fafafa", mb: 1 }}
              aria-label="go back"
            >
              <ArrowBackIcon />
            </IconButton>

            {loading ? (
              <Box
                sx={{
                  maxWidth: "600px",
                  bgcolor: "#031d2a",
                  border: "1px solid oklch(0.382774 0.071686 233.169)",
                  p: 2,
                }}
              >
                <Skeleton variant="text" width="60%" height={40} sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
                <Skeleton variant="text" width="30%" sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
                <Skeleton variant="rounded" width={100} height={36} sx={{ mt: 2, bgcolor: "rgba(255,255,255,0.1)" }} />
              </Box>
            ) : error || !data?.id ? (
              <EmptyState
                icon={<LocalActivityIcon sx={{ fontSize: 56, mb: 2, opacity: 0.6 }} />}
                title="This ticket doesn't exist (or was already sold)"
                subtitle="It may have been removed or purchased by someone else."
              />
            ) : (
              <Box
                sx={{
                  maxWidth: "600px",
                  bgcolor: "#031d2a",
                  border: "1px solid oklch(0.382774 0.071686 233.169)",
                  p: 2,
                }}
              >
                <Typography variant="h5" component="div" sx={{ color: "#fafafa" }}>
                  {data.title}
                </Typography>
                <Chip
                  label={`$${data.price}`}
                  sx={{
                    mt: 1,
                    mb: 2,
                    fontWeight: "bold",
                    bgcolor: "rgb(252 202 80)",
                    color: "#031d2a",
                  }}
                />
                <Box>
                  <Button
                    onClick={createOrder}
                    disabled={buying}
                    sx={{
                      bgcolor: "green",
                      color: "white",
                      "&.Mui-disabled": { bgcolor: "rgba(0,128,0,0.5)", color: "white" },
                    }}
                  >
                    {buying ? "Processing..." : "Buy"}
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default SingleTicket;
