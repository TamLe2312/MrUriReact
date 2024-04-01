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
import * as request from "../../../utilities/request";
import { toast } from "sonner";
import Validation from "../../../components/validation/validation";

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleChecked = (e) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      localStorage.setItem("rememberMe", true);
      setRememberMe(isChecked);
    } else {
      localStorage.removeItem("rememberMe");
      setRememberMe(false);
    }
  };

  const validate = () => {
    const errors = Validation(formData, "usersLogin");
    let isValid = true;

    setErrors(errors);

    if (
      Object.keys(errors).length !== 0 ||
      !Object.values(formData).every((value) => value !== "")
    ) {
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    const isValid = validate();

    if (isValid) {
      const formDatas = new FormData();
      formDatas.append("username", formData.username);
      formDatas.append("password", formData.password);
      try {
        const res = await request.postRequest("users/sign-in", formDatas);
        if (res.status === 200) {
          toast.success(res.data.message);
          localStorage.setItem("token", res.data.results.token);
          navigate("/");
        }
      } catch (err) {
        // toast.error(err.response.data.message);
        console.error(err);
      }
    } else {
      console.log(errors);
    }
  };
  useEffect(() => {
    const rememberMe = localStorage.getItem("rememberMe");
    if (rememberMe) {
      setRememberMe(true);
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
                  className={
                    errors.username ? "form-control is-invalid" : "form-control"
                  }
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
                {errors.username && (
                  <div
                    id="validationServerBrandFeedback"
                    className="invalid-feedback"
                  >
                    {errors.username}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className={
                    errors.password ? "form-control is-invalid" : "form-control"
                  }
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <div
                    id="validationServerBrandFeedback"
                    className="invalid-feedback"
                  >
                    {errors.password}
                  </div>
                )}
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="rememberMe"
                  name="rememberMe"
                  checked={rememberMe}
                  onChange={handleChecked}
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
