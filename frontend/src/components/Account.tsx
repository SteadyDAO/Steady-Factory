import { Button, Skeleton, Tooltip } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import useEtherSWR from "ether-swr";
import { formatEther, parseUnits } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import { ChainList } from "../consts/Networks";
import { shorterAddress } from "../helpers/Wallet";
import InfoIcon from '@mui/icons-material/Info';
import { getContractByAddressName } from "../helpers/Contract";
import { TransactionResponse } from "@ethersproject/providers";

const Account = () => {
  const { account, chainId, library } = useWeb3React();
  const [symbol, setSymbol] = useState<string>('');
  const { data: balance } = useEtherSWR(['getBalance', account, 'latest']);

  useEffect(() => {
    if (chainId) {
      const chain = ChainList.find(item => item.chainId === chainId);
      if (chain) {
        setSymbol(chain.symbol);
      }
    }
  }, [chainId]);

  const getSTTToken = () => {
    const chymeContract = getContractByAddressName('0xd245630fa7f43879d7629475fcba9f086c4edca3', 'Chyme', library.getSigner());
    chymeContract.mint(account, parseUnits(10000 + '', 8))
      .then((transactionResponse: TransactionResponse) => {
      }, (err: any) => {
      });
  }

  const getCGTToken = () => {
    const chymeContract = getContractByAddressName('0x427e22f5ec932fee43887cff7e87f43e3b8d7e0c', 'Chyme', library.getSigner());
    chymeContract.mint(account, parseUnits(10000 + '', 8))
      .then((transactionResponse: TransactionResponse) => {
      }, (err: any) => {
      });
  }

  return (
    <div className="AccountContainer">
      {/* <div className="HoldingTokenContainer">
        <span className="HoldingTokenText">100 CGT</span>
      </div> */}
      {process.env.REACT_APP_MODE !== 'production' ?
        <div className="GetTokenContainer">
          <Button variant="contained" onClick={getSTTToken}>Get STT token</Button>
          <Button variant="contained" onClick={getCGTToken}>Get CGT token</Button>
          <Tooltip title="This use for test only. On production this button will be removed.">
            <InfoIcon />
          </Tooltip>
        </div> : <></>
      }
      <div className="AccountInfoContainer">
        <span className="AccountInfoBalance">{typeof balance !== 'undefined' ? (parseFloat(formatEther(balance)).toFixed(2) + ` ${symbol}`) : <Skeleton width={80} height={35} variant="text" />}</span>
        <span className="AccountInfoAddress">{shorterAddress(account)}</span>
      </div>
    </div>
  );
}

export default Account;
