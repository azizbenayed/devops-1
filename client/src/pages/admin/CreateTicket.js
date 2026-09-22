import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import AdminLayout from "./AdminLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isValidPrice, isValidQuantity } from "../../utils/validators";

const fieldSx = {
  mb: 3,
  mt: 1,
  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
  "&.Mui-focused": { "& .MuiOutlinedInput-notchedOutline": { border: "none" } },
  input: { background: "#eee" },
};

const CreateTicket = () => {
  const navigate = useNavigate();
  const [ticket, setTicket] = useState({ title: "", price: "", quantity: "1" });
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const errors = {
    title: !ticket.title.trim() ? "A title is required" : "",
    price: !ticket.price
      ? "A price is required"
      : !isValidPrice(ticket.price)
      ? "Price must be a number greater than 0"
      : "",
    quantity: !ticket.quantity
      ? "A quantity is required"
      : !isValidQuantity(ticket.quantity)
      ? "Quantity must be a whole number of at least 1"
      : "",
  };
  const hasErrors = Boolean(errors.title || errors.price || errors.quantity);

  const handleChange = (e) => {
    setTicket((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleTicket = async (e) => {
    e.preventDefault();
    setTouched({ title: true, price: true, quantity: true });
    if (hasErrors || submitting) return;

    setSubmitting(true);
    try {
      const options = {
        method: "POST",
        body: JSON.stringify(ticket),
        headers: { "Content-Type": "application/json" },
      };
      const value = await fetch("/api/tickets", options);

      const res = await value.json();
      if (res && res?.errors) {
        const errorResponse = res?.errors?.map((err) => err.message)?.join(" ");
        toast.error(errorResponse);
        setSubmitting(false);
        return;
      }

      setTicket({ title: "", price: "", quantity: "1" });
      setTouched({});
      toast("Ticket created successfully!");
      setTimeout(() => navigate("/admin"), 800);
    } catch (error) {
      console.log("Error", error);
      toast.error("Something went wrong, please try again.");
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <Box
        sx={{
          bgcolor: "oklch(0.27642 0.055827 233.809)",
          minHeight: "calc(100vh - 140px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#c1c1c1",
        }}
      >
        <Box
          sx={{
            bgcolor: "#031d2a",
            p: "20px 40px",
            border: "1px solid oklch(0.382774 0.071686 233.169)",
            maxWidth: "500px",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="h5"> Sell Ticket</Typography>
          </Box>
          <Box
            component="form"
            noValidate
            onSubmit={handleTicket}
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              sx={fieldSx}
              fullWidth
              id="title"
              name="title"
              placeholder="Ticket title"
              autoFocus
              required
              value={ticket.title}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.title && Boolean(errors.title)}
              helperText={touched.title ? errors.title : ""}
              FormHelperTextProps={{ sx: { color: "#ff8a80", ml: 0 } }}
            />
            <TextField
              sx={fieldSx}
              fullWidth
              id="price"
              name="price"
              placeholder="Ticket price"
              required
              type="number"
              inputProps={{ min: 0, step: "0.01" }}
              value={ticket.price}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.price && Boolean(errors.price)}
              helperText={touched.price ? errors.price : ""}
              FormHelperTextProps={{ sx: { color: "#ff8a80", ml: 0 } }}
            />
            <TextField
              sx={fieldSx}
              fullWidth
              id="quantity"
              name="quantity"
              placeholder="How many can be sold"
              required
              type="number"
              inputProps={{ min: 1, step: "1" }}
              value={ticket.quantity}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.quantity && Boolean(errors.quantity)}
              helperText={
                touched.quantity
                  ? errors.quantity
                  : "How many people can buy this ticket (default 1)"
              }
              FormHelperTextProps={{
                sx: { color: touched.quantity && errors.quantity ? "#ff8a80" : "rgba(255,255,255,0.5)", ml: 0 },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              elevation={0}
              disabled={submitting}
              sx={{
                mt: 3,
                p: 2,
                mb: 2,
                borderRadius: "10px",
                bgcolor: "rgb(252 202 80)",
                color: "#031d2a",
                transition: "all ease 1s",
                "&:hover": { bgcolor: "#fcca50", opacity: 0.8 },
                "&.Mui-disabled": { bgcolor: "rgba(252,202,80,0.5)" },
              }}
            >
              {submitting ? (
                <CircularProgress size={24} sx={{ color: "#031d2a" }} />
              ) : (
                "Create"
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </AdminLayout>
  );
};

export default CreateTicket;
