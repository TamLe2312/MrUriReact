import "./login.css";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
    if (checked) {
      localStorage.setItem("rememberMe", true);
    } else {
      localStorage.removeItem("rememberMe");
    }
  };

  const handleSubmit = async () => {
    const { username, password } = formData;

    try {
      const res = await axios.get(
        `http://localhost:3001/users?username=${username}`
      );

      if (res.data.length > 0) {
        const user = res.data[0];
        // Xác thực mật khẩu
        if (user.password === password) {
          const userData = {
            id: user.id,
            username: user.username,
            role: user.role,
          };
          localStorage.setItem("user", JSON.stringify(userData));
          if (user.role == 0) {
            navigate("/");
          } else {
            navigate("/dashboard");
          }
          toast.success("Sign-in success");
        } else {
          toast.error("Invalid password");
        }
      } else {
        toast.error("User not found");
      }
    } catch (err) {
      console.error(err);
      toast.error("Sign-in failed");
    }
  };
  useEffect(() => {
    const rememberMe = localStorage.getItem("rememberMe");
    if (rememberMe) {
      setFormData({ ...formData, rememberMe: true });
    }
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://source.unsplash.com/random?wallpapers)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <div className="container formContainer">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="rememberMe">
                  Check me out
                </label>
              </div>
              <button onClick={handleSubmit} className="btn btn-primary">
                Submit
              </button>
              <div className="redirectContainer">
                <Link to="/forgot-password">Forgot Password?</Link>
                <Link to="/sign-up">Don't have an account? Sign Up</Link>
              </div>
            </div>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};
export default SignIn;
