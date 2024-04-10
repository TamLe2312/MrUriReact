import "./verifyToken.css";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Validation from "../../../components/validation/validation";
import * as request from "../../../utilities/request";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const VerifyToken = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const location = useLocation();
  //Lấy tham số URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    // console.log(email, token);
    setFormData((prevData) => ({ ...prevData, email: email, token: token }));
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errors = Validation(formData, "verify-token");
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
      try {
        const res = await request.postRequest("users/verify-token", {
          password: formData.password,
          email: formData.email,
          token: formData.token,
        });
        // console.log(res);
        if (res.status === 200) {
          toast.success(res.data.message);
          navigate("/sign-in");
        }
      } catch (err) {
        console.error(err);
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
export default VerifyToken;
