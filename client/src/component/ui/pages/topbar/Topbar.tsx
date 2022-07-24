import "./topbar.scss";
import { Person, Email} from '@mui/icons-material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useState } from "react";
import Login from "../../Login";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  borderRadius: 2,
  bgcolor: 'background.paper',
  border: '0.5px solid #15023a',
  boxShadow: 10,
  p: 4,
};

interface MenuProps {
  menuOpen: any,
  setMenuOpen: any
}

export default function Topbar({menuOpen, setMenuOpen}: MenuProps) {

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className={"topbar " + (menuOpen && "active")}>
      <div className="wrapper">
        <div className="left">
          <a href="#about" className="logo">LOGO</a>
          <div className="itemContainer">
            <Person className="icon" />
            <span>+234 80 319 57690</span>
          </div>
          <div className="itemContainer">
            <Email className="icon" />
            <span>info@gmail.com</span>
          </div>
        </div>
        <div className="right">
          <button onClick={handleOpen}>
              Sign in
          </button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Login />
            </Box>
          </Modal>
          <div className="hamburger" onClick={() => {setMenuOpen(!menuOpen)}}>
            <span className="line1"></span>
            <span className="line2"></span>
            <span className="line3"></span>
          </div>
        </div>
      </div>
    </div>
  )
}
