import { ArrowCircleUp, Close, Save } from '@mui/icons-material';
import {    Box, Checkbox, FilledInput, FormControl, FormControlLabel,
            FormGroup, Grid, Grow, IconButton, InputLabel, MenuItem, Select,
            Snackbar, TextField, Typography, styled, FormLabel
        } from '@mui/material'
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { emailPattern, password, regValues } from '../../../../utils/helpers';
import LoadingButton from '@mui/lab/LoadingButton';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { SnackContext } from '../../../../context';

type Inputs = {
    email: string;
    company: string;
    contestName: string;
    isAdmin: string;
    description: string;
    image?: any;
    password: string;
    confirm_password: string;
};

interface props {
    setContest?: any,
    contest?: any,
    setUpdList?: any
  }

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
props,
ref,
) {
return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Input = styled('input')({
    display: 'none',
  });

interface State {
    open: boolean;
    isLoading: boolean;
}

interface StateStr {
    errMsg: string;
    isError: string;
}

export default function AddContest({setContest, contest, setUpdList}: props) {

    const [showPass, setShowPass] = useState(false);
    const [passType, setPassType] = useState('password');
    const [fileName, setFileName] = useState<any>();
    const [errImg, setErrImg] = useState('');
    const [state, setState] = useContext(SnackContext)

    const [values, setValues] = useState<State>({
        open: false,
        isLoading: false,
      });

    const [states, setStates] = useState<StateStr>({
        errMsg: '',
        isError: ''
    });

    const handleCloser = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
        return;
        }
        setValues({...values, open: false});
    };

    const handleClosed = () => setContest(false);

    const { register, handleSubmit, formState: { errors }, getValues } = useForm<Inputs>({
        defaultValues: regValues,
        mode: 'onTouched',
        criteriaMode: 'firstError',
        reValidateMode: 'onBlur'
    });

    const onSubmit: SubmitHandler<Inputs> = async (data: any) => {
        try {
            setValues({...values, isLoading: true})
          const formData = new FormData();
            formData.append("email", data.email.toLowerCase());
            formData.append("company", data.company.toLowerCase());
            formData.append("contestName", data.contestName.replace(/\s+/g, '-').toLowerCase());
            formData.append("password", data.password);
            formData.append("isAdmin", data.isAdmin);
            formData.append("description", data.description.toLowerCase());
            formData.append("image", fileName);


         const res = await axios.post("http://localhost:8000/auth/register", formData);

         setValues({...values, isLoading: false})
         if(res.data.errors){
            setValues({...values, open: true})
                return setStates({...states, errMsg: res.data.errors[0].msg })
          }

        if(res.statusText === 'OK') {
            setState({...state, addContest: true})
        }

         setContest(false)
         setUpdList(true)

        } catch (err: any) {
            setErrImg(err.response.data.errors)
            err.response.status >= 400 && setStates({...states, isError: "Server error, please reload the page"})
            setValues({...values, isLoading: false})
        }
    };

    const onChangeFile = (e:any) => {
        setFileName(e.target.files[0]);
      }

    useEffect(() => {
        if (showPass) {
                setPassType('text');
                return;
            }
            setPassType('password')
      }, [showPass])

  return (
    <>
    <Grow
        in={contest}
        style={{ transformOrigin: '0 0 0' }}
          {...(contest ? { timeout: 1000 } : {})}
    >
        <Grid container item xs={12} lg={6} md={8}
            sx={{
                backgroundColor: "white",
                boxShadow: 4,
                p: "0px 30px",
                borderRadius: 1,
                m: "3px 3px"
            }}
        >
            {states.errMsg && <Snackbar open={values.open} autoHideDuration={6000} onClose={handleCloser}>
                <Alert onClose={handleCloser} severity="error" sx={{ width: '100%' }}>
                    {states.errMsg}
                </Alert>
            </Snackbar> }
            <Grid item mb={3} mt={2}
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
                <Grid item xs={12}>
                <TextField
                    margin="normal"
                    fullWidth
                    autoFocus
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
                    error={!!errors?.email}
                />
                    {errors.email &&
                        (<Typography variant='body2' mt={1}
                        component='span' sx={{color: 'red', textAlign: 'left'}}
                        >{errors.email?.message}</Typography>)
                    }
                </Grid>
                <Grid item xs={12}>
                <TextField
                    margin="normal"
                    fullWidth
                    variant='filled'
                    id="company"
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
                <Grid item xs={12}>
                <TextField
                    margin="normal"
                    fullWidth
                    variant='filled'
                    id="contest"
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
                <Grid item xs={12} mb={2} mt={2}>
                    <FormControl variant="filled" fullWidth>
                        <InputLabel id="demo-simple-select-filled-label">User Role</InputLabel>
                        <Select
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        defaultValue=''
                        {...register("isAdmin", {
                            required: "User role is required"
                          })}
                        >
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="user">Pay as you vote contest</MenuItem>
                            <MenuItem value="userFree">Free voting contest</MenuItem>
                            <MenuItem value="userMul">Category contest</MenuItem>
                        </Select>
                    </FormControl>
                    {errors.isAdmin &&
                        (<Typography variant='body2' mt={1}
                        component='span' sx={{color: 'red', textAlign: 'left'}}
                        >{errors.isAdmin?.message}</Typography>)
                    }
                </Grid>
                <Grid item xs={12} mb={3}>
                <FormLabel sx={{fontWeight: 500, fontSize: "12px", mb: -0.8}}>(200 characters max)</FormLabel>
                <TextField
                    id="filled-multiline-static"
                    label="Contest Description"
                    multiline
                    rows={4}
                    variant="filled"
                    fullWidth
                    {...register("description", {
                        maxLength: {
                            value: 200,
                            message: "Contest description should not be more than 200 characters"
                            },
                      })}
                />
                {errors.description &&
                    (<Typography variant='body2' mt={1}
                    component='span' sx={{color: 'red', textAlign: 'left'}}
                    >{errors.description?.message}</Typography>)
                }
                </Grid>
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
                <FormGroup>
                    <FormControlLabel control={<Checkbox
                        name="passType"
                        checked={showPass}
                        onChange={() => setShowPass((prev) => !prev)}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />} label={showPass ? 'Hide password' : 'Show password'} />
                </FormGroup>
                </Grid>
                <Grid item xs={12} sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column"
                }}>
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "left",
                            alignItems: "left",
                            mb: 0.5
                        }}
                    >
                        <Typography
                            variant='body2'
                            component="span"
                            sx={{color: "black", fontSize: 11 }}
                        >
                        Upload contest image (500kb max. Dimension: 700 X 750).
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            width: "100%",
                            border: "1px dashed #E7E5EB",
                            backgroundColor: "#F9F9F9",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <label htmlFor="icon-button-file">
                            <Input id="icon-button-file" type="file" name="image" onChange={onChangeFile}/>
                            <IconButton color="primary" aria-label="upload picture" component="span"
                                sx={{display: "flex", flexDirection: "column"}}
                            >
                                <ArrowCircleUp />
                                <Typography component="span" variant="body2" sx={{fontSize: 10}}>Select Image</Typography>
                            </IconButton>
                        </label>
                    </Box>
                    <Box
                        sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "left",
                        alignItems: "left"
                        }}
                    >
                        {errImg &&
                            <Typography variant='body2' mt={1}
                                component='span' sx={{color: 'red', textAlign: 'left'}}
                            >
                                {errImg}
                            </Typography>
                        }
                    </Box>
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "left",
                            alignItems: "left",
                            flexDirection: "column",
                            mt: 1
                        }}
                    >
                        {fileName &&
                        <Typography
                            variant='body2'
                            component="span"
                            sx={{color: "5F5E5E", fontWeight:400, fontSize: 11 }}
                        >
                            <span>file name: </span>{fileName.name}
                        </Typography>}
                        {fileName &&
                        <Typography
                            variant='body2'
                            component="span"
                            sx={{color: "#5F5E5E", fontWeight:400, fontSize: 11 }}
                        >
                            <span>file size: </span> {fileName.size}
                        </Typography>}
                    </Box>
                </Grid>
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
                    onClick={handleSubmit(onSubmit)}
                    size="medium"
                    loading={values.isLoading}
                    loadingIndicator="Saving..."
                    endIcon={<Save />}
                    variant="contained"
                    sx={{ mt: 3,
                        mb: 1,
                        width: "50%",
                        color: "white",
                        backgroundColor: "#15023a",
                        boxShadow: 4,
                        "&:hover": { backgroundColor: "white", color: "#15023a" }
                    }}
                    >
                    Save
                </LoadingButton>
                <Typography component="span" variant="body2" sx={{color: "red", mb: 5}}>{!errImg && states.isError}</Typography>
                </Grid>
            </Grid>
        </Grid>
    </Grow>
    </>
  )
}

