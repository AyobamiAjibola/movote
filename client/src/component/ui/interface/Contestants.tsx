import { KeyboardBackspace, Search } from "@mui/icons-material";
import { Box, Button, CircularProgress, Grow, InputBase, Snackbar, Stack, Typography } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SnackContext } from "../../../context";
import { useAxios } from "../../../utils/useAxios";
import AddPagination from "../../users/AddPagination";
import LoadingPage from "../../users/LoadingPage";
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface Pagination {
  pageCount: number,
  itemOffset: number,
  itemsPerPage: number,
  isLoading: boolean,
  isErr: any,
  query: string,
  data: any
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
  ) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Contestants() {

  const { id } = useParams();
  const [state, setState] = useContext(SnackContext);
  const [currItems, setCurrItems] = useState([]);
  const [values, setValues] = useState<Pagination>({
    pageCount: 0,
    itemOffset: 0,
    itemsPerPage: 8,
    isLoading: true,
    isErr: null,
    query: '',
    data: ([])
  })

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
    return;
    }
    setState({...state, voteSuccess: false,});
  };

  const { response, loading, error } = useAxios({
    method: 'GET',
    url: `/user/current/contest/${id}`
  });

  const getContest = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/contestant/con/${id}?q=${values.query}`)

        if(res.data.data === null){
          setValues({...values, isLoading: false});
        } else if (res.data.data !== null) {
          setValues({...values, data: res.data, isLoading: false, isErr: null})
        }

    } catch (error: any) {
      error.response.status >= 400 &&
      setValues({...values, isLoading: false, isErr: "Server error, please reload the page!"})
    }
  }

  useEffect(() => {
    if (values.query.length === 0 || values.query.length > 2) {
      getContest()
    }
  },[values.query, state.updateList])

  useEffect(() => {
    const endOffset = values.itemOffset + values.itemsPerPage;
    setCurrItems(values.data.slice(values.itemOffset, endOffset));
    setValues({...values, pageCount: Math.ceil(values.data.length / values.itemsPerPage)});
  }, [values.itemOffset, values.itemsPerPage, values.data]);

  return (
    <>
      <Snackbar open={state.voteSuccess} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Thanks for voting
        </Alert>
      </Snackbar>
      <Stack
        direction={{ xs: 'column', sm: 'column' }}
        spacing={{ xs: 1, sm: 2, md: 2, lg: 0 }}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: 'linear-gradient(45deg, #c2f7f9, #8A809C)',
        }}
      >
      <Box
        sx={{
          display: "flex",
          justifyContent: "left",
          alignItems: "center",
          height: 200,
          background: 'transparent',
          width: "80%"
        }}
      >
        {loading && <CircularProgress/>}
        {!error ?
        (<Box
          sx={{
            position: "relative",
            width: "40%",
            height: "100%",
            overflow: "hidden",
            display: {lg: "block", md: "block", sm: "block", xs: "none"}
          }}
        >
            <img
              alt="contest"
              crossOrigin="anonymous"
              src={`http://localhost:8000/${response?.image}`}
              style={{
                position: "absolute",
                marginLeft: 0, marginRight: 0,
                height: "100%",
                width: "100%",
                objectFit: "cover"
              }}
            />
        </Box>) : <Typography component='em' sx={{color: 'red', m: 2 }}>{values.isErr}</Typography>}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alightItems: "center",
            backgroundColor: "#433461",
            width: {lg: "60%", xs: "100%"},
            height: "100%",
            ml: {xs: 2, lg: 0, md: 0, sm: 0},
            flexDirection: "column"
          }}
        >
          <Box sx={{pl: 4, pr: 4, pt: 2, pb: 2}}>
            <Typography variant="body2" sx={{fontWeight: 600, textAlign: "center", color: "white"}}>
              <Typography
                variant="body1"
                component="em"
                sx={{fontWeight: "800", color: "white"}}
              >
                "About Contest"
              </Typography>
              <br/>
                {response !== undefined && response.description}
                {!response?.description && "No description available for this contest..."}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "left",
          alignItems: "center",
          width: "80%",
          borderLeftStyle: "solid",
          borderRightStyle: "solid",
          borderWidth: "1px",
          borderColor: "rgba(138,128,156,0.2)"
        }}
      >
        <Typography component={Link} to='/'
          sx={{
            ml: 1.5, mt: 1,
            fontSize: 15,
            textDecoration: "none",
            color: "black",
            fontWeight: 600
          }}
        >
          <KeyboardBackspace sx={{fontSize: 23}}/> home
        </Typography>
      </Box>
      <Box
        component="form"
        sx={{
          display: "flex",
          justifyContent: {xs: "center"},
          alignItems: "center",
          width: "80%",
          pt: 2,
          borderLeftStyle: "solid",
          borderRightStyle: "solid",
          borderWidth: "1px",
          borderColor: "rgba(138,128,156,0.2)"
        }}
      >
        <Box
          sx={{
            p: '8px 4px',
            borderRadius: 1,
            boxShadow: 4,
            marginBottom: 2,
            backgroundColor: "white"
          }}
        >
          <InputBase
            sx={{ ml: 1, width: {lg: 400, sm: 300, md: 400}}}
            placeholder="Search..."
            inputProps={{ 'aria-label': 'search...' }}
            onChange={(e) => setValues({...values, query: e.target.value.toLowerCase()})}
          />
          <Search />
        </Box>
      </Box>
      {values.isLoading && <LoadingPage/>}
      {/* {values.errors && <Typography sx={{color: "red"}}>{values.errors}</Typography>} */}
      {!state.growTransition &&
        <Grow
          in={!state.growTransition}
          style={{ transformOrigin: '0 0 0' }}
            {...(!state.growTransition ? { timeout: 1500 } : {})}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "auto",
              flexWrap: "wrap",
              background: 'transparent',
              width: "80%",
              pl: 8, pr: 8, pt: 4, pb: 4,
              borderTopStyle: "none",
              borderLeftStyle: "solid",
              borderRightStyle: "solid",
              borderWidth: "1px",
              borderColor: "rgba(138,128,156,0.2)"
            }}
          >
            {currItems && currItems.length > 0 ?
              (Object.values(currItems)?.map((d: any) => (
              <Box component="div" key={d._id}
                sx={{display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                <Box
                  sx={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 180,
                    height: 200,
                    backgroundColor: "#D0CCD7",
                    boxShadow: 4,
                    borderRadius: 1.5,
                    marginTop: 5,
                    pt: 8,
                    mr: 1, ml: 2, mb: 4
                  }}
                >
                  <Typography variant="body2" component="span"
                    sx={{
                      fontWeight: 600,
                      fontSize: 25,
                      color: "#2C1B4D"
                    }}
                  >
                    {d.username}
                  </Typography>
                  {/* <Typography variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: 25,
                      border: "1px dashed rgba(138,128,156,0.2)",
                      width: "50%",
                      textAlign: "center",
                      mt: 0.8,
                      color: "#5B4D75"
                    }}
                  >
                    {d.vote}
                  </Typography> */}
                  <Button
                    variant="contained"
                    component={Link}
                    to={`/vote/${d.username}`}
                    onClick={() => setState({...state, change: true})}
                    sx={{
                      width: "30%",
                      color: "white",
                      backgroundColor: "#433461",
                      boxShadow: 4,
                      '&:hover': {backgroundColor: "white", color: "#433461", fontWeight: 800},
                      mt: 2, mb: 2
                    }}
                  >
                    Vote
                  </Button>
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    marginTop: -22,
                    width: 130,
                    height: 130,
                    borderRadius: 1.5,
                    boxShadow: 3, ml: 1
                  }}
                >
                  <img
                    alt="contest"
                    crossOrigin="anonymous"
                    src={`http://localhost:8000/${d !== undefined && d.image}`}
                    style={{
                      position: "absolute",
                      marginLeft: 0, marginRight: 0,
                      height: "100%",
                      width: "100%",
                      objectFit: "cover"
                    }}
                  />
                </Box>
              </Box>
              ))) : <Typography sx={{color: "#4C4C4C"}} variant="h6">No results found!</Typography>
            }
          </Box>
        </Grow>}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "80%",
            borderTopStyle: "none",
            borderLeftStyle: "solid",
            borderRightStyle: "solid",
            borderWidth: "1px",
            borderColor: "rgba(138,128,156,0.2)"
          }}
        >
          <AddPagination
            data={values.data}
            itemsPerPage={values.itemsPerPage}
            pageCount={values.pageCount}
            setValues={setValues}
            values={values}
          />
        </Box>
      </Stack>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
          backgroundColor: "#433461"
        }}
        >
          <Typography variant="body1" sx={{color: "white"}}>
            copyright@vote.com
          </Typography>
      </Box>
    </>
  )
}