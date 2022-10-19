import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from './components/Header';
import Footer from './components/Footer';
import SplitPage from './pages/SplitPage';
import BottomNavigate from './components/BottomNavigate';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { IAppConfig } from './models/Base';
import { getAppConfig } from './helpers/Utilities';

const config: IAppConfig = getAppConfig();

const theme = createTheme({
  palette: {
    primary: {
      main: '#F1F5F9',
      contrastText: '#2345DC',
    },
    secondary: {
      main: '#2345DC',
      contrastText: '#F1F5F9',
    }
  },
  typography: {
    fontFamily: [
      'Open Sans',
      'sans-serif'
    ].join(','),
  }
});

const { chains, provider } = configureChains(
  [chain.goerli],
  [
    alchemyProvider({ apiKey: config.NETWORK.ALCHEMY_API_KEY }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Steady DAO',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

function App() {

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ThemeProvider theme={theme}>
          <div className="AppWrapper">
            <HashRouter>
              <Routes>
                <Route path="/" element={
                  <>
                    <Header />
                    <div className="AppContainer">
                      <HomePage />
                    </div>
                  </>
                } />
                <Route path="/split" element={
                  <>
                    <Header />
                    <div className="AppContainer">
                      <SplitPage />
                    </div>
                    <BottomNavigate />
                  </>
                } />
              </Routes>
            </HashRouter>
            <Footer />
          </div>
        </ThemeProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;

(window as any).ethereum?.on('chainChanged', () => {
  window.location.reload();
});

(window as any).ethereum?.on('accountsChanged', (accounts: any) => {
  window.location.reload();
});
