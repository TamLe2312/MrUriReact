import "./forgotPassword.css";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { Link, useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import Validation from "../../../components/validation/validation";
import * as request from "../../../utilities/request";
import { toast } from "sonner";

const defaultTheme = createTheme();

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const validate = () => {
    const errors = Validation(formData, "forgot-password");
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
        const res = await request.postRequest("users/forgot-password", {
          email: formData.email,
        });
        // console.log(res);
        if (res.status === 200) {
          toast.success(res.data.message);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <>
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
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
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
                Forgot Password
              </Typography>
              <div className="container formContainer">
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
                <button onClick={handleSubmit} className="btn btn-primary">
                  Submit
                </button>
                <div className="redirectContainer">
                  <Link to="/sign-in">Already have an account? Sign In</Link>
                </div>
              </div>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default ForgotPassword;
