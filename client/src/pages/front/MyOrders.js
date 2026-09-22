import { Navigate } from "react-router-dom";
import Layout from "./Layout";
import OrdersTable from "../../components/OrdersTable";
import { useAuth } from "../../context/AuthContext";

// Client's "My orders" page, in the regular storefront shell. See
// admin/Dashboard.js for the admin equivalent - they share the OrdersTable
// component, but the backend and the layout around it differ per role.
const MyOrders = () => {
  const { user } = useAuth();

  // Keep an admin who ends up on this URL in their own area instead of
  // rendering the admin's order list inside the client's storefront shell.
  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return (
    <Layout>
      <OrdersTable />
    </Layout>
  );
};

export default MyOrders;
