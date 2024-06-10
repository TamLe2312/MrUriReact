import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "../title/title";
import * as request from "../../../../utilities/request";
import { useState } from "react";
import { useEffect } from "react";
import { formatNumber } from "../../../../helper/helper";

const Orders = () => {
  const format = (price) => {
    return formatNumber(parseInt(price));
  };
  const [orders, setOrders] = useState();
  const fetchOrders = async () => {
    try {
      const res = await request.getRequest(`orders/getAll`);
      if (res.status === 200) {
        // console.log(res);
        setOrders(res.data.results.slice(0, 5));
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);
  return (
    <React.Fragment>
      <Title>Recent Orders</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="left">ID</TableCell>
            <TableCell align="left">User</TableCell>
            <TableCell align="left">Address</TableCell>
            <TableCell align="left">Method</TableCell>
            <TableCell align="left">Phone number</TableCell>
            <TableCell align="left">Total</TableCell>
            <TableCell align="left">Status</TableCell>
            <TableCell align="left">Created at</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders &&
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.username}</TableCell>
                <TableCell>{order.address}</TableCell>
                <TableCell>{order.pay}</TableCell>
                <TableCell>{order.phone_number}</TableCell>
                <TableCell>{format(order.total)}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.created_at}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Link color="primary" to="/dashboard/orders" sx={{ mt: 3 }}>
        See more orders
      </Link>
    </React.Fragment>
  );
};

export default Orders;
