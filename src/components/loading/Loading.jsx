import "./loading.css";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { dotSpinner } from "ldrs";

dotSpinner.register();

const Loading = () => {
  return (
    <>
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
      <div className="loading">
        <l-dot-spinner size="44" color="rgb(109, 156, 198)"></l-dot-spinner>
      </div>
    </>
  );
};

export default Loading;
