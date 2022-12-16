import {useEffect, useState, useContext} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Avatar, FilledInput, FormControl, FormControlLabel, FormGroup, InputLabel, Box, Grid } from '@mui/material';
import { useForm, SubmitHandler } from "react-hook-form";
import { emailPattern, loginValues, password } from '../../utils/helpers';
import Checkbox from '@mui/material/Checkbox';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context';
import LoadingButton from '@mui/lab/LoadingButton';
import LoginIcon from '@mui/icons-material/Login';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="localhost:3000/">
        Online Voting
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

type Inputs = {
  email: string,
  password: string
};

export default function Login() {

  const [showPass, setShowPass] = useState(false);
	const [passType, setPassType] = useState('password');
  const [errMsg, setErrMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState('');
  const navigate = useNavigate();
  const [state, setState] = useContext(UserContext)

  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    defaultValues: loginValues,
    mode: 'onTouched',
    criteriaMode: 'firstError',
    reValidateMode: 'onBlur'
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {

    try {
      setIsLoading(true)

      let email = data.email;
      let password = data.password;

      const {data: login} = await axios.post("http://localhost:8000/auth/login", {
        email,
        password,
      });

      setIsLoading(false)
      if(login.errors.length){
        return setErrMsg(login.errors[0].msg)
      }

      setState({
        data: {
          id: login.data.user.id,
          isAdmin: login.data.user.isAdmin
        },
        loading: false,
        error: null,
      })

      localStorage.setItem("token", login.data.token);
      axios.defaults.headers.common["token"] = `${login.data.token}`;
      navigate("/land");
    } catch (err: any) {
      setIsError("Network error please refresh the page")
      setIsLoading(false)
    }
  };

  useEffect(() => {
		if (showPass) {
			setPassType('text');
			return;
		}
		setPassType('password');
	}, [showPass]);

  return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Avatar sx={{ bgcolor: '#15023a', mt: 2}}  >
            <LockOutlinedIcon />
          </Avatar>
          <Box component="form"
            noValidate
            sx={{ mt: 5}}
          >
            <TextField
              margin="normal"
              fullWidth
              variant='filled'
              id="email"
              label="Email Address"
              {...register("email", {
                required: 'Email is required',
                pattern: {
                  value: emailPattern,
                  message: 'Please enter a valid email address'
                }
              })}
              autoComplete="email"
              autoFocus
              error={!!errors?.email}
            />
            {errors.email &&
                (<Typography variant='body2' mt={1}
                component='span' sx={{color: 'red', textAlign: 'left'}}
                >{errors.email?.message}</Typography>)
            }
            <FormControl sx={{ mt: 3, width: '100%' }} variant="filled">
              <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
              <FilledInput
                id="filled-adornment-password"
                type={passType}
                {...register("password", {
                  required: 'Password is required',
                  pattern: {
                    value: password,
                    message: 'Password cannot be less than 8 characters. \n Must include an upper case letter and a digit'
                  }
                })}
                error={!!errors?.password}
              />
            </FormControl>
            <FormGroup>
              <FormControlLabel control={<Checkbox
                name="passType"
                checked={showPass}
                onChange={() => setShowPass((prev) => !prev)}
                inputProps={{ 'aria-label': 'controlled' }}
              />} label={showPass ? 'Hide password' : 'Show password'} />
            </FormGroup>
            {errMsg && <Typography variant='body2' mt={1}
              component='span' sx={{color: 'red', textAlign: 'left'}}
              >{errMsg}</Typography>}
            {errors.password &&
              (<Typography variant='body2' mt={1}
              component='span' sx={{color: 'red', textAlign: 'left'}}
              >{errors.password?.message}</Typography>)
            }
            <Grid
                item xs={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column"
                }}
              >
              <LoadingButton
                type="submit"
                size="medium"
                onClick={handleSubmit(onSubmit)}
                loading={isLoading}
                loadingIndicator="Sign In..."
                endIcon={<LoginIcon />}
                variant="contained"
                sx={{ mt: 3,
                  mb: 2,
                  width: "50%",
                  color: "white",
                  backgroundColor: "#15023a",
                  boxShadow: 4,
                  "&:hover": { backgroundColor: "white", color: "#15023a" }
                }}
              >
                Sign In
              </LoadingButton>
              <Typography component="span" variant="body2" sx={{color: "red"}}>{isError}</Typography>
            </Grid>
            <Copyright sx={{ mt: 2, mb: 2 }} />
          </Box>
          </Box>
    </ThemeProvider>
  );
}
