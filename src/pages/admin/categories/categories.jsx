import { Container } from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

const Categories = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <p>Categories</p>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            Item 1
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            Item 2
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Categories;
