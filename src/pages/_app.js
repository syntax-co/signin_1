import { SessionProvider } from "next-auth/react"
import '../styles/App.css';

export default function App({ Component, pageProps }) {
  return (
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    )
}
