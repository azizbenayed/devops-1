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
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const isAdmin = user?.role === "admin";
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
      navigate("/");
    }
  };

  // Same set of links drives both the desktop bar and the mobile menu, so
  // they can never drift apart (this used to be two separate hand-written
  // lists and the mobile one never actually navigated anywhere).
  const navLinks = isAuthenticated
    ? [
        { name: isAdmin ? "All orders" : "My orders", to: "/admin/orders" },
        ...(isAdmin ? [{ name: "Sell ticket", to: "/create/ticket" }] : []),
        { name: "Profile", to: "/profile" },
      ]
    : [
        { name: "Sign In", to: "/sign-in" },
        { name: "Sign Up", to: "/sign-up" },
      ];

  return (
    <AppBar position="static" sx={{ bgcolor: "#031d2a" }}>
      <Container>
        <Toolbar disableGutters>
          <BookOnlineIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Ticket System
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="open navigation menu"
              aria-controls="menu-appbar-nav"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar-nav"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <MenuItem
                component={Link}
                to="/"
                onClick={handleCloseNavMenu}
              >
                <Typography sx={{ textAlign: "center" }}>Home</Typography>
              </MenuItem>
              {navLinks.map((page) => (
                <MenuItem
                  key={page.name}
                  component={Link}
                  to={page.to}
                  onClick={handleCloseNavMenu}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    {page.name}
                  </Typography>
                </MenuItem>
              ))}
              {isAuthenticated && (
                <MenuItem onClick={logOutMethod}>
                  <Typography sx={{ textAlign: "center" }}>Log Out</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>
          <BookOnlineIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Ticket System
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              component={Link}
              to="/"
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Home
            </Button>
            {navLinks
              .filter((l) => l.name !== "Profile")
              .map((page) => (
                <Button
                  key={page.name}
                  component={Link}
                  to={page.to}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page.name}
                </Button>
              ))}
            {isAuthenticated && (
              <Button
                onClick={logOutMethod}
                sx={{ my: 2, color: "white", display: "block", cursor: "pointer" }}
              >
                Log Out
              </Button>
            )}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={isAuthenticated ? user?.email ?? "Account" : "Account"}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: "rgb(252 202 80)", color: "#031d2a" }}>
                  {isAuthenticated && user?.email
                    ? user.email[0].toUpperCase()
                    : "?"}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar-user"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {isAuthenticated
                ? [
                    <MenuItem
                      key="profile"
                      component={Link}
                      to="/profile"
                      onClick={handleCloseUserMenu}
                    >
                      Profile
                    </MenuItem>,
                    <MenuItem
                      key="orders"
                      component={Link}
                      to="/admin/orders"
                      onClick={handleCloseUserMenu}
                    >
                      {isAdmin ? "All Orders" : "My Orders"}
                    </MenuItem>,
                    ...(isAdmin
                      ? [
                          <MenuItem
                            key="sell"
                            component={Link}
                            to="/create/ticket"
                            onClick={handleCloseUserMenu}
                          >
                            Sell a ticket
                          </MenuItem>,
                        ]
                      : []),
                    <Divider key="divider" />,
                    <MenuItem
                      key="logout"
                      onClick={() => {
                        handleCloseUserMenu();
                        logOutMethod();
                      }}
                    >
                      Log Out
                    </MenuItem>,
                  ]
                : [
                    <MenuItem
                      key="signin"
                      component={Link}
                      to="/sign-in"
                      onClick={handleCloseUserMenu}
                    >
                      Sign In
                    </MenuItem>,
                    <MenuItem
                      key="signup"
                      component={Link}
                      to="/sign-up"
                      onClick={handleCloseUserMenu}
                    >
                      Sign Up
                    </MenuItem>,
                  ]}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;
