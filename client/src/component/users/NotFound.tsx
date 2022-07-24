import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Box
        sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
            flexDirection: "column"
        }}
    >
        <Typography variant="h2">404</Typography>
        <Typography variant="body2">Page not found. Please click <Link to='/'>home</Link></Typography>
    </Box>
  )
}
