import "./signup.css";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const [acceptedAccess, setAcceptedAccess] = useState(false);

  const isCheckExist = async () => {
    if (formData.username !== "") {
      const response = await axios.get(
        `http://localhost:3001/users?username=${formData.username}`
      );
      if (response.status === 200) {
        if (response.data.length > 0) {
          return true;
        }
      }
    }
    if (formData.email !== "") {
      const response = await axios.get(
        `http://localhost:3001/users?email=${formData.email}`
      );
      if (response.status === 200) {
        if (response.data.length > 0) {
          return true;
        }
      }
    }
    return false;
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setAcceptedAccess(e.target.checked);
  };

  const passwordsMatchCheck = () => {
    return formData.password === formData.confirmPassword;
  };

  const handleSubmit = async () => {
    if (
      formData.username !== "" &&
      formData.email !== "" &&
      formData.password !== "" &&
      formData.confirmPassword !== "" &&
      acceptedAccess
    ) {
      if (!(await isCheckExist())) {
        if (passwordsMatchCheck()) {
          try {
            const userData = {
              username: formData.username,
              email: formData.email,
              password: formData.password,
              role: "0",
            };
            const response = await axios.post(
              `http://localhost:3001/users`,
              userData
            );
            if (response.status === 201) {
              toast.success("Created Success");
              navigate("/sign-in");
            }
          } catch (error) {
            console.error("Error:", error);
            toast.error("Created Fail");
          }
        } else {
          toast.success("Password must be same");
        }
      } else {
        toast.error("Username or Email existed");
      }
    } else {
      toast.error("All fields required");
    }
  };

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
              Sign up
            </Typography>
            <div className="container formContainer">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  name="email"
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
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  name="confirmPassword"
                  onChange={handleChange}
                />
              </div>
              <div className="form-check form-group">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="acceptedAccess"
                  name="acceptedAccess"
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="acceptedAccess">
                  I understand the policy and acknowledge the violation
                </label>
              </div>
              <button onClick={handleSubmit} className="btn btn-primary">
                Submit
              </button>
              <div className="redirectContainer">
                <Link to="/forgot-password">Forgot Password?</Link>
                <Link to="/sign-in">Already have an account? Sign In</Link>
              </div>
            </div>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};
export default SignUp;
