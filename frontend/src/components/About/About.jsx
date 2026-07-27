import React from 'react'
import './About.css';
import { Link } from 'react-router-dom';
import ASMPLogo from '../../assets/images/mk.png'

const About = () => {
  return (
    <div className='about_page'>
      <div className='abt'>
        <img src={ASMPLogo} alt='logo'></img>
      </div>
      <p id='about'>ABOUT ASMP</p>
      <p id='content'>
        Alumni Student Mentorship Program (ASMP) is an initiative by Student Alumni Relations Cell (SARC) with an objective of creating a platform to foster relationships between alumni mentors and students that last forever. ASMP achieves this aim by bringing together alumni mentors and student mentees through various events to help form a rapport and strengthen the connection between them, thus enhancing the IITB Alumni network
      </p>
    </div>
  )
}

export default About