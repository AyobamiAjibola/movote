import { ArrowCircleUp, Check, Close } from "@mui/icons-material";
import { Box, IconButton, LinearProgress, styled, Tooltip, Typography, Zoom } from "@mui/material";
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SnackContext } from "../../../../context";

const Input = styled('input')({
    display: 'none',
  });

interface Things{
isLoading: boolean,
errMsg: string
}

interface ValProps{
    values?: any,
    setValues?: any
}

export function ImageEdit({values, setValues}: ValProps) {

    const { id } = useParams();
    const navigate = useNavigate();
    const [fileName, setFileName] = useState<any>();
    const [errImg, setErrImg] = useState('');
    const [isError, setIsError] = useState('');
    const [state, setState] = useContext(SnackContext)
    const [msgLoad, setMsgLoad] = useState<Things>({
        errMsg: '',
        isLoading: false,
      });

    const onChangeFile = (e:any) => {
        setFileName(e.target.files[0]);
      }

      const onSubmit = async () => {
        try {
          setMsgLoad({...msgLoad, isLoading: true})
          const formData = new FormData();
          formData.append("image", fileName);

         const res = await axios.put(`http://localhost:8000/contestant/con/image/${id}`, formData);
         setMsgLoad({...msgLoad, isLoading: false})
         if(res.data.errors){
                return setMsgLoad({...msgLoad, errMsg: res.data.errors[0].msg })
          }
        if(res.statusText === 'OK') {
            setState({...state, editPicture: true})
            navigate('/contest')
        }

        } catch (err: any) {
            setErrImg(err.response.data.errors)
            err.response.status >= 400 && setIsError("Server error, please reload the page")
            setMsgLoad({...msgLoad, isLoading: false})
        }
      };

    return (
        <>
            <Box component="div"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                mt: 15,
                p: "0px 20px"
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
                Upload image (60kb max).
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
                justifyContent: "center",
                }}
            >
            <Tooltip
                TransitionComponent={Zoom}
                title="save"
            >
                <IconButton sx={{mt: 3, mb: 1}} onClick={onSubmit}>
                    <Check sx={{color: "green"}}/>
                </IconButton>
            </Tooltip>
            <Tooltip
                TransitionComponent={Zoom}
                title="close"
            >
                <IconButton sx={{mt: 3, ml: 2, mb: 1}} onClick={() => setValues({...values, img: false})}>
                    <Close sx={{color: "red"}}/>
                </IconButton>
            </Tooltip>
            </Box>
            {msgLoad.isLoading && <Box sx={{width:"100%"}}><LinearProgress color="success" /></Box>}
            <Typography
                component="span"
                variant="body2"
                sx={{color: "red", mb: 5}}
            >
                {!errImg && isError}
            </Typography>
            </Box>
        </>
    )
}