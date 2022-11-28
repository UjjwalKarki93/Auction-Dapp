import React from "react";
import { Table } from "semantic-ui-react";
import { utils } from "ethers";

const BidLogs = (props) => {
  return (
    <div>
      <Table compact celled definition>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Address</Table.HeaderCell>
            <Table.HeaderCell>Previous Bid</Table.HeaderCell>
            <Table.HeaderCell>Incremented By</Table.HeaderCell>
            <Table.HeaderCell>Recent Bid</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {props.bidders.map((e, index) => {
            return (
              <Table.Row key={index}>
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell>{e.args.bidders}</Table.Cell>
                <Table.Cell>{utils.formatEther(e.args.prevBid)}</Table.Cell>
                <Table.Cell>
                  {utils.formatEther(e.args.incrementAmount)}
                </Table.Cell>
                <Table.Cell>{utils.formatEther(e.args.recBid)}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};

export default BidLogs;
