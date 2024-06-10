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
import Validation from "../../../components/validation/validation";
import * as request from "../../../utilities/request";
// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [acceptedAccess, setAcceptedAccess] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleChecked = (e) => {
    const isChecked = e.target.checked;
    setAcceptedAccess(isChecked);
  };

  const validate = () => {
    const errors = Validation(formData, "usersRegister");
    let isValid = true;

    if (!acceptedAccess) {
      errors.acceptedAccess = "Policy and acknowledge must be checked";
    }

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
      formDatas.append("email", formData.email);
      formDatas.append("password", formData.password);
      try {
        const res = await request.postRequest("users/sign-up", formDatas);
        if (res.status === 200) {
          toast.success(res.data.message);
          navigate("/sign-in");
        }
      } catch (err) {
        toast.error(err.response.data.message);
      }
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
                  className={
                    errors.username ? "form-control is-invalid" : "form-control"
                  }
                  id="username"
                  name="username"
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
                <label>Email</label>
                <input
                  type="text"
                  className={
                    errors.email ? "form-control is-invalid" : "form-control"
                  }
                  id="email"
                  name="email"
                  onChange={handleChange}
                />
                {errors.email && (
                  <div
                    id="validationServerBrandFeedback"
                    className="invalid-feedback"
                  >
                    {errors.email}
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
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  className={
                    errors.confirmPassword
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  id="confirmPassword"
                  name="confirmPassword"
                  onChange={handleChange}
                />
                {errors.confirmPassword && (
                  <div
                    id="validationServerBrandFeedback"
                    className="invalid-feedback"
                  >
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
              <div className="form-check form-group">
                <input
                  type="checkbox"
                  className={
                    errors.acceptedAccess
                      ? "form-check-input is-invalid"
                      : "form-check-input"
                  }
                  id="acceptedAccess"
                  name="acceptedAccess"
                  checked={acceptedAccess}
                  onChange={handleChecked}
                />
                <label className="form-check-label" htmlFor="acceptedAccess">
                  I understand the policy and acknowledge the violation
                </label>
                {errors.acceptedAccess && (
                  <div
                    id="validationServerBrandFeedback"
                    className="invalid-feedback"
                  >
                    {errors.acceptedAccess}
                  </div>
                )}
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
