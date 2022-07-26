import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, Fab, Grid, Grow, IconButton,
  InputBase, Tooltip, Typography, Snackbar, Zoom,
  Pagination, Fade, Backdrop } from '@mui/material';
import { Add, Delete, Search, SentimentVeryDissatisfied, WarningOutlined } from '@mui/icons-material';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AddContest from './AddContest';
import Modal from '@mui/material/Modal';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { SnackContext } from '../../../../context';
import LoadingPage from '../../LoadingPage';
import AddPagination from '../../AddPagination';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column"
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
  ) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

interface Pagination {
  pageCount: number,
  itemOffset: number,
  itemsPerPage: number,
  isLoading: boolean,
  isErr: any;
  delId: any;
}

export default function Contest() {

  const [query, setQuery] = useState("");
  const [datas, setDatas] = useState<any>([]);
  const [contest, setContest] = useState(false);
  const [open, setOpen] = useState(false);
  const [updList, setUpdList] = useState(false);
  const [state, setState] = useContext(SnackContext);
  const [currItems, setCurrItems] = useState([]);

  const [values, setValues] = useState<Pagination>({
    pageCount: 0,
    itemOffset: 0,
    itemsPerPage: 10,
    isLoading: true,
    isErr: null,
    delId: null,
  })

  const handleClosed = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
    return;
    }
    setState({...state, addContest: false, delContest: false});
};

const handleOpen = () => setOpen(true);
const handleClose = () => setOpen(false);

const getUsers = async () => {
  try {
    const res = await axios.get(`http://localhost:8000/user/users?q=${query}`)

    setValues({...values, isLoading: false, isErr: null})
    setDatas(res.data)
  } catch (error: any) {
    setValues({...values, isLoading: false, isErr: error.message})
  }
}

const deleteContest = async () => {
  try {
    await axios.delete(`http://localhost:8000/user/users/${values.delId}`)

    setDatas(datas.filter((data: { _id: string; }) => data._id !== values.delId));
    handleClose();
    setState({...state, delContest: true})
  } catch (error) {

  }
}

const handleClick = () => {
  setContest(true)
}

useEffect(() => {
  if (query.length === 0 || query.length > 2) getUsers();
  setUpdList(false);
}, [query, updList]);

