import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useContext, useEffect, useState } from 'react';
import { Grow, IconButton, Stack, TextField, Tooltip, Zoom } from '@mui/material';
import { SnackContext } from '../../../../context';
import { useNavigate, useParams } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Close, Edit, Save } from '@mui/icons-material';
import { useAxios } from '../../../../utils/useAxios';
import LoadingPage from '../../LoadingPage';
import axios from 'axios';
import { ImageEdit } from '../pages/ImageEdit';

type Inputs = {
    fname: string;
    lname: string;
    username: string;
    email: string;
  };

interface Stuff{
  isErr: string,
  img: boolean
}

export default function EditContestants_SingCat() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useContext(SnackContext);
  const [values, setValues] = useState<Stuff>({
    isErr: '',
    img: false
  })

  const { response, loading, error } = useAxios({
    method: 'GET',
    url: `/contestant/curr_contestant/${id}`
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<Inputs>({
    mode: 'onTouched',
    criteriaMode: 'firstError',
    reValidateMode: 'onBlur'
  });

  const handleClosed = () => {
    setState({...state, transition: false})
    navigate('/contest')
  };

  const onSubmit: SubmitHandler<Inputs> = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("fname", data.fname);
      formData.append("lname", data.lname);
      formData.append("username", data.username);
      formData.append("email", data.email);

     const res = await axios.put(`http://localhost:8000/contestant/con/${id}`, formData);

      if(res.data.errors){
        setValues({...values, isErr: res.data.errors[0].msg})
      } else if (res.data.errors === null) {
        setState({...state, editContest: true});
        navigate('/contest')
      }
      } catch (err: any) {
          console.log(err.message);
      }

  };

const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

  useEffect(() => {
    if(response !== undefined) {
      reset({
        fname: capitalizeFirstLetter(response.fname),
        lname: capitalizeFirstLetter(response.lname),
        username: response.username.toLowerCase(),
        email: response.email.toLowerCase()
      });
    }
    if(!state.transition){
      navigate('/contest')
    }
    setState({...state, updateList: false})
	}, [reset, response, state.updateList]);

  return (
    <Box component="div" sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
    {loading && <LoadingPage/>}
    {error ? <Typography component='em' sx={{color: 'red', m: 2 }}>{error}</Typography> : (
    <Grow
      in={state.transition}
      style={{ transformOrigin: '0 0 0' }}
        {...(state.transition ? { timeout: 1000 } : {})}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ lg: 0, xs: 0, sm: 0, md: 0 }}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 5,
          width: "60%"
        }}
      >
        <Box
          component="div"
          sx={{
            backgroundColor: "white",
            boxShadow: 5, mb: 3, ml: 5, mt: 3,
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
            width: "100%", height: 405,
            overflow: "hidden",
            position: "relative",
            display: {lg: "block", xs: "none"}
          }}
        >
          <Tooltip
            TransitionComponent={Zoom}
            title="Change Image"
          >
            <IconButton
              onClick={() => setValues({...values, img: true})}
              sx={{
                zIndex: 1,
                position: "absolute",
                backgroundColor: "white",
                marginLeft: 1,
                marginTop: 1,
                marginBottom: 1,
                "&:hover": {
                  color: " white"
                },
                ...(values.img && { display: 'inherit', visibility: 'hidden' })
              }}
            >
              <Edit sx={{fontSize: "medium"}}/>
            </IconButton>
          </Tooltip>
          {!values.img &&<img
              alt="contestants"
              crossOrigin='anonymous'
              src={`http://localhost:8000/${response?.image}`}
              style={{
                height: "100%",
                maxWidth: "100%",
                objectFit: "cover"
              }}
            />}
          {values.img && <Box component="div"
          sx={{backgroundColor: "white", height: "100%"}}>
            <ImageEdit values={values} setValues={setValues} />
          </Box>}
        </Box>
        <Box
          sx={{
            backgroundColor: "white",
            boxShadow: 5, mb: 3, ml: 5, mt: 3,
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5,
            padding: "0px 10px",
            width: "100%",
            height: "100%"
          }}
          component='form'
          encType="multipart/form-data"
        >
          <Box mb={1} mt={1}
            sx={{
              display: "flex",
              justifyContent: "right"
            }}
          >
            <Button
              onClick={handleClosed}
              variant="text"
              size="small"
              sx={{
                color: "red",
                mb: 1.1
              }}
            >
              close
            </Button>
          </Box>
          <TextField
            fullWidth
            autoFocus
            variant='filled'
            id="fname"
            label="First Name"
            {...register("fname", {
            required: 'First name is required',
            })}
            autoComplete="fname"
            error={!!errors?.fname}
            InputLabelProps={{
              shrink: true,
            }}
          />
            {errors.fname &&
            (<Typography variant='body2' mt={1}
            component='span' sx={{color: 'red', textAlign: 'left'}}
            >{errors.fname?.message}</Typography>)
            }
          <TextField
            sx={{mt: 1}}
            fullWidth
            variant='filled'
            id="lname"
            label="Last Name"
            {...register("lname", {
            required: 'Last name is required',
            })}
            autoComplete="company"
            error={!!errors?.lname}
            InputLabelProps={{
              shrink: true,
            }}
          />
            {errors.lname &&
            (<Typography variant='body2' mt={1}
            component='span' sx={{color: 'red', textAlign: 'left'}}
            >{errors.lname?.message}</Typography>)
            }
          <TextField
            sx={{mt: 1}}
            fullWidth
            variant='filled'
            id="username"
            label="Username"
            {...register("username", {
            required: 'Username is required',
            })}
            autoComplete="username"
            error={!!errors?.username}
            InputLabelProps={{
              shrink: true,
            }}
          />
            {errors.username &&
            (<Typography variant='body2' mt={1}
            component='span' sx={{color: 'red', textAlign: 'left'}}
            >{errors.username?.message}</Typography>)
            }
            <TextField
              sx={{mt: 1}}
              fullWidth
              variant='filled'
              id="email"
              label="Email"
              {...register("email", {
              required: 'Email is required',
              })}
              autoComplete="email"
              error={!!errors?.email}
              InputLabelProps={{
                shrink: true,
            }}
          />
            {errors.email &&
            (<Typography variant='body2' mt={1}
            component='span' sx={{color: 'red', textAlign: 'left'}}
            >{errors.email?.message}</Typography>)
            }
          {values.isErr &&
            <Typography
              component="span"
              variant="body2"
              sx={{color: "red", fontWeight: 400}}
            >
              {values.isErr}
            </Typography>
          }
          <Box
            sx={{display: "flex", alignItems: "center", justifyContent: "center"}}
          >
            <Button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              endIcon={<Save />}
              sx={{
                mt: 4,
                mb: 4,
                width: "50%",
                color: "white",
                backgroundColor: "#15023a",
                boxShadow: 4,
                "&:hover": { backgroundColor: "white", color: "#15023a" }
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Stack>
    </Grow>)}
    </Box>
  );
}
