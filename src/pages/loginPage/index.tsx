import React, {
  FormEvent,
  useState,
} from "react";
import {
  Alert,
  Box,
  Button,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { supabase } from "../../supabaseClient";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setErrorMessage("");

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    navigate("/");
  };

  const handleGoogleLogin = async () => {
    setErrorMessage("");

    const { error } =
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });

    if (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{
        maxWidth: 450,
        margin: "40px auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h4" component="h1">
        Log in
      </Typography>

      {errorMessage && (
        <Alert severity="error">
          {errorMessage}
        </Alert>
      )}

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(event) =>
          setEmail(event.target.value)
        }
        required
      />

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(event) =>
          setPassword(event.target.value)
        }
        required
      />

      <Button type="submit" variant="contained">
        Log in
      </Button>

      <Divider>OR</Divider>

      <Button
        type="button"
        variant="outlined"
        onClick={handleGoogleLogin}
      >
        Continue with Google
      </Button>
    </Box>
  );
};

export default LoginPage;