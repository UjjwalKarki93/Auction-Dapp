import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState, createContext } from "react";
import { ethers, Contract, utils, BigNumber } from "ethers";
import { ABI, deployedAddress } from "./constants";
import { Button, box } from "@mui/material";
import { Form } from "semantic-ui-react";
import AuctionDetails from "./components/AuctionDetails";
import BidLogs from "./components/BidLogs";

function App() {
  const { ethereum } = window;

  const [isEnd, setEnd] = useState();
  const [isRead, setR] = useState(false);
  const [reAucData, setRe] = useState({
    charge: "",
    basePrice: "",
  });
  const [logDataBidders, setLogDataBidders] = useState(null);
  const [aucDatas, setA] = useState(null);
  const [amount, setAmount] = useState("");
  const [critialData, setData] = useState({
    account: null,
    chainId: null,
    provider: null,
    isConnected: false,
  });

  const [tamount, setT] = useState(0);

  const connectWallet = async () => {
    try {
      if (ethereum !== undefined) {
        const _provider = new ethers.providers.Web3Provider(window.ethereum);
        const account = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const _chainId = await ethereum.request({ method: "eth_chainId" });
        if (parseInt(_chainId, 16) !== 5) {
          alert("Connect to goerli network to get access: ");
          window.location.reload();
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

  const renderAuction = () => {
    if (aucDatas !== null) return <AuctionDetails datas={aucDatas} />;
  };

  const placeBid = async () => {
    try {
      const auctionContract = await getProviderorSigner(true);
      await auctionContract.placeBid({
        value: utils.parseUnits(amount),
      });
      setLogDataBidders(null);
    } catch (e) {
      alert("Bid amount is less than the recent highest bid !");
    }
  };

  const renderBidders = async () => {
    const auctionContract = await getProviderorSigner();
    const getAllBids = auctionContract.filters.bidPlacers();
    const bids = await auctionContract.queryFilter(getAllBids);
    console.log("inside renderbidders");
    setLogDataBidders(bids);
  };

  const reAuction = async () => {
    try {
      const auctionContract = await getProviderorSigner(true);
      console.log(reAucData);
      await auctionContract.startAuction(
        reAucData.charge,
        utils.parseEther(reAucData.basePrice.toString())
      );

      setEnd(false);
      setR(!isRead);
    } catch (e) {
      console.error(e);
      alert("Check the ownership or closing status of auction!");
    }
  };

  const endYourAuction = async () => {
    try {
      const auctionContract = await getProviderorSigner(true);
      await auctionContract.endAuction();
    } catch (e) {
      alert("cant end");
    }
  };

  const claimYourProduct = async () => {
    try {
      console.log(tamount);
      const auctionContract = await getProviderorSigner(true);
      await auctionContract.claimProduct({
        value: utils.parseUnits(tamount),
      });
    } catch (e) {
      console.error(e);
      alert("you are not the highest bidder!");
    }
  };

  useEffect(() => {
    ethereum.on("accountsChanged", (accounts) => {
      setData({ ...critialData, account: accounts[0] });
    });

    ethereum.on("chainChanged", (_chainId) => {
      setData({ ...critialData, chainId: parseInt(_chainId, 16) });
      window.location.reload();
    });
    if (logDataBidders !== null && aucDatas !== null) {
      renderBidders();
    }
    readAuctionDetails();
  }, [
    critialData.isConnected,
    critialData.account,
    critialData.chainId,
    isRead,
  ]);

  return (
    <div className="App">
      {critialData.isConnected ? (
        <>
          <div className="details">
            {`ADDRESS: ${critialData.account}`}
            <br />
            {`Chain ID: ${critialData.chainId}`}
          </div>
          <br />
          <h1>Owner Section</h1>
          {isEnd ? (
            <>
              <label>Enter Amount</label> &nbsp;
              <input
                type="number"
                placeHolder="Transfer"
                step="any"
                onChange={(e) => {
                  setT(e.target.value);
                }}
              ></input>
              <br />
              <br />
              <Button variant="contained" onClick={claimYourProduct}>
                Claim Product
              </Button>
            </>
          ) : (
            <Button variant="contained" onClick={endYourAuction}>
              End Auction
            </Button>
          )}
          <br />
          <br />
          {renderAuction()}
          <br />
          <br />
          <h1>Bidding Section </h1>
          <label>Enter Amount </label> &nbsp;
          <input
            type="number"
            step="any"
            placeHolder="Eth"
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          ></input>
          <br /> <br />
          <Button variant="contained" onClick={placeBid}>
            Increment Bid
          </Button>
          <h1>Bidder Logs </h1>
          {logDataBidders == null ? (
            <Button variant="contained" onClick={renderBidders}>
              Get Logs
            </Button>
          ) : (
            <BidLogs bidders={logDataBidders} />
          )}
          <br />
          <h1>Re-auction</h1>
          <Form className="ui form ">
            <Form.Field className="six wide field">
              <label>Base Price</label>
              <input
                placeholder="ETH"
                type="number"
                step="any"
                onChange={(e) => {
                  setRe({ ...reAucData, basePrice: e.target.value });
                }}
              />
            </Form.Field>
            <Form.Field className="six wide field">
              <label>Charge Amount</label>
              <input
                placeholder="Wei"
                type="number"
                step="any"
                onChange={(e) => {
                  setRe({ ...reAucData, charge: e.target.value });
                }}
              />
            </Form.Field>
            <Button variant="contained" type="submit" onClick={reAuction}>
              Submit
            </Button>
          </Form>
        </>
      ) : (
        <div className="connectButton">
          <pre>PLEASE CONNECT YOUR WALLET TO GET ACCES..........</pre>
          <Button variant="contained" onClick={connectWallet}>
            Connect Wallet
          </Button>
        </div>
      )}
    </div>
  );
}

export default App;
