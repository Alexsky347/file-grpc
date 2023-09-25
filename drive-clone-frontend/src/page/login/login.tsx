import { useState, useEffect, FormEvent, JSX } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Avatar,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Theme,
  Typography,
} from '@mui/material';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useSelector, useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { login } from "../../store/slices/auth";
import { clearMessage } from "../../store/slices/message";
import { ItToken } from "../../model/interface/it-token";
import { AppDispatch, store } from "../../store/store";


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

  const [loading, setLoading] = useState(false);

  const { isLoggedIn } = useSelector((state: {auth: any}) => state.auth);
  const { message } = useSelector((state: {message: any}) => state.message);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  async function loginUser(data: FormData) {
    setLoading(true);
    const username = data.get('username') as string;
    const password = data.get('password') as string;
    const response = dispatch(
      login({ username, password })
    ).unwrap() as unknown as LoginResponse;

    if (isLoggedIn) {
      toast.success(`You're logged`);
      navigate('/', { replace: true });
    } else {
      setLoading(false);
      toast.error(`${response?.response?.data?.errorMessage}`);
    }
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (event?.currentTarget instanceof HTMLFormElement) {
      const data = new FormData();
      const { username, password } = event.currentTarget;
      data.append('username', username.value);
      data.append('password', password.value);
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
              <Link to="#"
                    variant="contained"
                    color="primary">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to="#"
                    variant="contained"
                    color="primary">
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
