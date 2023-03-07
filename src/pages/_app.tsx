import '@/styles/globals.scss'
import type { AppType,  AppProps } from 'next/app'
import {NavBar} from "@/Components";
import {WalletProvider} from "@/Context/WalletContext";

const NextApp:AppType = ({ Component, pageProps }: AppProps) => (
  <div>
    <WalletProvider>
        <NavBar />
        <Component {...pageProps} />
    </WalletProvider>
  </div>
);

export default NextApp;
