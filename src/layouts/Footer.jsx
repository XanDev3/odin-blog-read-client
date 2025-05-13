import React from 'react'
import { FaGithub } from 'react-icons/fa6'
import styled from 'styled-components'
/* import {FooterWrapper, GithubLink} from './Footer.styles.js' */

export default function Footer(){
    return(
        <FooterWrapper>
            Xander© 2024
            <GithubLink 
             href="https://github.com/xandev3/odin-blog-read-client"
             target="_blank"
             rel="noopener" >
            <FaGithub size="1.25em" /> 
            </GithubLink>
            
        </FooterWrapper>
    )
}



export const FooterWrapper = styled.footer`
  position: fixed;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: .3rem 0;  
  font-size: 1.2rem;
  background: rgb(10, 10, 35);
  color:rgb(97, 218, 251);
`

export const GithubLink = styled.a`
  display: flex;
  text-decoration: none;
  margin-left: 1rem;
  color: rgb(97, 218, 251); 
  transition: transform 0.15s ease-in-out;

  &:hover {
    transform: rotate(360deg) scale(1.05);
    color: rgb(55, 55, 255) ;
  }
`
