const ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_basePrice",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_charge",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "FinalPrice",
        type: "uint256",
      },
    ],
    name: "auctionEnded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "bidders",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "prevBid",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "incrementAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "recBid",
        type: "uint256",
      },
    ],
    name: "bidPlacers",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "basePrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "charge",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "newAuction",
    type: "event",
  },
  {
    inputs: [],
    name: "claimProduct",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "endAuction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "placeBid",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "reAuction",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "readAuction",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_charge",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_basePrice",
        type: "uint256",
      },
    ],
    name: "startAuction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const deployedAddress = "0xa30f40D93cbefbF7387a730FBB04B12F11E1EcDf";
