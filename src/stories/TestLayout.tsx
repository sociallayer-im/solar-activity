import {BrowserRouter, useNavigate} from 'react-router-dom'
import {BaseProvider, useStyletron} from 'baseui'
import { useState, useContext, useEffect, ReactNode } from 'react'
import { Client as Styletron } from "styletron-engine-atomic";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { mainnet, moonbeam } from "wagmi/chains";
import { InjectedConnector } from "@wagmi/core";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import {Provider as StyletronProvider} from "styletron-react";
import theme from "../theme";
import DialogProvider from "../components/provider/DialogProvider/DialogProvider";
import UserProvider from "../components/provider/UserProvider/UserProvider";
import LangProvider from "../components/provider/LangProvider/LangProvider";
import Subscriber from "../components/base/Subscriber";
import AppRouter from "../routers";
import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import '../styles/index.less'
import { Buffer } from 'buffer'

window.Buffer = Buffer

const engine = new Styletron();

const walletconnect = new WalletConnectConnector({
    chains: [mainnet, moonbeam],
    options: {
        qrcode: true,
    },
})

const inject = new InjectedConnector({
    chains: [mainnet, moonbeam],
})

const { chains, provider } = configureChains(
    [mainnet, moonbeam],
    [publicProvider()],
)

const wagmiClient = createClient({
    autoConnect: true,
    connectors: [inject, walletconnect],
    provider,
})

interface TextLayoutProps {
    views: {path: string, element: ReactNode}[]
}

function TextLayout (props: TextLayoutProps) {

    return ( <BrowserRouter>
        <div id="solas">
            <WagmiConfig client={ wagmiClient }>
                <StyletronProvider value={ engine }>
                    <BaseProvider theme={ theme }>
                        <DialogProvider>
                            <UserProvider>
                                <LangProvider>
                                    <DialogProvider>
                                        <Subscriber />
                                        <Suspense>
                                            <Routes>
                                                {
                                                   props.views.map((item, index) => {
                                                       return <Route key={index} path={item.path} element={item.element}></Route>
                                                   })
                                                }
                                            </Routes>
                                         </Suspense>
                                    </DialogProvider>
                                </LangProvider>
                            </UserProvider>
                        </DialogProvider>
                    </BaseProvider>
                </StyletronProvider>
            </WagmiConfig>
        </div>
    </BrowserRouter>)
}

export default TextLayout
