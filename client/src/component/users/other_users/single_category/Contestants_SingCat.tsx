import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, Fab, Grid, Grow, IconButton, InputBase, Tooltip, Typography, Snackbar, Zoom, Pagination, Avatar, Backdrop, Fade } from '@mui/material';
import { Add, Circle, Delete, ModeEditOutlineOutlined, PersonAddAltSharp, Search, WarningOutlined } from '@mui/icons-material';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { SnackContext, UserContext } from '../../../../context';
import LoadingPage from '../../LoadingPage';
import AddPagination from '../../AddPagination';
import { Link } from 'react-router-dom';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddContestants_SingCat from './AddContestants_SingCat';


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
  isErr: any,
  open: boolean,
  deleteId: any
}

interface StatusProps{
  activateAll?: any,
  deActivateAll?: any,
  activate?: any,
  msgLoad?: any
}

export default function Contestants_SingCat({activateAll, deActivateAll, activate, msgLoad}:StatusProps) {

  const [query, setQuery] = useState("");
  const [datas, setDatas] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [state, setState] = useContext(SnackContext);
  const [scroll, setScroll] = useState<DialogProps['scroll']>('paper');
  const [currItems, setCurrItems] = useState([])
  const [values, setValues] = useState<Pagination>({
    pageCount: 0,
    itemOffset: 0,
    itemsPerPage: 10,
    isLoading: true,
    isErr: null,
    open: false,
    deleteId: null
  })

  const handleClosed = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
    return;
    }
    setState({...state, addContest: false, delContest: false, editContest: false,});
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const dialogOpen = (scrollType: DialogProps['scroll']) => () => {
    setValues({...values, open: true});
    setScroll(scrollType);
  };

  const closeDialog = () => {
    setValues({...values, open: false})
  };

const getContestants = async () => {
  try {
    const res = await axios.get(`http://localhost:8000/contestant/contest/contestants?q=${query}`)

    setValues({...values, isLoading: false, isErr: null})
    setDatas(res.data)
  } catch (error: any) {
    setValues({...values, isLoading: false, isErr: error.message})
  }
}

const deleteContestant = async () => {
  try {
    await axios.delete(`http://localhost:8000/contestant/con/${values.deleteId}`)

    setDatas(datas.filter((data: { _id: string; }) => data._id !== values.deleteId));
    handleClose();
    setState({...state, delContest: true})
  } catch (error) {

  }
}

