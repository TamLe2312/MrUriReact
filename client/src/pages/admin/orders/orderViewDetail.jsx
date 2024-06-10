import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import * as request from "../../../utilities/request";
import { UserContext } from "../../../context/userProvider";
import { APP_URL } from "../../../config/env";
import { formatNumber } from "../../../helper/helper";

const OrderViewDetail = (props) => {
  const [order, setOrder] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { id } = props;
  const { user } = useContext(UserContext);
  const format = (price) => {
    return formatNumber(parseInt(price));
  };
  const fetchOrder = async () => {
    try {
      const res = await request.postRequest("orders/getOrderById", {
        userId: user.id,
        id: id,
      });
      // console.log(res);
      if (res.status === 200) {
        setOrder(res.data.results[0]);
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (user) {
      fetchOrder();
    }
  }, [user]);
  return (
    <>
      <Container maxWidth="lg">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label>Id</label>
                  <input
                    type="text"
                    className="form-control"
                    id="id"
                    name="id"
                    readOnly
                    value={order.id}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    readOnly
                    value={order.username}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>Payment</label>
                  <input
                    type="text"
                    className="form-control"
                    id="pay"
                    name="pay"
                    readOnly
                    value={order.pay}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    name="address"
                    readOnly
                    value={order.address}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    id="phone_number"
                    name="phone_number"
                    readOnly
                    value={order.phone_number}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>Total</label>
                  <input
                    type="text"
                    className="form-control"
                    id="total"
                    name="total"
                    readOnly
                    value={format(order.total)}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>Status</label>
                  <input
                    type="text"
                    className="form-control"
                    id="status"
                    name="status"
                    readOnly
                    value={order.status}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>Created at</label>
                  <input
                    type="text"
                    className="form-control"
                    id="created_at"
                    name="created_at"
                    readOnly
                    value={order.created_at}
                  />
                </div>
              </div>
            </div>
            <TableContainer sx={{ maxHeight: "300px", marginTop: "12px" }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Product name</TableCell>
                    <TableCell align="left">Price</TableCell>
                    <TableCell align="left">Quantity</TableCell>
                    <TableCell align="left">Image</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order &&
                    order.order_details &&
                    order.order_details.length > 0 &&
                    order.order_details.map((item, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            {item.product_name}
                            <div className="variantTitle">
                              {item.variation_name}
                              <strong>{item.variation_value}</strong>
                            </div>
                          </TableCell>
                          <TableCell>{format(item.price)}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            <img
                              id="orderDetailImg"
                              src={APP_URL + "/public/uploads/" + item.img}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Container>
    </>
  );
};

export default OrderViewDetail;
