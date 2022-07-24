import { Box, Grid, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import LoadingPage from '../../LoadingPage';
import BarChart from './Barchart';

const Item = {
  textAlign: 'center',
  color: "white",
  width: 300,
  height: 300,
  backgroundColor: "#b8b3c3",
  borderRadius: 2,
  boxShadow: 5,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column"
};

interface Resource{
  data: any,
  isLoading: boolean,
  isErr: any
}
export default function Dashboard_SingCat() {

  const [values, setValues] = useState<Resource>({
    data: 0,
    isLoading: true,
    isErr: null
  });

  const getVotes = async () => {
    try {
      setValues({...values, isLoading: false});
      const res = await axios.get('/contestant/contest/vote')
      setValues({...values, data: res.data, isLoading: false, isErr: null})
    } catch (error: any) {
      error.response.status >= 400 && setValues({...values, isErr: "Not Found"})
      setValues({...values, isLoading: false,})
    }
  }

  useEffect(() => {
    getVotes()
  }, [])

  return (
    <>
      {values.isLoading && <LoadingPage/>}
      <Stack
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 5,
        }}
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
      >
        <Box sx={Item}>
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              backgroundColor: "#5b4d75",
              marginTop: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Typography sx={{fontWeight: 600, fontSize: 20, color: "white"}}> VOTES </Typography>
          </Box>
          <Box
            sx={{
              marginTop: 2,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden"
            }}
          >
              <Typography
                component="span"
                sx={{
                  fontWeight: 600,
                  color: "#15023a",
                  fontSize: 40,
                }}>
                  {!values.isErr ?
                  new Intl.NumberFormat().format(values.data) :
                  (<Typography sx={{color: "red"}}>{values.isErr}</Typography>)}
              </Typography>
          </Box>
          <Box
            sx={{
              marginTop: 2,
              marginBottom: 2,
              width: "70%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Typography
            component="em"
            sx={{
              fontSize: 18,
              color: "#15023a",
              fontWeight: 300
            }}>
              Total number of votes for this contest
            </Typography>
          </Box>
        </Box>
        <Box sx={Item}>
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              backgroundColor: "#5b4d75",
              marginTop: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Typography sx={{fontWeight: 600, fontSize: 20, color: "white"}}> AMOUNT </Typography>
          </Box>
          <Box
            sx={{
              marginTop: 2,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                color: "#15023a",
                fontSize: 40,
                textDecorationLine: "line-through",
                textDecorationStyle: "double"
              }}>N</Typography>
            <Typography
              component="span"
              sx={{
                fontWeight: 600,
                color: "#15023a",
                fontSize: 40
              }}>
                {!values.isErr ?
                  new Intl.NumberFormat().format(values.data * 50) :
                  (<Typography sx={{color: "red"}}>{values.isErr}</Typography>)}
            </Typography>
          </Box>
          <Box
              sx={{
                marginTop: 2,
                marginBottom: 2,
                width: "70%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
            <Typography
            component="em"
            sx={{
                fontSize: 18,
                color: "#15023a",
                fontWeight: 300
              }}>
                Amount generated from the votes
            </Typography>
          </Box>
        </Box>
      </Stack>
      <Grid item >
        <Box component='div' sx={{maxWidth: '100%', margin: 'auto'}}>
          <BarChart />
        </Box>
      </Grid>
    </>
  )
}

