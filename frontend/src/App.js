import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState, createContext } from "react";
import { ethers, Contract, utils } from "ethers";
import { ABI, deployedAddress } from "./constants";
import { Button, box } from "@mui/material";
import AuctionDetails from "./components/AuctionDetails";

function App() {
  const { ethereum } = window;
  const [isRead, setR] = useState(false);
  const [isBid, setB] = useState(false);
  const [aucDatas, setA] = useState(null);
  const [amount, setAmount] = useState(0);
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
        if (parseInt(_chainId, 16) !== 1337) {
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
      console.log(datas);
      setA(datas);
      setR(!isRead);
    } catch (e) {
      console.error(e);
    }
  };

  const renderButton = () => {
    if (aucDatas !== null) return <AuctionDetails datas={aucDatas} />;
  };

  const placeBid = async () => {
    try {
      const auctionContract = await getProviderorSigner(true);
      await auctionContract.placeBid({
        value: utils.parseEther(amount.toString()),
      });
      readAuctionDetails();
      setB(!isBid);
    } catch (e) {
      alert("Bid amount is less than the recent highest bid !");
    }
  };

  const renderBidders = async () => {
    const auctionContract = await getProviderorSigner();
    const bids = await auctionContract.queryFilter("bidPlacers");

    if (isBid)
      return bids.map(async (bid) => {
        <p>{bid.args.bidders}</p>;
      });
  };

  useEffect(() => {
    ethereum.on("accountsChanged", (accounts) => {
      setData({ ...critialData, account: accounts[0] });
      window.location.reload();
    });

    ethereum.on("chainChanged", (_chainId) =>
      setData({ ...critialData, chainId: parseInt(_chainId, 16) })
    );

    readAuctionDetails();
  }, [critialData.isConnected, critialData.account, critialData.chainId]);

  return (
    <div>
      {console.log("isBid", isBid)}
      {critialData.isConnected ? (
        <>
          {`ADDRESS: ${critialData.account}`}
          <br />
          {`Chain ID: ${critialData.chainId}`}
          <br />
          <br />
          <br />
          {renderButton()}
          <br />
          <br />
          <h1>Bidding Section:</h1>
          <label>Enter Amount:</label>

          <input
            type="number"
            placeHolder="Eth"
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          ></input>
          <br />
          <Button variant="contained" onClick={placeBid}>
            Place
          </Button>
          <h1>Bidder Logs:</h1>
        </>
      ) : (
        <Button variant="contained" onClick={connectWallet}>
          Connect Wallet
        </Button>
      )}
    </div>
  );
}

export default App;
