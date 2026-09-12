import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import Layout from "../front/Layout";
import useFetchData from "../../hooks/useFetchData";
import { Container } from "@mui/material";
import EmptyState from "../../components/EmptyState";

const STATUS_COLORS = {
  created: "info",
  "awaiting:payment": "warning",
  complete: "success",
  cancelled: "error",
};

const Dashboard = () => {
  const { data, loading } = useFetchData("/api/orders");

  return (
    <Layout>
      <Container sx={{ pt: 5, pb: 5 }}>
        <h2>My orders:</h2>

        {loading ? (
          <Skeleton variant="rounded" height={220} />
        ) : !data || data.length === 0 ? (
          <EmptyState
            icon={<ReceiptLongIcon sx={{ fontSize: 56, mb: 2, opacity: 0.6, color: "#031d2a" }} />}
            title="You don't have any orders yet"
            subtitle="Tickets you buy will show up here, along with their payment status."
          />
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="orders table">
              <TableHead>
                <TableRow>
                  <TableCell>Order Id</TableCell>
                  <TableCell align="right">Ticket name</TableCell>
                  <TableCell align="right">Price&nbsp;(usd)</TableCell>
                  <TableCell align="right">Payment Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((order) => (
                  <TableRow
                    key={order.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {order.id}
                    </TableCell>
                    <TableCell align="right">{order?.ticket?.title}</TableCell>
                    <TableCell align="right">{order?.ticket?.price}</TableCell>
                    <TableCell align="right">
                      <Chip
                        size="small"
                        label={order?.status}
                        color={STATUS_COLORS[order?.status] || "default"}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Layout>
  );
};

export default Dashboard;
