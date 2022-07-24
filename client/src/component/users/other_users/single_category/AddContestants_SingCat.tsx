import { useContext, useState } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SnackContext } from "../../../../context";
import { IconButton, styled, TextField } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { ArrowCircleUp, Save } from "@mui/icons-material";
import { contestantValue, emailPattern } from "../../../../utils/helpers";
import { LoadingButton } from "@mui/lab";

interface ModalProps{
  closeDialog?: any
}

type Inputs = {
  fname: string;
  lname: string;
  username: string;
  email: string;
};

const Input = styled('input')({
  display: 'none',
});

interface Things{
  isLoading: boolean,
  errMsg: string
}

export default function AddContestants_SingCat({closeDialog}: ModalProps) {

  const [fileName, setFileName] = useState<any>();
  const [state, setState] = useContext(SnackContext);
  const [errImg, setErrImg] = useState('');
  const [isError, setIsError] = useState('');
  const [msgLoad, setMsgLoad] = useState<Things>({
    errMsg: '',
    isLoading: false,
  });

  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    defaultValues: contestantValue,
    mode: 'onTouched',
    criteriaMode: 'firstError',
    reValidateMode: 'onBlur'
});

  const onSubmit: SubmitHandler<Inputs> = async (data: any) => {
    try {
      setMsgLoad({...msgLoad, isLoading: true})
      const formData = new FormData();
      formData.append("fname", data.fname.toLowerCase());
      formData.append("lname", data.lname.toLowerCase());
      formData.append("username", data.username.toLowerCase());
      formData.append("email", data.email.toLowerCase());
      formData.append("image", fileName);

     const res = await axios.post("http://localhost:8000/contestant/con", formData);
     setMsgLoad({...msgLoad, isLoading: false})
     if(res.data.errors){
            return setMsgLoad({...msgLoad, errMsg: res.data.errors[0].msg })
      }
    if(res.statusText === 'OK') {
        setState({...state, addContest: true, updateList: true})
        closeDialog()
    }

    } catch (err: any) {
        setErrImg(err.response.data.errors)
        err.response.status >= 400 && setIsError("Server error, please reload the page")
        setMsgLoad({...msgLoad, isLoading: false})
    }
  };

  const onChangeFile = (e:any) => {
    setFileName(e.target.files[0]);
  }

  return (
    <>
      <Box
        component='form'
        encType="multipart/form-data"
      >
        <TextField
          margin="normal"
          fullWidth
          variant='filled'
          id="fname"
          label="First Name"
          {...register("fname", {
          required: 'First name is required',
          })}
          autoComplete="fname"
          error={!!errors?.fname}
        />
        {errors.fname &&
          (<Typography variant='body2'
          component='span' sx={{color: 'red', textAlign: 'left'}}
          >{errors.fname?.message}</Typography>)
        }
        <TextField
          margin="normal"
          fullWidth
          variant='filled'
          id="lname"
          label="Last Name"
          {...register("lname", {
          required: 'Last name is required',
          })}
          autoComplete="lname"
          error={!!errors?.lname}
        />
        {errors.lname &&
          (<Typography variant='body2'
          component='span' sx={{color: 'red', textAlign: 'left'}}
          >{errors.lname?.message}</Typography>)
        }
        <TextField
          margin="normal"
          fullWidth
          variant='filled'
          id="username"
          label="Username"
          {...register("username", {
          required: 'Username is required',
          })}
          autoComplete="username"
          error={!!errors?.username}
        />
        {errors.username &&
          (<Typography variant='body2'
          component='span' sx={{color: 'red', textAlign: 'left'}}
          >{errors.username?.message}</Typography>)
        }
        { msgLoad.errMsg &&
          (<Typography variant='body2'
          component='span' sx={{color: 'red', textAlign: 'left'}}
          >{msgLoad.errMsg}</Typography>)
        }
        <TextField
          margin="normal"
          fullWidth
          variant='filled'
          id="email"
          label="Email"
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
          (<Typography variant='body2'
          component='span' sx={{color: 'red', textAlign: 'left'}}
          >{errors.email?.message}</Typography>)
        }
        <Box component="div"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            mt: 3
          }}
        >
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
            Upload image (500kb max. Dimension: 700 X 750).
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <LoadingButton
              type="submit"
              onClick={handleSubmit(onSubmit)}
              size="medium"
              loading={msgLoad.isLoading}
              loadingIndicator="Saving..."
              endIcon={<Save />}
              variant="contained"
              sx={{ mt: 3,
                  mb: 1,
                  width: "80%",
                  color: "white",
                  backgroundColor: "#15023a",
                  boxShadow: 4,
                  "&:hover": { backgroundColor: "white", color: "#15023a" }
              }}
              >
              Save
            </LoadingButton>
          </Box>
          <Typography
            component="span"
            variant="body2"
            sx={{color: "red", mb: 5}}
          >
            {!errImg && isError}
          </Typography>
        </Box>
      </Box>
    </>
  )
}
