import { Avatar, Box, Chip, Container, Divider, Skeleton, Typography } from "@mui/material";
import Layout from "./Layout";
import useSingle from "../../hooks/useSingle";
import useFetchData from "../../hooks/useFetchData";
import { Link } from "react-router-dom";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const { data: currentUserRes, loading: userLoading } = useSingle(
    "/api/users/currentuser"
  );
  const { data: orders, loading: ordersLoading } = useFetchData("/api/orders");

  const currentUser = currentUserRes?.currentUser;
  const ordersCount = Array.isArray(orders) ? orders.length : 0;
  const completedCount = Array.isArray(orders)
    ? orders.filter((o) => o.status === "complete").length
    : 0;

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
            <h2 style={{ color: "#fafafa", marginBottom: "16px" }}>My profile</h2>

            <Box
              sx={{
                maxWidth: "600px",
                bgcolor: "#031d2a",
                border: "1px solid oklch(0.382774 0.071686 233.169)",
                p: 3,
              }}
            >
              {userLoading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Skeleton variant="circular" width={56} height={56} sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="60%" sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
                    <Skeleton variant="text" width="40%" sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: "rgb(252 202 80)",
                      color: "#031d2a",
                      fontSize: 24,
                    }}
                  >
                    {currentUser?.email ? currentUser.email[0].toUpperCase() : "?"}
                  </Avatar>
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="h6" sx={{ color: "#fafafa" }}>
                        {currentUser?.email || "Unknown user"}
                      </Typography>
                      <Chip
                        size="small"
                        label={isAdmin ? "Admin" : "Client"}
                        sx={{
                          bgcolor: isAdmin ? "rgb(252 202 80)" : "rgba(255,255,255,0.1)",
                          color: isAdmin ? "#031d2a" : "#fafafa",
                          fontWeight: "bold",
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>
                      User ID: {currentUser?.id || "-"}
                    </Typography>
                  </Box>
                </Box>
              )}

              <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.1)" }} />

              <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                <Box>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>
                    Total orders
                  </Typography>
                  {ordersLoading ? (
                    <Skeleton variant="text" width={40} sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
                  ) : (
                    <Typography variant="h5" sx={{ color: "#fafafa" }}>
                      {ordersCount}
                    </Typography>
                  )}
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>
                    Completed purchases
                  </Typography>
                  {ordersLoading ? (
                    <Skeleton variant="text" width={40} sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
                  ) : (
                    <Typography variant="h5" sx={{ color: "#fafafa" }}>
                      {completedCount}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.1)" }} />

              <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                <Chip
                  component={Link}
                  to="/admin/orders"
                  clickable
                  icon={<ReceiptLongIcon />}
                  label="View my orders"
                  sx={{ bgcolor: "rgb(252 202 80)", color: "#031d2a", fontWeight: "bold" }}
                />
                {isAdmin ? (
                  <Chip
                    component={Link}
                    to="/create/ticket"
                    clickable
                    icon={<LocalActivityIcon />}
                    variant="outlined"
                    label="Sell a ticket"
                    sx={{ color: "#fafafa", borderColor: "rgba(255,255,255,0.3)" }}
                  />
                ) : (
                  <Chip
                    component={Link}
                    to="/"
                    clickable
                    icon={<StorefrontIcon />}
                    variant="outlined"
                    label="Browse tickets"
                    sx={{ color: "#fafafa", borderColor: "rgba(255,255,255,0.3)" }}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default Profile;
