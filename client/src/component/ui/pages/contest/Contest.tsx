import { useState, useEffect } from "react";
import "./contest.scss";
import axios from "axios";
import { Search, SentimentVeryDissatisfied } from "@mui/icons-material";
import { Box, CircularProgress, Grid, InputBase, Typography } from "@mui/material";
import { Link } from "react-router-dom";

interface loadingErr {
  isLoading: boolean,
  isErr: any;
}

export default function Contest() {

  const [query, setQuery] = useState("");
  const [data, setData] = useState<any>([]);
  const [values, setValues] = useState<loadingErr>({
    isLoading: true,
    isErr: null,
  })

  const getUsers = async () => {
    try {
      const res = await axios.get(`/user/contest_list?q=${query}`)

      setValues({...values, isLoading: false, isErr: null})
      setData(res.data)
    } catch (error: any) {
      error.response.status >= 400 &&
      setValues({...values, isLoading: false, isErr: "Server error, please reload the page!"})
    }
  }

  useEffect(() => {
    if (query.length === 0 || query.length > 2) getUsers();
  },[query])

  return (
    <div className="contest" id="contest">
      <h1>Contests</h1>
      <Grid item
        component="form"
        sx={{
          display: "flex",
          justifyContent: {sm: "center", md: "center", lg: "center"},
          alignItems: "center",
          width: "100%"
        }}
      >
        <Box
        sx={{
            p: '8px 4px',
            backgroundColor: "white",
            borderRadius: 1,
            boxShadow: 4,
            marginBottom: 2,
            ml: {sm: 4.5, xs: 3.3}
        }}
        >
          <InputBase
            sx={{ ml: 1, width: {lg: 400, sm: 300, md: 400}}}
            placeholder="Search..."
            inputProps={{ 'aria-label': 'search...' }}
            onChange={(e) => setQuery(e.target.value.toLowerCase())}
          />
          <Search />
        </Box>
      </Grid>
      <div className="container">
        {values.isLoading && <CircularProgress /> }
        {data.length === 0 &&
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "40%",
              height: 250,
              boxShadow: 3,
              backgroundColor: "white",
              borderRadius: 3,
              mt: 4, mb: 2,
              flexDirection: "column"
            }}
          >
            <SentimentVeryDissatisfied sx={{ fontSize: 100,}} />
            <Typography sx={{fontWeight: "100", fontSize: 50, textAlign: "center"}}>
              Sorry
            </Typography>
            <Typography sx={{fontWeight: "600", textAlign: "center"}}>
              There are no ongoing contest at this time.
            </Typography>
          </Box>
        }
        {!values.isErr ? (data.map((d: any)=>(
          <div className="item" key={d._id}>
            <h3
              style={{
                backgroundColor: "#15023a",
                fontSize: "11px",
                fontWeight: 600,
                width: "100%",
                textAlign: "left",
                opacity: 0.8,
                padding: "5px 5px"
              }}>
                {d.contestName.replace(/-/g, ' ').toUpperCase()}
              </h3>
            <Link to={`/contestants/${d.contestName}`} style={{textDecoration: "none"}}>
              <img
              crossOrigin="anonymous"
              src={`http://localhost:8000/${d.image}`} alt="contest" />
            </Link>
          </div>
        ))) :
        <div style={{color: "red"}}>
          {values.isErr}
        </div>}
      </div>
    </div>
  )
}
