import "./menu.scss";

interface MenuProps {
  menuOpen: any,
  setMenuOpen: any
}

export default function Menu({menuOpen, setMenuOpen}: MenuProps) {
  return (
    <div className={"menu " + (menuOpen && "active")}>
        <ul>
          <li onClick={()=>setMenuOpen(false)}>
              <a href="#about">About-Us</a>
          </li>
          <li onClick={()=>setMenuOpen(false)}>
              <a href="#contest">Contests</a>
          </li>
          <li onClick={()=>setMenuOpen(false)}>
              <a href="#payment">Packages</a>
          </li>
          <li onClick={()=>setMenuOpen(false)}>
              <a href="#contact">Contact-Us</a>
          </li>
        </ul>
    </div>
  )
}
