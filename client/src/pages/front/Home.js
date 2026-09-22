import { useMemo, useState } from "react";
import {
  Box,
  Container,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Navigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import TicketCard from "../../components/TicketCard";
import TicketCardSkeleton from "../../components/TicketCardSkeleton";
import EmptyState from "../../components/EmptyState";
import Layout from "./Layout";
import useFetchData from "../../hooks/useFetchData";
import { useAuth } from "../../context/AuthContext";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const fieldSx = {
  "& .MuiOutlinedInput-notchedOutline": { border: "1px solid rgba(255,255,255,0.15)" },
  "& .MuiOutlinedInput-root": {
    bgcolor: "#031d2a",
    color: "#fafafa",
  },
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
};

const Home = () => {
  const { user } = useAuth();
  const { data, loading } = useFetchData("/api/tickets");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const tickets = useMemo(() => {
    let list = Array.isArray(data) ? [...data] : [];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((ticket) => ticket.title?.toLowerCase().includes(q));
    }

    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        // MongoDB ObjectIds sort chronologically as strings, so this
        // gives us "most recently created first" without needing a
        // dedicated createdAt field on the backend.
        list.sort((a, b) => String(b.id).localeCompare(String(a.id)));
        break;
    }

    return list;
  }, [data, search, sortBy]);

  // Admins live in the separate admin area - they never buy tickets, so
  // there's nothing for them to do on the public storefront home. This
  // has to come after every hook above (Rules of Hooks: hooks must run
  // unconditionally on every render).
  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

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
            <h2 style={{ color: "#fafafa", marginBottom: "16px" }}>
              Tickets for sale
            </h2>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                mb: 3,
              }}
            >
              <TextField
                placeholder="Search tickets by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ ...fieldSx, flex: "1 1 260px" }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "rgba(255,255,255,0.5)" }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                select
                label="Sort by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                sx={{ ...fieldSx, minWidth: 200 }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {loading ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 2,
                }}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <TicketCardSkeleton key={i} />
                ))}
              </Box>
            ) : tickets.length === 0 ? (
              <EmptyState
                title={
                  search
                    ? "No tickets match your search"
                    : "No tickets for sale right now"
                }
                subtitle={
                  search
                    ? "Try a different keyword, or clear the search to see every ticket."
                    : "Check back later, or sell your own ticket from the menu."
                }
              />
            ) : (
              <>
                <Typography sx={{ color: "rgba(255,255,255,0.6)", mb: 2 }}>
                  {tickets.length} ticket{tickets.length > 1 ? "s" : ""} available
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: 2,
                  }}
                >
                  {tickets.map((ticket) => (
                    <TicketCard ticket={ticket} key={ticket.id} />
                  ))}
                </Box>
              </>
            )}
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default Home;
