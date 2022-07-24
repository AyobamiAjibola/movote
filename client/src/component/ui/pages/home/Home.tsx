import React, { useState } from 'react'

import AboutUs from "../aboutUs/AboutUs";
import Contest from "../contest/Contest";
import Payment from "../payment/Payment";
import Topbar from "../topbar/Topbar";
import Contact from "../contact/Contact";
import Footer from "../footer/Footer";
import Menu from "../menu/Menu";

import "./home.scss";

export default function Home() {
    const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="app">
          <Topbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
          <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
          <div className="sections">
            <AboutUs />
            <Contest />
            <Payment />
            <Contact />
            <Footer />
          </div>
        </div>
  )
}
