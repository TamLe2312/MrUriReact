import * as React from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Title from "../title/title";

function preventDefault(event) {
  event.preventDefault();
}

const Deposits = () => {
  return (
    <React.Fragment>
      <Title>Recent Deposits</Title>
      <Typography component="p" variant="h4">
        - 100,000 VND
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        on 26 March, 2024
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View balance
        </Link>
      </div>
    </React.Fragment>
  );
};

export default Deposits;
