// import { TextField, Button } from "@material-ui/core";
import { useState, useEffect, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthService } from '../../service/api/auth.service';
import {
  Avatar,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Theme,
  Typography,
} from '@mui/material';
import { ItToken } from '@/model/interface/it-token';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

interface LoginResponse {
  status: number;
  headers: ItToken;
  response: {
    data: {
      errorMessage: string;
    };
  };
}

function Login(): JSX.Element {
  const navigate = useNavigate();

  // UseEffect
  useEffect(() => {
    AuthService.checkLoginAndRedirect(navigate);
  }, [navigate]);

  async function loginUser(data: FormData) {
    const username = data.get('username') as string;
    const password = data.get('password') as string;
    const response = (await AuthService.login({
      username,
      password
    }
    )) as unknown as LoginResponse;

    if (
      response &&
      response.status === 200 &&
      response?.headers?.access_token &&
      response?.headers?.refresh_token
    ) {
      AuthService.setUserInfo({
        username: username,
        accessToken: response.headers.access_token,
        refreshToken: response.headers.refresh_token,
      });
      toast.success(`You're logged`);
      navigate('/', { replace: true });
    } else {
      toast.error(`${response?.response?.data?.errorMessage}`);
    }
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (event && event.currentTarget) {
      const data = new FormData(event.currentTarget);
      loginUser(data);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            type="text"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
