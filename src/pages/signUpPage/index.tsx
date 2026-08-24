import React, {
  FormEvent,
  useState,
} from "react";
import {
  Alert,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

import { supabase } from "../../supabaseClient";

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignUp = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setMessage(
      "Account created. Please check your email and confirm your account before logging in."
    );
  };

  return (
    <Box
      component="form"
      onSubmit={handleSignUp}
      sx={{
        maxWidth: 450,
        margin: "40px auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h4" component="h1">
        Create account
      </Typography>

      {errorMessage && (
        <Alert severity="error">
          {errorMessage}
        </Alert>
      )}

      {message && (
        <>
          <Alert severity="success">
            {message}
          </Alert>

          <Button
            component={Link}
            to="/login"
            variant="outlined"
          >
            Go to login
          </Button>
        </>
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
        inputProps={{ minLength: 6 }}
      />

      <Button type="submit" variant="contained">
        Sign up
      </Button>
    </Box>
  );
};

export default SignUpPage;