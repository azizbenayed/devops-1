import { Box, Grid, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { Link, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { useState } from "react";
import { toast } from "react-toastify";
import { isValidEmail, isValidSignupPassword } from "../../utils/validators";

const fieldSx = {
  mb: 3,
  mt: 1,
  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
  "&.Mui-focused": { "& .MuiOutlinedInput-notchedOutline": { border: "none" } },
  input: { background: "#eee" },
};

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const [user, setUser] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({});

  const errors = {
    email: !user.email
      ? "Email is required"
      : !isValidEmail(user.email)
      ? "Enter a valid email address"
      : "",
    password: !user.password
      ? "Password is required"
      : !isValidSignupPassword(user.password)
      ? "Password must be 4 to 20 characters"
      : "",
  };
  const hasErrors = Boolean(errors.email || errors.password);

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const register = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (hasErrors || submitting) return;

    setSubmitting(true);
    try {
      const options = {
        method: "POST",
        body: JSON.stringify(user),
        headers: { "Content-Type": "application/json" },
      };
      const value = await fetch("/api/users/signup", options);

      const res = await value.json();
      if (res && res?.errors) {
        const errorResponse = res?.errors?.map((err) => err.message)?.join(" ");
        toast.error(errorResponse);
        setSubmitting(false);
        return;
      }

      setUser({ email: "", password: "" });
      toast("Sign Up successfully! You can now sign in.");
      setTimeout(() => navigate("/sign-in"), 800);
    } catch (error) {
      console.log("Error", error);
      toast.error("Something went wrong, please try again.");
      setSubmitting(false);
    }
  };

  return (
    <Layout>
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
            <Typography variant="h5"> SIGN UP</Typography>
          </Box>
          <Box
            component="form"
            noValidate
            onSubmit={register}
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              sx={fieldSx}
              fullWidth
              id="email"
              name="email"
              placeholder="E-mail"
              autoFocus
              required
              value={user.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email ? errors.email : ""}
              FormHelperTextProps={{ sx: { color: "#ff8a80", ml: 0 } }}
            />

            <TextField
              required
              sx={{ ...fieldSx, background: "#eee" }}
              fullWidth
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              placeholder="Password"
              value={user.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password ? errors.password : "4 to 20 characters"}
              FormHelperTextProps={{
                sx: { color: touched.password && errors.password ? "#ff8a80" : "rgba(255,255,255,0.5)", ml: 0 },
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
                "Sign Up"
              )}
            </Button>
            <Grid container>
              <Grid item xs></Grid>
              <Grid item>
                <Link
                  to="/sign-in"
                  variant="body2"
                  style={{
                    color: "oklch(0.382774 0.071686 233.169)",
                    textDecoration: "none",
                  }}
                >
                  {"Already have an account? Login"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default SignUp;
