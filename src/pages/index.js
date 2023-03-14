import { useEffect } from "react"
import Votepage from "./Votepage"
import { getSession } from "next-auth/react";



export default function Home(pageProps) {
  
  

  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
      <Votepage {...pageProps} />
    </div>
  )
}




