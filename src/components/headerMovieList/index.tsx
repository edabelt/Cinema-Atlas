import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const styles = {
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 1.5,
    padding: 2,
  },
};

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
}) => {
  return (
    <Paper component="div" sx={styles.root}>
      <Typography
        variant="h4"
        component="h1"
      >
        {title}
      </Typography>
    </Paper>
  );
};

export default Header;