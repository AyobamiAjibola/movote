import { Add, ArrowBackIosNew, Remove } from "@mui/icons-material";
import { Box, Button, Fab, Grow, Snackbar, Stack, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { SnackContext } from "../../../context";
import { useAxios } from "../../../utils/useAxios";
import "../../../App.css";
import Paystack from "./Paystack";
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import LoadingPage from "../../users/LoadingPage";
import NotFound from "../../users/NotFound";
import axios from "axios";

interface Resource{
  counter: number
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
  ) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ContestantDetail() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useContext(SnackContext);
  const { response: data, loading, error } = useAxios({
    method: 'GET',
    url: `/contestant/contestant/details/${id}`
  });
console.log(data)
  const { response: contestType } = useAxios({
    method: 'GET',
    url: `/contestant/nonsense/${id}`
  });

  const [values, setValues] = useState<Resource>({
    counter: 1
  })

  const handleInc = () => { setValues({...values, counter: values.counter + 1})};
  const handleDec = () => { setValues({...values, counter: values.counter - 1})};

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
    return;
    }
    setState({...state, delContest: false,});
  };

  const updateVote = async (e: any) => {
    e.preventDefault()
    try {

      const vote = values.counter;
      const res = await axios.put(`http://localhost:8000/contestant/vote/${id}`, {
        vote
      })
        if(res.statusText === 'OK'){setState({...state, updateList: true, voteSuccess: true})
        navigate(-1)}

      } catch (error: any) {
        console.log(error)
    }
  }

  const onChangeNum = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setValues({...values, [e.target.name]: e.target.value})
  }

  return (
    <>
      <Snackbar open={state.delContest} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          Transaction canceled
        </Alert>
      </Snackbar>
      <Box
        sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            height: "100vh", width: "100vw",
            background: 'linear-gradient(45deg, #8A809C, #c2f7f9)'
          }}
        >
        <Fab
          onClick={() => navigate(-1)}
          variant="extended"
          sx={{
            mb: {lg: -1, xs: 2, sm: -1},
            ml: {lg: 4, sm: 4},
            backgroundColor: "transparent"
          }}
        >
          <ArrowBackIosNew />
          <ArrowBackIosNew />
          <Typography sx={{fontWeight: 800}}>Go Back</Typography>
        </Fab>
        {loading && <LoadingPage/>}
        {data !== null ? (
        <Grow
          in={!state.growTransition}
          style={{ transformOrigin: '0 0 0' }}
          {...(!state.growTransition ? { timeout: 1500 } : {})}
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
                boxShadow: 5, mb: 3, ml: 5, mt: 3,
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
                width: "100%", height: 453,
                overflow: "hidden",
                backgroundColor: "#4C4C4C",
                display: {lg: "block", md: "block", sm: "block", xs: "none"}
              }}
            >
              {!error && <img
                alt="contestants"
                crossOrigin="anonymous"
                src={`http://localhost:8000/${data?.image}`}
                style={{
                  height: "100%",
                  maxWidth: "100%",
                  objectFit: "cover"
                }}
              />}
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                backgroundColor: "white",
                boxShadow: 5, mb: 3, ml: 5, mt: 3,
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
                padding: "0px 0px",
                width: "100%",
                height: 453
              }}
            >
              {!error ? (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignContent: "content",
                      width: {lg: "60%", md: "80%", sm: "100%", xs: "80%"},
                      height: 60,
                      border: "1px dashed rgba(138,128,156,0.5)",
                      pt: 1.5,
                      backgroundColor: "transparent",
                      overflow: "hidden"
                    }}
                  >
                    <Typography variant="h6" sx={{fontWeight: 600}}>
                      VOTE FOR {data?.username}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#433461",
                      height: 70,
                      width: "100%",
                      overflow: "hidden",
                      mt: 5
                    }}
                  >
                    {contestType === 'user' && <Typography
                      sx={{
                        textDecorationLine: "line-through",
                        textDecorationStyle: "double",
                        fontWeight:600, color: "white",
                        fontSize: 40
                      }}
                    >
                      N
                    </Typography>}
                    <Typography sx={{fontWeight: 800, color: "white", fontSize: 40}}>
                      {
                        contestType === 'user' ?
                        new Intl.NumberFormat().format(values.counter * 100) :
                        values.counter
                      }
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mt: 6, pb: 2
                    }}
                  >
                    <Fab
                      disabled={values.counter === 1}
                      size={contestType === 'user' ? "small" : "medium"}
                      onClick={handleDec}
                      sx={{ml: 2, mr: 1}}
                    >
                      <Remove/>
                    </Fab>
                    {contestType === 'user' && <input
                      style={{
                        width: "100px",
                        textAlign: "center",
                        fontWeight: 600,
                        fontSize: "30px",
                      }}
                      name='counter'
                      className="contestantDet"
                      value={values.counter}
                      type="number"
                      onChange={onChangeNum}
                    />}
                    <Fab
                      size={contestType === 'user' ? "small" : "medium"}
                      onClick={handleInc}
                      disabled={ contestType === 'userFree' && values.counter === 100 }
                      sx={{
                        mr: 2,
                        ml: 1
                      }}
                    >
                      <Add/>
                    </Fab>
                  </Box>
                  {contestType === 'userFree' && <Button
                    disabled={data?.status === 'pending'}
                    variant="contained"
                    onClick={e => updateVote(e)}
                    sx={{
                      width: "30%",
                      color: "white",
                      backgroundColor: "#433461",
                      boxShadow: 4,
                      '&:hover': {backgroundColor: "white", color: "#433461", fontWeight: 800},
                      mt: 5
                    }}
                  >
                    Send Vote
                  </Button>}
                  {contestType === 'user' &&<Paystack values={values.counter} data={data} />}
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    {data?.status === 'pending' &&
                      <Typography variant="body2"
                        sx={{
                            color: "red",
                            fonWeight: "900",
                            fontSize: "15px",
                            pr: 1, mt: 2
                          }}
                        >
                        This contestant is not active to be voted for
                      </Typography>
                    }
                  </Box>
                </>) :
              (<Typography variant="body1" sx={{color: 'red'}}>
              Network error, Please reload or click <Link to='/'>home</Link>
            </Typography>)}
            </Box>
          </Stack>
        </Grow>) : <NotFound/>}
      </Box>
    </>
  )
}
