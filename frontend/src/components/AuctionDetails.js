import React from "react";
import { utils } from "ethers";
import { Table } from "semantic-ui-react";

const AuctionDetails = (props) => {
  let data = props.datas;
  return (
    <div>
      <h1>Auction Details:</h1>
      <Table compact celled definition>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Base Price</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Highest Bidder</Table.HeaderCell>
            <Table.HeaderCell>Highest Bid</Table.HeaderCell>
            <Table.HeaderCell>Closed</Table.HeaderCell>
            <Table.HeaderCell>Owner</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>{utils.formatEther(data[0])}</Table.Cell>
            <Table.Cell>{data[1]}</Table.Cell>
            <Table.Cell>{data[2]}</Table.Cell>
            <Table.Cell>{utils.formatEther(data[3])}</Table.Cell>
            <Table.Cell>{data[4].toString()}</Table.Cell>
            <Table.Cell>{data[5]}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
};

export default AuctionDetails;
