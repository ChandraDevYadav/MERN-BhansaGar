import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <img src={assets.logo} alt=""/>
                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel, totam. Lorem ipsum dolor sit amet consectetur adipisicing elit. In, fugiat.</p>
                {/* <p><span>Code-Hustler Group&nbsp;&nbsp; 8 <sup>sem</sup>&nbsp; Project</span><br /> <br />Eastern College Of Engineering, Tinpaini-3 Biratnagar Morang (Koshi) Nepal</p> */}
                
            </div>
            <div className="footer-content-center">
                <h2>Company</h2>
                <ul>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
            <div className="footer-content-right">
                <h2>Get in touch</h2>
                <ul>
                    <li>+977-9800000000</li>
                    <li>bhansa@gar.com</li>
                </ul>
            </div>
        </div>
        <hr/>
        <div className="footer-social-icons">
                   <a href="https://www.facebook.com/"><img src={'./facebook.png'} alt="facebook.com" /> </a>
                    <img src={'./twitter.png'} alt="" />
                    <img src={'./linkedin.png'} alt="" />
                    <img src={'./instagram.png'} alt="" />
                </div>
        <p className='footer-copyright'>Copyright 2081 © Bhansa-Gar All Right Reserved</p>
    </div>
  )
}

export default Footer