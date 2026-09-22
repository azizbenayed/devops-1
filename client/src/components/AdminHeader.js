import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

// The admin side of the app is a separate area from the client storefront
// (own nav, own entry point after login) - this bar is deliberately
// styled differently (dark slate + teal instead of the storefront's
// navy + gold) so it reads as a distinct back office at a glance, not
// just the same header with a couple of extra links.
const ADMIN_ACCENT = "#4fd1c5";

const navLinks = [
  { name: "All orders", to: "/admin" },
  { name: "Sell ticket", to: "/admin/sell" },
];

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const logOutMethod = async () => {
    try {
      await fetch("/api/users/signout", { method: "POST" });
    } catch (error) {
      console.log(error);
    } finally {
      logout();
      handleCloseNavMenu();
      handleCloseUserMenu();
      toast("Log out successfully!");
      navigate("/sign-in");
    }
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "#14181f", borderBottom: `1px solid ${ADMIN_ACCENT}33` }}>
      <Container>
        <Toolbar disableGutters>
          <AdminPanelSettingsIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1, color: ADMIN_ACCENT }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/admin"
            sx={{
              mr: 1,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".2rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Ticket System
          </Typography>
          <Chip
            label="ADMIN"
            size="small"
            sx={{
              display: { xs: "none", md: "flex" },
              mr: 2,
              bgcolor: `${ADMIN_ACCENT}22`,
              color: ADMIN_ACCENT,
              fontWeight: "bold",
              letterSpacing: "0.05rem",
            }}
          />

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="open navigation menu"
              aria-controls="admin-menu-appbar-nav"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="admin-menu-appbar-nav"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {navLinks.map((page) => (
                <MenuItem
                  key={page.name}
                  component={Link}
                  to={page.to}
                  onClick={handleCloseNavMenu}
                >
                  <Typography sx={{ textAlign: "center" }}>{page.name}</Typography>
                </MenuItem>
              ))}
              <MenuItem component={Link} to="/profile" onClick={handleCloseNavMenu}>
                <Typography sx={{ textAlign: "center" }}>Profile</Typography>
              </MenuItem>
              <MenuItem onClick={logOutMethod}>
                <Typography sx={{ textAlign: "center" }}>Log Out</Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Typography
            variant="subtitle1"
            noWrap
            sx={{
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              color: ADMIN_ACCENT,
            }}
          >
            Admin
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {navLinks.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.to}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page.name}
              </Button>
            ))}
            <Button
              onClick={logOutMethod}
              sx={{ my: 2, color: "white", display: "block", cursor: "pointer" }}
            >
              Log Out
            </Button>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={user?.email ?? "Account"}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: ADMIN_ACCENT, color: "#14181f" }}>
                  {user?.email ? user.email[0].toUpperCase() : "?"}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="admin-menu-appbar-user"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem component={Link} to="/profile" onClick={handleCloseUserMenu}>
                Profile
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  handleCloseUserMenu();
                  logOutMethod();
                }}
              >
                Log Out
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AdminHeader;
