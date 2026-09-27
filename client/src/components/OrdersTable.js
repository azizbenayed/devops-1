import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Skeleton from "@mui/material/Skeleton";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Container } from "@mui/material";
import { toast } from "react-toastify";
import useFetchData from "../hooks/useFetchData";
import EmptyState from "./EmptyState";
import { useAuth } from "../context/AuthContext";
import apiFetch from "../utils/api";

const STATUS_COLORS = {
  created: "info",
  "awaiting:payment": "warning",
  complete: "success",
  cancelled: "error",
};

// Only a reservation that hasn't already resolved one way or another is
// worth cancelling - a paid order needs a refund process (out of scope
// here), and a cancelled one has nothing left to cancel.
const isCancellable = (order) =>
  order?.status === "created" || order?.status === "awaiting:payment";

// Orders are only reserved (and only block other buyers) until `expiresAt`.
// Past that point they're either paid, cancelled, or just waiting for the
// expiration worker to catch up and cancel them - surface that instead of
// leaving people guessing from the raw payment status alone.
const getExpiryInfo = (order) => {
  if (order?.status === "complete") {
    return { label: "Paid", color: "success" };
  }
  if (order?.status === "cancelled") {
    return { label: "Expired", color: "error" };
  }
  if (!order?.expiresAt) {
    return { label: "-", color: "default" };
  }
  const isPastExpiration = new Date(order.expiresAt).getTime() <= Date.now();
  return isPastExpiration
    ? { label: "Expired", color: "error" }
    : { label: "Active", color: "warning" };
};

// Shared orders list, used by both the client's "My orders" page and the
// admin's "All orders" page - the backend already decides which orders
// come back (a client's own vs. every order) based on who's asking, so
// this component only needs to render whatever it's given and show the
// buyer's email when there's more than one buyer to tell apart.
const OrdersTable = () => {
  const { data, loading, refetch } = useFetchData("/api/orders");
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [cancellingId, setCancellingId] = useState(null);

  const cancelOrder = async (order) => {
    if (cancellingId) return;
    if (!window.confirm(`Cancel this order for "${order?.ticket?.title}"?`)) {
      return;
    }

    setCancellingId(order.id);
    try {
      const response = await apiFetch(`/api/orders/${order.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`status ${response.status}`);
      }
      toast("Order cancelled");
      refetch();
    } catch (error) {
      console.log(error);
      toast.error("Couldn't cancel this order, please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <Container sx={{ pt: 5, pb: 5 }}>
      <h2 style={{ color: isAdmin ? "#fafafa" : undefined }}>
        {isAdmin ? "All orders:" : "My orders:"}
      </h2>

      {loading ? (
        <Skeleton variant="rounded" height={220} />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={<ReceiptLongIcon sx={{ fontSize: 56, mb: 2, opacity: 0.6, color: "#031d2a" }} />}
          title={isAdmin ? "No orders yet" : "You don't have any orders yet"}
          subtitle={
            isAdmin
              ? "Orders placed by clients will show up here."
              : "Tickets you buy will show up here, along with their payment status."
          }
        />
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="orders table">
            <TableHead>
              <TableRow>
                {isAdmin && <TableCell>Buyer email</TableCell>}
                <TableCell>Ticket name</TableCell>
                <TableCell align="right">Price&nbsp;(usd)</TableCell>
                <TableCell align="right">Payment Status</TableCell>
                <TableCell align="right">Reservation</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((order) => {
                const expiry = getExpiryInfo(order);
                return (
                  <TableRow
                    key={order.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    {isAdmin && (
                      <TableCell component="th" scope="row">
                        {order?.userEmail}
                      </TableCell>
                    )}
                    <TableCell
                      component={isAdmin ? "td" : "th"}
                      scope={isAdmin ? undefined : "row"}
                    >
                      {order?.ticket?.title}
                    </TableCell>
                    <TableCell align="right">{order?.ticket?.price}</TableCell>
                    <TableCell align="right">
                      <Chip
                        size="small"
                        label={order?.status}
                        color={STATUS_COLORS[order?.status] || "default"}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Chip size="small" label={expiry.label} color={expiry.color} />
                    </TableCell>
                    <TableCell align="right">
                      {isCancellable(order) && (
                        <Tooltip title="Cancel order">
                          <span>
                            <IconButton
                              size="small"
                              aria-label="cancel order"
                              disabled={cancellingId === order.id}
                              onClick={() => cancelOrder(order)}
                            >
                              <DeleteOutlineIcon fontSize="small" color="error" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default OrdersTable;