useEffect(() => {
  const endOffset = values.itemOffset + values.itemsPerPage;
  setCurrItems(datas.slice(values.itemOffset, endOffset));
  setValues({...values, pageCount: Math.ceil(datas.length / values.itemsPerPage)})
}, [values.itemOffset, values.itemsPerPage, datas]);

  return (
    <Grid container item
    >
      <Grid item
        sx={{
          display: "flex",
          flexDirection: "column",
          overflowX: "auto",
          width: "100%"
        }}
      >
        <Grid item sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
        >
        <Snackbar open={state.delContest} autoHideDuration={6000} onClose={handleClosed}>
          <Alert onClose={handleClosed} severity="success" sx={{ width: '100%' }}>
            Contest was deleted successfully
          </Alert>
        </Snackbar>
        <Snackbar open={state.addContest} autoHideDuration={6000} onClose={handleClosed}>
          <Alert onClose={handleClosed} severity="success" sx={{ width: '100%' }}>
            Successfully added contest
          </Alert>
        </Snackbar>
        {contest && <AddContest setContest={setContest} contest={contest} setUpdList={setUpdList}/>}
        </Grid>
        {values.isLoading && <LoadingPage/>}
        {values.isErr && <Typography component='em' sx={{color: 'red', m: 2 }}>{values.isErr}</Typography>}
        {!contest &&
        <Grow
          in={!contest}
          style={{ transformOrigin: '0 0 0' }}
            {...(!contest ? { timeout: 1000 } : {})}
        >
        <Grid item
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column"
          }}
        >
          <Grid item
            component="form"
            sx={{
              display: "flex",
              justifyContent: {sm: "left", md: "center", lg: "center"},
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
          <TableContainer component={Paper} sx={{maxWidth: "90%"}}>
            <Table sx={{ width: "100%" }} aria-label="simple table">
              <TableHead>
                <TableRow sx={{backgroundColor: "#8A809C"}}>
                  <TableCell align="left"><span style={{fontWeight: "bolder", color: "#5B4D75"}}>|</span>&nbsp;S/NO</TableCell>
                  <TableCell align="center"><span style={{fontWeight: "bolder", color: "#5B4D75"}}>|</span>&nbsp;Email</TableCell>
                  <TableCell align="center"><span style={{fontWeight: "bolder", color: "#5B4D75"}}>|</span>&nbsp;Company</TableCell>
                  <TableCell align="center"><span style={{fontWeight: "bolder", color: "#5B4D75"}}>|</span>&nbsp;Contest Name</TableCell>
                  <TableCell align="center"><span style={{fontWeight: "bolder", color: "#5B4D75"}}>|</span>&nbsp;User Type</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {Object.values(currItems).map((data: any, index: number) => (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="left" sx={{width: 5}}>{index + 1}</TableCell>
                    <TableCell align="center">{data.email}</TableCell>
                    <TableCell align="center">{data.company?.toUpperCase()}</TableCell>
                    <TableCell align="center">{data.contestName?.toUpperCase()}</TableCell>
                    <TableCell align="center">{data.isAdmin?.toUpperCase()}</TableCell>
                    <TableCell align="center">
                      <Tooltip TransitionComponent={Zoom} title="Delete">
                        <IconButton
                          onClick={() =>{
                            setValues({...values, delId: data._id})
                            handleOpen()
                          }}
                        >
                          <Delete sx={{fontSize: "md", color: "#15023a", "&:hover": {color: "red"}}}/>
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {currItems.length === 0 &&
              <Typography sx={{fontWeight: "400", textAlign: "center", color: "red"}}>
                No result found!
              </Typography>
            }
          </TableContainer>
          <Grid sx={{mt: 2}} >
            <AddPagination
              data={datas}
              itemsPerPage={values.itemsPerPage}
              pageCount={values.pageCount}
              setValues={setValues}
              values={values}
            />
          </Grid>
        </Grid>
        </Grow>}
        <Grid item>
          {!contest && <Tooltip
          onClick={handleClick}
          title="Add Contest"
          sx={{
            position: "fixed",
            backgroundColor: "#28651F",
            color: "white",
            "&:hover": {color: "#28651F"},
            bottom: 60,
            left: { xs: "calc(50% - 10px)", md: 600, lg: 600 }
          }}
          >
            <Fab aria-label="add">
              <Add />
            </Fab>
          </Tooltip>}
        </Grid>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h5" component="h2" sx={{fontWeight: 600}}>
                Confirmation <WarningOutlined sx={{color: "black"}} />
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2, textAlign: "center" }}>
                Deleting this contest will delete all the contestants associated with it.
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2, fontWeight: 500, color: "red", mb: 3 }}>Are you sure you want to delete this contest?</Typography>
              <Box sx={{display: "flex", justifyContent: "center"}}>
                <Button
                  onClick={deleteContest}
                  size="small"
                  variant="contained"
                  sx={{
                    mb: 2,
                    mr: 5,
                    width: "50%",
                    color: "white",
                    backgroundColor: "red",
                    boxShadow: 4,
                    "&:hover": { backgroundColor: "white", color: "red" }
                  }}
                >
                  Delete
                </Button>
                <Button
                  onClick={handleClose}
                  size="small"
                  variant="contained"
                  sx={{
                    mb: 2,
                    width: "50%",
                    color: "white",
                    backgroundColor: "green",
                    boxShadow: 4,
                    "&:hover": { backgroundColor: "white", color: "green" }
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </Grid>
    </Grid>
  );
}
