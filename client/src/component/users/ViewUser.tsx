import {
  Avatar,
  Backdrop,
  Box,
  Button,
  Fade,
  FormLabel,
  Grid,
  IconButton,
  Modal,
  TextareaAutosize,
  TextField,
  Typography} from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAxios } from "../../utils/useAxios";
import EditUser from "./EditUser";
import { Edit, Save } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import LoadingPage from "./LandingPage";
import { SnackContext } from "../../context";

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width:300,
  bgcolor: 'background.paper',
  border: '2px solid white',
  boxShadow: 10,
  borderRadius: 1,
  p: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center"
};

const ProfileImage = {
  width: 200,
  height: 200,
  overflow: "hidden",
}

const Wrapper = {
  position: "relative" as "relative",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "space-between"
}

const styleImg = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
  display: "flex",
  alignItems: "center",
  JustifyContent: "center",
  flexDirection: "column"
};

export default function ViewUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { response, loading, error } = useAxios({
    method: 'GET',
    url: '/user/user'
  });

  const [opened, setOpened] = useState(false);
  const [fileName, setFileName] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [state, setState] = useContext(SnackContext);

  const handleOpen = () => setOpened(true);
  const handleClosed = () => setOpened(false);

  //edit image modal
  const [openImg, setOpenImg] = useState(false);
  const handleOpenImg = () => setOpenImg(true);
  const handleCloseImg = () => setOpenImg(false);

  const onSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("image", fileName);

     const response = await axios.put("/user/users/image", formData);

     if(response.statusText === "OK"){
        setState({...state, editPicture: true})
     }
      navigate("/land")
    } catch (errors: any) {
      setErrMsg(errors.response.data.errors)
    }
  };

  const { register, reset } = useForm({
    mode: 'onTouched',
    criteriaMode: 'firstError',
    reValidateMode: 'onBlur'
  });

  const onChangeFile = (e: any) => {
    setFileName(e.target.files[0]);
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  useEffect(() => {
    if(response !== undefined) {
      reset({
        email: response?.email,
        company: capitalizeFirstLetter(response?.company),
        contestName: capitalizeFirstLetter(response?.contestName),
        description: response?.description
      });
    }
	}, [reset, response]);

  return (
    <Grid
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      {loading && <LoadingPage/>}
      {error ? (<Typography variant="h1" sx={{color: "red"}}>{error}</Typography>) : (
      <Grid item
        container
        spacing={1}
        component='form'
        sx={{
          maxWidth: "60%",
          boxShadow: 5,
          paddingRight: 1.5,
          marginTop: 4,
          marginBottom: 4,
          paddingTop: 3,
          backgroundColor: "white"
        }}
      >
        <Grid item xs={12} style={Wrapper}>
          <IconButton
            onClick={handleOpenImg}
            sx={{
                zIndex: 1,
                position: "absolute",
                backgroundColor: "white",
                marginLeft: 1,
                marginBottom: 1,
                "&:hover": {
                  color: " white"
                }
              }}
          >
            <Edit sx={{fontSize: "medium"}}/>
          </IconButton>
          <Box sx={ProfileImage}>
            <img
              alt="contestImg"
              crossOrigin="anonymous"
              src={`http://localhost:8000/${response?.image}`}
              style={{
                height: "100%",
                width: "100%",
                objectFit: "cover"
              }}
            />
          </Box>
        </Grid>
        <Modal
          open={openImg}
          onClose={handleCloseImg}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={styleImg}>
            <Box component="form" mt={1} encType="multipart/form-data">
              <input
                style={{fontSize: "17px", cursor: "pointer"}}
                accept="image/*"
                name="image"
                onChange={onChangeFile}
                type="file"
              />
              {errMsg && <Typography variant='body2' mt={1}
              component='span' sx={{color: 'red', textAlign: 'left'}}
              >{errMsg}</Typography>}
              <Box sx={{display: "flex", justifyContent: "center", marginTop: 3}}>
                <Button variant="contained" onClick={onSubmit} endIcon={<Save />}>
                  Save
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>
        <Grid item xs={12}>
          <TextField
            margin="normal"
            fullWidth
            variant='filled'
            id="viewEmail"
            label="Email Address"
            {...register("email", {
            })}
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
          margin="normal"
          fullWidth
          variant='filled'
          id="viewCompany"
          label="Company Name"
          {...register("company", {
          })}
          InputProps={{
            readOnly: true,
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        </Grid>
        <Grid item xs={12}>
          <TextField
            margin="normal"
            fullWidth
            variant='filled'
            id="viewContest"
            label="Contest Name"
            {...register("contestName", {
              required: 'Contest name is required',
            })}
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="filled-multiline-static"
            label="Contest Description"
            multiline
            rows={4}
            variant="filled"
            fullWidth
            {...register("description", {
            })}
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
          <Grid
            item xs={12}
            sx={{display: "flex", alignItems: "center", justifyContent: "center"}}
          >
          <Grid
            item xs={12}
            sx={{display: "flex", alignItems: "center", justifyContent: "center"}}
          >
          <Button
            variant="contained"
            onClick={handleOpen}
            endIcon={<Edit />}
            sx={{ mt: 3,
              mb: 2,
              width: "50%",
              color: "white",
              backgroundColor: "#15023a",
              boxShadow: 4,
              "&:hover": { backgroundColor: "white", color: "#15023a" }
            }}
          >
            Edit
          </Button>
          </Grid>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={opened}
            onClose={handleClosed}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={opened}>
              <Box sx={style}>
                <Box>
                  <EditUser response={response} />
                </Box>
              </Box>
            </Fade>
          </Modal>
        </Grid>
      </Grid> )}
    </Grid>
  )
}
