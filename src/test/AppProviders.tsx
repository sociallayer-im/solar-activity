import LangProvider from '../components/provider/LangProvider/LangProvider'
import DialogProvider from  '../components/provider/DialogProvider/DialogProvider'
import UserProvider from '../components/provider/UserProvider/UserProvider'
import {mainnet, moonbeam} from 'wagmi/chains'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { Client as Styletron } from 'styletron-engine-atomic'
import { Provider as StyletronProvider } from 'styletron-react'
import { BaseProvider } from 'baseui'
import theme from '../theme'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { useLocation } from "react-router-dom";

const engine = new Styletron();

const {chains, publicClient, webSocketPublicClient} = configureChains(
    [mainnet, moonbeam],
    [publicProvider()],
)

const config = createConfig({
    autoConnect: true,
    publicClient,
    webSocketPublicClient,
})

interface AppProvidersProps {
    children?: any
}

function TestContent (props: {component: any}) {
    const location = useLocation()
    return <>
        { props.component }
        <div>当前路由：<span>{ location.pathname }</span></div>
    </>
}

function AppProviders (props: AppProvidersProps) {
    return (
        <MemoryRouter>
            <WagmiConfig config={ config as any }>
                <StyletronProvider value={ engine }>
                    <BaseProvider theme={ theme }>
                        <DialogProvider>
                            <UserProvider>
                                <LangProvider>
                                    <DialogProvider>
                                        <Routes>
                                            <Route path="*" element={ <div>
                                                <TestContent component={props.children}></TestContent>
                                            </div> } />
                                        </Routes>
                                    </DialogProvider>
                                </LangProvider>
                            </UserProvider>
                        </DialogProvider>
                    </BaseProvider>
                </StyletronProvider>
            </WagmiConfig>
        </MemoryRouter>
    )
}

export default AppProviders
