import { Box, Grid, Typography } from "@mui/material";
import { useAxios } from "../../../../utils/useAxios";
import LoadingPage from "../../LoadingPage";
import Slider from "./Slider";

  const boxStyle = {
    width: "100%",
    height: 200,
    marginRight: 2,
    backgroundColor: "#b8b3c3",
    borderRadius: 2,
    boxShadow: 5,
    display: { xs: "none", lg: "flex", md: "flex", sm: "flex"},
    justifyContent: "start",
    flexDirection: "column"
  }

export default function AdminDashboard() {

    const { response: single, loading, error } = useAxios({
        method: 'GET',
        url: '/user/single_user'
      });

      const { response: category, error: err} = useAxios({
        method: 'GET',
        url: '/user/cat_user'
      });

      const { response: total, error: errors} = useAxios({
        method: 'GET',
        url: '/user/total'
      });

    const boxItem = [
        {
           title: "Single Contest",
           contest: single
        },
        {
            title: "Category Contest",
            contest: category
        },
        {
            title: "Total No of Contests",
            contest: total
        }
      ]

  return (
    <>
        {loading && <LoadingPage/>}
        {error || err || errors ? (<Typography variant="h2" sx={{color: "red"}}>{error || err || errors}</Typography>) : (
        <Grid container spacing={3}>
            {boxItem.map((item, index) => (
            <Grid item key={index}
                xs={12}
                lg={3}
                md={6}
                sm={6}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems:"center",
                }}
            >
            <Box sx={boxStyle} >
                <Box sx={{
                        width: "100%",
                        height: 40,
                        backgroundColor: "#5b4d75",
                        marginTop: 2,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Typography sx={{fontWeight: 600, fontSize: 20, color: "white"}}> {item.title} </Typography>
                </Box>
                <Box
                    sx={{
                        marginTop: 3,
                        height: 50,
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        overflow: "hidden"
                    }}
                >
                    <Typography sx={{fontWeight: 600, color: "#15023a", fontSize: 60, }}>{item.contest}</Typography>
                </Box>
                <Typography
                    sx={{fontWeight: 500,
                        color: "#15023a",
                        fontSize: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 1
                    }}
                >
                    {item.contest > 1 ? ("Contests") : ("Contest")}
                </Typography>
            </Box>
            <Typography
                sx={{
                    display: { xs: "flex", lg: "none", md: "none", sm: "none" },
                    backgroundColor: "#b8b3c3",
                    width: "80%",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 1,
                    fontWeight: 500,
                    fontSize: 20,
                    color: "#15023a"
                }}
            >
                {item.title} : {item.contest}
            </Typography>
            </Grid> ))}
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <Slider />
            </Grid>
        </Grid> )}
    </>
  )
}
