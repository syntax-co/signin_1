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



export async function getServerSideProps(context) {
  const session = await getSession(context);

  var data={}

  if (session) {
    data['user'] = session.user;
  }

  return {
    props: {data:data},
  }
}

