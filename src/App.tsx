import AppRouter from './routers'
import {mainnet, moonbeam} from 'wagmi/chains'
import {InjectedConnector} from 'wagmi/connectors/injected'
import {WalletConnectConnector} from 'wagmi/connectors/walletConnect'
import {publicProvider} from 'wagmi/providers/public'
import {configureChains, createConfig, WagmiConfig} from 'wagmi'
import UserProvider from './components/provider/UserProvider/UserProvider'
import DialogProvider from './components/provider/DialogProvider/DialogProvider'
import LangProvider from './components/provider/LangProvider/LangProvider'
import PageBacProvider from "./components/provider/PageBackProvider";
import {Client as Styletron} from 'styletron-engine-atomic'
import {Provider as StyletronProvider} from 'styletron-react'
import {BaseProvider} from 'baseui'
import theme from './theme'
import Subscriber from './components/base/Subscriber'
import {BrowserRouter} from 'react-router-dom'
import './styles/index.less'
import { Analytics } from '@vercel/analytics/react'
import EventHomeProvider from "./components/provider/EventHomeProvider/EventHomeProvider";
import MapProvider from "./components/provider/MapProvider/MapProvider";

const engine = new Styletron();

// const walletconnect = new WalletConnectConnector({
//     chains: [mainnet, moonbeam],
//     options: {
//         qrcode: true,
//         qrcodeModalOptions: {
//             registryUrl: '/wallets/wallets.json'
//         }
//     },
// })

const {chains, publicClient, webSocketPublicClient} = configureChains(
    [mainnet, moonbeam],
    [publicProvider()],
)

const config = createConfig({
    autoConnect: true,
    publicClient,
    webSocketPublicClient,
})

function App() {
    return (
        <BrowserRouter>
            <div id="solas">
                <PageBacProvider>
                    <WagmiConfig config={config}>
                        <StyletronProvider value={engine}>
                            <BaseProvider theme={theme}>
                                <DialogProvider>
                                    <UserProvider>
                                        <LangProvider>
                                            <DialogProvider>
                                                <Subscriber/>
                                                <EventHomeProvider>
                                                    <MapProvider>
                                                        <AppRouter/>
                                                    </MapProvider>
                                                </EventHomeProvider>
                                            </DialogProvider>
                                        </LangProvider>
                                    </UserProvider>
                                </DialogProvider>
                            </BaseProvider>
                        </StyletronProvider>
                    </WagmiConfig>
                </PageBacProvider>
            </div>
            <Analytics />
        </BrowserRouter>
    )
}

export default App
