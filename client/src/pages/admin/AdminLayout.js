import { Box } from "@mui/material";
import AdminHeader from "../../components/AdminHeader";

// The admin back office is a deliberately separate shell from the client
// storefront (front/Layout.js) - own header/nav, own background tone - so
// admins never see the public browse-and-buy UI as part of their normal
// flow.
const AdminLayout = ({ children }) => {
  return (
    <>
      <AdminHeader />
      <Box sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "#1b1f27" }}>
        {children}
      </Box>
    </>
  );
};

export default AdminLayout;
