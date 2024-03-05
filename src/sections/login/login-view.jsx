import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useNavigate } from 'react-router-dom';
import { bgGradient } from 'src/theme/css';
import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../../../config';

export default function LoginView() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleForget = () => {
    console.log("chuyen page")
    navigate('/forget');
  };

  useEffect(() => {
    console.log('Checking authentication...');
    const checkAuthentication = async () => {
      try {
        const token = localStorage.getItem('jwttoken');

        if (token) {
          const response = await fetch(`${API_BASE_URL}/api/account/isLogin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          });

          if (response.ok) {
            navigate('/'); // Navigate to home page if authenticated
          } else {
            localStorage.removeItem('jwttoken');
            sessionStorage.removeItem('email');
            navigate('/login');
          }
        } else {
          localStorage.removeItem('jwttoken');
          sessionStorage.removeItem('email');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('jwttoken');
        sessionStorage.removeItem('email');
      }
    };

    // Check authentication on component mount
    checkAuthentication();
  }, [navigate]);

  const handleLogin = async (e) => {
    console.log('Logging in...');
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;
    

    try {
      const response = await fetch(`${API_BASE_URL}/api/account/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Invalid credentials',
        });
        throw new Error('Login failed, invalid credentials');
      }

      const { token } = await response.json();
      console.log('Token:', token);

      localStorage.setItem('jwttoken', token);
      sessionStorage.setItem('email', email);
      console.log('Logged in');
      navigate('/'); // Navigate to home page
    } catch (error) {
      toast.error(`Login Failed: ${error.message}`);
    }
  };

  const renderForm = (
    <>
      <form onSubmit={handleLogin}>
        <Stack spacing={3}>
          <TextField name="email" label="Email address" />

          <TextField
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? '👁️' : '👁️'}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" color="inherit">
          Login
        </LoadingButton>
      </form>
      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link onClick={handleForget} variant="subtitle2" underline="hover">
          Forgot password
        </Link>
      </Stack>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Sign in to SaleBooks</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Don’t have an account?
            <Link variant="subtitle2" sx={{ ml: 0.5 }}>
              Get started
            </Link>
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
            >
              <Iconify icon="eva:google-fill" color="#DF3E30" />
            </Button>

            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
            >
              <Iconify icon="eva:facebook-fill" color="#1877F2" />
            </Button>

            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
            >
              <Iconify icon="eva:twitter-fill" color="#1C9CEA" />
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              OR
            </Typography>
          </Divider>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}