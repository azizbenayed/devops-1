import AdminLayout from "./AdminLayout";
import OrdersTable from "../../components/OrdersTable";

// Admin's "All orders" view - lives in the separate admin area (own
// header/nav via AdminLayout), distinct from the client's "My orders"
// page even though they share the same table (front/MyOrders.js).
const Dashboard = () => {
  return (
    <AdminLayout>
      <OrdersTable />
    </AdminLayout>
  );
};

export default Dashboard;
