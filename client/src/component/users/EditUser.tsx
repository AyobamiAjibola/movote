import {
  Alert,
  Backdrop,
  Box,
  Button,
  Checkbox,
  Collapse,
  Fade,
  FilledInput,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  Modal,
  TextField,
  Typography, } from "@mui/material";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { emailPattern, password, regValues } from '../../utils/helpers';
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Close, Save } from '@mui/icons-material';
import { SnackContext } from "../../context";

interface FormProps {
  response?: any,
  setAlat?: any
}

type Inputs = {
  email: string;
  company: string;
  contestName: string;
  description: string;
};

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

type Inputes = {
  password: string,
  confirm_password: string
};

interface Things{
  isErr: string
}

function ChildModal({setAlat}: FormProps) {

  const [opened, setOpened] = useState(false);
  const [showPass, setShowPass] = useState(false);
	const [passType, setPassType] = useState('password');

  const handleOpened = () => setOpened(true);
  const handleClosed = () => setOpened(false);

  const { register, handleSubmit, formState: { errors }, getValues } = useForm<Inputes>({
    mode: 'onTouched',
    criteriaMode: 'firstError',
    reValidateMode: 'onBlur'
  });

  const onSubmitPass: SubmitHandler<Inputes> = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("password", data.password);

     const res = await axios.put("http://localhost:8000/user/users", formData);

     if(res.statusText === "OK"){
      setAlat(true);
      handleClosed()
    }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (showPass) {
			setPassType('text');
			return;
		}
		setPassType('password')
  }, [showPass])

  return (
    <>
      <Button onClick={handleOpened} size="small" >Change Password</Button>
      <Modal
        hideBackdrop
        open={opened}
        onClose={handleClosed}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        >
        <Fade in={opened}>
          <Box sx={style}>
            <Grid item mb={3}
              sx={{
                display: "flex",
                justifyContent: "right"
              }}
            >
              <IconButton onClick={handleClosed}>
                  <Close sx={{color: "red"}}/>
              </IconButton>
            </Grid>
            <Grid item
              container
              component='form'
              encType="multipart/form-data"
              sx={{
                display: "flex",
                alignItems: "center"
              }}
            >
              <Grid item xs={12} mb={3} >
                <FormControl sx={{ width: '100%' }} variant="filled">
                  <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
                  <FilledInput
                    id="filled-password"
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
                {errors.password &&
                  (<Typography variant='body2' mt={1}
                  component='span' sx={{color: 'red', textAlign: 'left'}}
                  >{errors.password?.message}</Typography>)
                }
              </Grid>
              <Grid item xs={12} mb={1}>
                <FormControl sx={{ width: '100%' }} variant="filled">
                <InputLabel htmlFor="outlined-adornment-confirm-password">Confirm Password</InputLabel>
                  <FilledInput
                    id="filled-confirm-password"
                    type={passType}
                    {...register("confirm_password", {
                      required: 'Confirm password is required',
                      pattern: {
                        value: password,
                        message: 'Password cannot be less than 8 characters. \n Must include an upper case letter and a digit'
                      },
                      validate: {
                        checkPasswordConfirmationHandler: (value) => {
                            const { password } = getValues();
                            return password === value || "Passwords don't match";
                        },
                    }
                    })}
                  />
                </FormControl>
                {errors.confirm_password &&
                  (<Typography variant='body2' mt={1}
                  component='span' sx={{color: 'red', textAlign: 'left'}}
                  >{errors.confirm_password?.message}</Typography>)
                }
              </Grid>
              <FormGroup>
                <FormControlLabel control={<Checkbox
                  name="passType"
                  checked={showPass}
                  onChange={() => setShowPass((prev) => !prev)}
                  inputProps={{ 'aria-label': 'controlled' }}
                />} label={showPass ? 'Hide password' : 'Show password'} />
              </FormGroup>
              <Grid
                item xs={12}
                sx={{display: "flex", alignItems: "center", justifyContent: "center"}}
              >
                <Button
                  onClick={handleSubmit(onSubmitPass)}
                  variant="contained"
                  endIcon={<Save />}
                  sx={{ mt: 3,
                    mb: 2,
                    width: "50%",
                    color: "white",
                    backgroundColor: "#15023a",
                    boxShadow: 4,
                    "&:hover": { backgroundColor: "white", color: "#15023a" }
                  }}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

export default function EditUser({response}: FormProps) {

  const navigate = useNavigate();
  const [alat, setAlat] = useState(false);
  const [open, setOpen] = useState(true);
  const [state, setState] = useContext(SnackContext)
  const [values, setValues] = useState({
    isErr: ''
  })

  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    defaultValues: {
      email: response.email,
      company: response.company,
      contestName: response.contestName,
      description: response.description
    },
    mode: 'onTouched',
    criteriaMode: 'firstError',
    reValidateMode: 'onBlur'
  });


  const onSubmitDetail: SubmitHandler<Inputs> = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("company", data.company);
      formData.append("contestName", data.contestName);
      formData.append("description", data.description);

     const res = await axios.put("http://localhost:8000/user/users", formData);

     if(res.data.errors){
      setValues({...values, isErr: res.data.errors[0].msg})
    } else if (res.data.errors === null) {
      setState({...state, editProfile: true});
      navigate('/land')
    }

    } catch (err: any) {
      console.error(err.message);
    }
  };

  return (
    <>
      <Grid item
        container
        component='form'
        encType="multipart/form-data"
      >
        <Grid item xs={12} mb={2} mt={2}>
          <TextField
            fullWidth
            autoFocus
            variant='filled'
            id="editEmail"
            label="Email Address"
            {...register("email", {
              required: 'Email is required',
              pattern: {
                value: emailPattern,
                message: 'Please enter a valid email address'
              }
            })}
            autoComplete="email"
            error={!!errors?.email}
          />
            {errors.email &&
              (<Typography variant='body2' mt={1}
              component='span' sx={{color: 'red', textAlign: 'left'}}
              >{errors.email?.message}</Typography>)
            }
        </Grid>
        <Grid item xs={12} mb={2}>
          <TextField
            fullWidth
            variant='filled'
            id="editCompany"
            label="Company Name"
            {...register("company", {
              required: 'Company name is required',
            })}
            autoComplete="company"
            error={!!errors?.company}
          />
          {errors.company &&
            (<Typography variant='body2' mt={1}
            component='span' sx={{color: 'red', textAlign: 'left'}}
            >{errors.company?.message}</Typography>)
          }
        </Grid>
        <Grid item xs={12} mb={1}>
          <TextField
            fullWidth
            variant='filled'
            id="editContest"
            label="Contest Name"
            {...register("contestName", {
              required: 'Contest name is required',
            })}
            autoComplete="contest"
            error={!!errors?.contestName}
          />
            {errors.contestName &&
              (<Typography variant='body2' mt={1}
              component='span' sx={{color: 'red', textAlign: 'left'}}
              >{errors.contestName?.message}</Typography>)
            }
        </Grid>
        <Grid item xs={12}>
          <FormLabel sx={{fontWeight: 500, fontSize: "12px", mb: -0.8}}>(200 characters max)</FormLabel>
          <TextField
            fullWidth
            variant="filled"
            id="filled-multiline-flexible"
            label="Contest Description"
            multiline
            maxRows={4}
            {...register("description", {
              maxLength: {
                value: 200,
                message: "Contest description should not be more than 200 characters"
              },
            })}
            autoComplete="contest"
            error={!!errors?.description}
          />
            {errors.description &&
              (<Typography variant='body2' mt={1}
              component='span' sx={{color: 'red', textAlign: 'left'}}
              >{errors.description?.message}</Typography>)
            }
        </Grid>
        <Grid>
          {values.isErr &&
          <Typography
            component="span"
            variant="body2"
            sx={{
              color: "red",
              fontWeight: 400
            }}
          >
            {values.isErr}
          </Typography> }
          <ChildModal setAlat={setAlat}/>
          {alat &&
            <Collapse in={open}>
              <Alert
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <Close fontSize="inherit" />
                  </IconButton>
                }
                sx={{fontSize: 11}}
              >
                Successfully Changed
                <br/>
                Your Password
              </Alert>
            </Collapse>
          }
        </Grid>
        <Grid
          item xs={12}
          sx={{display: "flex", alignItems: "center", justifyContent: "center"}}
        >
        <Button
          onClick={handleSubmit(onSubmitDetail)}
          variant="contained"
          endIcon={<Save />}
          sx={{ mt: 2,
            mb: 2,
            width: "50%",
            color: "white",
            backgroundColor: "#15023a",
            boxShadow: 4,
            "&:hover": { backgroundColor: "white", color: "#15023a" }
          }}
        >
          Save
        </Button>
        </Grid>
      </Grid>
    </>
  )
}
