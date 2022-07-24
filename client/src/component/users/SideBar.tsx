import React, { useContext, useState } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Avatar, ListItem, ListItemButton, ListItemIcon, ListItemText, Snackbar } from '@mui/material';
import { Outlet, Link } from 'react-router-dom';
import { AccountBox, AccountBalanceWallet, Dashboard, Logout, AccountCircle, ArrowDropDown } from '@mui/icons-material';
import { Menu, MenuItem} from '@mui/material';
import { useAxios } from '../../utils/useAxios';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { SnackContext, UserContext } from '../../context';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Footer = styled(Typography)({
  fontSize: 20,
  fontWeight: 400,
  color: "black",
  textAlign: "center"
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const mdTheme = createTheme();

interface logoutProps {
  logout: any
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SideBar({logout}: logoutProps) {

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const opens = Boolean(anchorEl);
  const [state, setState] = useContext(SnackContext)
  const [user] = useContext(UserContext)

  const menuItem=[
    {
        path:"/dashboard",
        name:"Dashboard",
        icon:<Dashboard />
    },
    {
        path:"/contest",
        name: user.data?.isAdmin === 'admin' ? "Contest" : "Contestants",
        icon:<AccountBox />
    },
    {
        path:"/finance",
        name:"Finance",
        icon:<AccountBalanceWallet />
    }
  ]

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleCloseSnack = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setState({
      addContest: false,
      delContest: false,
      editContest: false,
      editPicture: false,
      growTransition: false,
      transition: false,
      updateList: false,
      editProfile: false,
      change: false,
      voteSuccess: false
    })
  };

  const { response } = useAxios({
    method: 'GET',
    url: '/user/user'
  });

  return (
    <ThemeProvider theme={mdTheme}>
      { response !== undefined && <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open} sx={{backgroundColor: "#433461", boxShadow: 1}}>
          <Toolbar
            sx={{
              pr: '24px'
            }}
          >
            <IconButton
              edge="start"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                color: "#E7E5EB",
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              fontWeight={900}
              noWrap
              sx={{ flexGrow: 1 }}
              color="#E7E5EB"
            >
              {response.contestName.replace(/-/g, ' ').toUpperCase()}
            </Typography>
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar>
                <img
                  crossOrigin='anonymous'
                  src={`http://localhost:8000/${response.image}`}
                  alt="contest"
                  style={{
                    width: "100%",
                    height: "100%"
                  }}
                />
              </Avatar>
              <ArrowDropDown sx={{color: "white"}}/>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={opens}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem
                component={Link}
                to={`/view`}
                sx={{"&:hover": {fontWeight: 500, color: "#15023a"}}}
              >
                <ListItemIcon sx={{"&:hover": {color: "#15023a"}}}>
                  <AccountCircle fontSize="medium"/>
                </ListItemIcon>
                View Profile
              </MenuItem>
              <Divider />
              <MenuItem onClick={logout} sx={{"&:hover": {fontWeight: 500, color: "#15023a"}}}>
                <ListItemIcon sx={{"&:hover": {color: "#15023a"}}}>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>

          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}
              sx={{
                color: "#15023a",
                ...(open === false && { display: 'none' }),
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <List component="nav" sx={{marginTop: 15}}>
            {menuItem.map((item, index) => (
              <ListItem key={index} disablePadding sx={{ display: 'block', marginBottom: 1 }}>
                <ListItemButton
                  component={Link} to={item.path}
                  sx={{ minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5}}>
                <ListItemIcon sx={{ '&:hover':{color: "#15023a"}, minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center'}}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText sx={{ opacity: open ? 1 : 0 }}>
                  <Typography
                    variant='body2'
                    component='span'
                    sx={{'&:hover': {fontWeight: 800}, color: "#15023a"}}
                  >{item.name}</Typography>
                </ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: '#E7E5EB',
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Outlet />
            <Grid container spacing={3}>
            <Snackbar open={state.editPicture} autoHideDuration={6000} onClose={handleCloseSnack}>
              <Alert onClose={handleCloseSnack} severity="success" sx={{ width: '100%' }}>
                Image upload was successful!
              </Alert>
            </Snackbar>
            <Snackbar open={state.editProfile} autoHideDuration={6000} onClose={handleCloseSnack}>
              <Alert onClose={handleCloseSnack} severity="success" sx={{ width: '100%' }}>
                Successfully updated your profile.
              </Alert>
            </Snackbar>
              <Grid item xs={12} sx={{display: "flex", justifyContent: "center"}}>
                <Box
                  sx={{
                      p: 2, display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 2,
                      backgroundColor: "white",
                      boxShadow: 5,
                      marginBottom: 5,
                      marginRight: 1,
                      marginTop: 5,
                      width: "100%"
                    }}>
                  <Footer>Welcome {response.company.toUpperCase()}</Footer>
                  <Copyright sx={{ pt: 2 }} />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box> }
    </ThemeProvider>
  );
}