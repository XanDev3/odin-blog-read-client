import React from 'react'
import { FaGithub } from 'react-icons/fa6'


export default function Footer(){
    return(
        <footer className="footer bottom-0 flex items-center justify-center w-full p-3 mt-3 text-xl bg-dark-navy text-sky-blue">
            Xander© 2024
            {/* <GithubLink  */}
            <a
             className="github-link flex decoration-none ml-1 text-sky-blue transform transition ease-in-out duration-150 hover:rotate-360 hover:scale-105 hover:text-my-blue"
             href="https://github.com/xandev3/odin-blog-read-client"
             target="_blank"
             rel="noopener" >
            <FaGithub size="1.25em" /> 
            </a>
            {/* </GithubLink> */}
            
        </footer>
    )
}