useEffect(() => {
  if (query.length === 0 || query.length > 2) getContestants();
  setState({...state, updateList: false});
}, [query, state.updateList]);

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
            Contestant was deleted successfully
          </Alert>
        </Snackbar>
        <Snackbar open={state.addContest} autoHideDuration={6000} onClose={handleClosed}>
          <Alert onClose={handleClosed} severity="success" sx={{ width: '100%' }}>
            Successfully added contestant
          </Alert>
        </Snackbar>
        <Snackbar open={state.editContest} autoHideDuration={6000} onClose={handleClosed}>
          <Alert onClose={handleClosed} severity="success" sx={{ width: '100%' }}>
            Successfully edited the contestant
          </Alert>
        </Snackbar>
        </Grid>
        {values.isLoading && <LoadingPage/>}
        {values.isErr && <Typography component='em' sx={{color: 'red', m: 2 }}>{values.isErr}</Typography>}
        {!state.growTransition &&
        <Grow
          in={!state.growTransition}
          style={{ transformOrigin: '0 0 0' }}
            {...(!state.growTransition ? { timeout: 1000 } : {})}
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
                onChange={(e) => setQuery(e.target.value.toLowerCase())}
              />
              <Search />
            </Box>
          </Grid>
          <Grid item
            sx={{
              display: "flex",
              justifyContent: {sm: "left", md: "center", lg: "right"},
              alignItems: "end",
              width: "100%"
            }}
            >
            {msgLoad.isLoading && <LoadingPage />}
            <Box sx={{display: "flex"}}>
              <Button
                variant="text"
                sx={{fontSize: 10, fontWeight: 600, color: "green"}}
                onClick={activateAll}
              >
                Activate All
              </Button>
              <Typography >|</Typography>
              <Button
                variant="text"
                sx={{fontSize: 10, fontWeight: 600, color: "red"}}
                onClick={deActivateAll}
              >
                De-activate All
              </Button>
            </Box>
          </Grid>
            <TableContainer component={Paper}>
              <Table sx={{ width: "100%" }} aria-label="simple table">
                <TableHead>
                  <TableRow sx={{backgroundColor: "#8A809C"}}>
                    <TableCell align="left"><span style={{fontWeight: "bolder", color: "#5B4D75"}}>|</span>&nbsp;S/NO</TableCell>
                    <TableCell align="center"><span style={{fontWeight: "bolder", color: "#5B4D75"}}>|</span>&nbsp;First Name</TableCell>
                    <TableCell align="center"><span style={{fontWeight: "bolder", color: "#5B4D75"}}>|</span>&nbsp;Last Name</TableCell>
                    <TableCell align="center"><span style={{fontWeight: "bolder", color: "#5B4D75"}}>|</span>&nbsp;Username</TableCell>
                    <TableCell align="center"><span style={{fontWeight: "bolder", color: "#5B4D75"}}>|</span>&nbsp;Votes</TableCell>
                    <TableCell align="center"><span style={{fontWeight: "bolder", color: "#5B4D75"}}>|</span>&nbsp;Status</TableCell>
                    <TableCell align="center"><span style={{fontWeight: "bolder", color: "#5B4D75"}}>|</span>&nbsp;Email</TableCell>
                    <TableCell align="center"><span style={{fontWeight: "bolder", color: "#5B4D75"}}>|</span>&nbsp;Avatar</TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {Object.values(currItems).map((data: any, index: number) => (
                    <TableRow
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 }}}
                    >
                      <TableCell align="left" sx={{width: 5}}>{index + 1}</TableCell>
                      <TableCell align="center">{data.fname?.toUpperCase()}</TableCell>
                      <TableCell align="center">{data.lname?.toUpperCase()}</TableCell>
                      <TableCell align="center">{data.username?.toLowerCase()}</TableCell>
                      <TableCell align="center">{data.vote}</TableCell>
                      <TableCell align="center">
                        {data.status === 'pending' &&
                          <Box>
                            <Circle sx={{color: "red", fontSize: "small"}}/>
                            <Button
                              variant="text"
                              sx={{fontSize: 10, fontWeight: 600, color: "red"}}
                              onClick={() => activate(data._id)}
                            >
                              Activate
                            </Button>
                          </Box>
                        }
                        {data.status === 'active' &&
                          <Box>
                            <Circle sx={{color: "green", fontSize: "small"}}/>
                            <Button
                              variant="text"
                              sx={{fontSize: 10, fontWeight: 600, color: "green"}}
                              onClick={() => activate(data._id)}
                            >
                              Activated
                            </Button>
                          </Box>
                        }

                      </TableCell>
                      <TableCell align="center">{data.email}</TableCell>
                      <TableCell align="right">
                        <Avatar>
                          <img
                            crossOrigin='anonymous'
                            src={`http://localhost:8000/${data?.image}`}
                            alt="contest"
                            style={{
                              width: "100%",
                              height: "100%"
                            }}
                          />
                        </Avatar>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip TransitionComponent={Zoom} title="Edit">
                          <IconButton
                            onClick={() => setState({...state, transition: true, editContest: false})}
                            component={Link}
                            to={`/contest/${data._id}`}
                          >
                            <ModeEditOutlineOutlined
                              sx={{fontSize: "md", color: "#15023a", "&:hover": {color: "green"}}}
                            />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip TransitionComponent={Zoom} title="Delete">
                          <IconButton
                            onClick={() => {
                              setValues({...values, deleteId: data._id});
                              handleOpen();
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
                    There are no ongoing contest at this time.
                  </Typography>
                }
            </TableContainer>
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
                <Typography id="modal-modal-description" sx={{ mt: 2, fontWeight: 500, color: "red", mb: 3, textAlign: "center" }}>Are you sure you want to delete this contestant?</Typography>
                <Box sx={{display: "flex", justifyContent: "center"}}>
                  <Button
                    onClick={deleteContestant}
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
                    YES
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
                    NO
                  </Button>
                </Box>
              </Box>
            </Fade>
          </Modal>
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
          <Tooltip
            onClick={dialogOpen('paper')}
            title="Add Contest"
            sx={{
              position: "fixed",
              backgroundColor: "#28651F",
              color: "white",
              "&:hover": {color: "#28651F"},
              bottom: 60,
              left: { xs: "calc(50% - 10px)", md: 600, lg: 600 },
            }}
          >
            <Fab aria-label="add">
              <Add />
            </Fab>
          </Tooltip>
        </Grid>
        <Dialog
          open={values.open}
          onClose={closeDialog}
          scroll={scroll}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">
            <Box component="div" sx={{display: "flex", alignItems: "center", justifyContent: "left"}}>
              <Box aria-label="add"
                sx={{
                  marginBottom: 1,
                  marginTop: 1,
                  marginLeft: 1,
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "white",
                  boxShadow: 5
                }}>
                <PersonAddAltSharp sx={{fontSize: 40, color: "#15023a"}} />
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent
            dividers={scroll === 'paper'}
            tabIndex={-1}
            id="scroll-dialog-description"
          >
            <AddContestants_SingCat closeDialog={closeDialog}/>
          </DialogContent>
        </Dialog>
      </Grid>
    </Grid>
  );
}
