import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState, createContext } from "react";
import { ethers, Contract, utils } from "ethers";
import { ABI, deployedAddress } from "./constants";

function App() {
  const { ethereum } = window;
  const [aucDatas, setA] = useState();
  const [critialData, setData] = useState({
    account: null,
    chainId: null,
    provider: null,
    isConnected: false,
  });

  const connectWallet = async () => {
    try {
      if (ethereum !== undefined) {
        const _provider = new ethers.providers.Web3Provider(window.ethereum);
        const account = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const _chainId = await ethereum.request({ method: "eth_chainId" });
        if (parseInt(_chainId, 16) !== 5777) {
          alert("Connect to ganache ");
        }
        const _isConnected = ethereum.isConnected();
        setData({
          ...critialData,
          provider: _provider,
          account: account[0],
          chainId: parseInt(_chainId, 16),
          isConnected: _isConnected,
        });
        readAuctionDetails();
      } else if (window.web3) {
        alert("update your metamask");
      } else {
        alert("please install metamask");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getProviderorSigner = async (needSigner = false) => {
    if (needSigner) {
      const signer = await critialData.provider.getSigner();
      const auctionContract = new Contract(deployedAddress, ABI, signer);
      return auctionContract;
    }
    return new Contract(deployedAddress, ABI, critialData.provider);
  };

  const readAuctionDetails = async () => {
    try {
      const auctionContract = await getProviderorSigner();
      const datas = await auctionContract.readAuction();
      setA(datas);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    ethereum.on("accountsChanged", (accounts) => {
      setData({ ...critialData, account: accounts[0] });
    });

    ethereum.on("chainChanged", (_chainId) =>
      setData({ ...critialData, chainId: parseInt(_chainId, 16) })
    );
  }, [critialData.isConnected, critialData.account, critialData.chainId]);

  return (
    <div>
      {critialData.isConnected ? (
        <div>
          {`ADDRESS: ${critialData.account}`}
          <br />
          {`Chain ID: ${critialData.chainId}`}
          <div>
            {aucDatas.map((e, index) => (
              <ol key={index}>
                {/* <li>{utils.formatEther(e[0])}</li> */}
                <li>{e[1]}</li>
                <li>{e[2]}</li>
                {/* <li>{utils.formatEther("e[3]")}</li> */}
                <li>{e[4]}</li>
                <li>{e[5]}</li>
              </ol>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <button onClick={connectWallet}>Connect Wallet</button>
        </div>
      )}
    </div>
  );
}

export default App;
