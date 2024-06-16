import "./orders.css";
import {
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import OrderAdminSkeleton from "../../../components/skeleton/orderAdminSkeleton/orderAdminSkeleton";
import * as request from "../../../utilities/request";
import { toast } from "sonner";
import MyModal from "../../../components/modal/modal";
import OrderViewDetail from "./orderViewDetail";

const Orders = () => {
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orders, setOrders] = useState();
  const [ordersNum, setOrdersNum] = useState();
  const [modalView, setModalView] = useState(false);
  const [rowId, setRowId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleView = (orderId) => {
    setModalView(!modalView);
    setRowId(orderId);
  };
  const handleDelete = async (orderId) => {
    setIsLoading(true);
    try {
      const res = await request.postRequest(`orders/deleteAD/${orderId}`);
      if (res.status === 200) {
        toast.success(res.data.message);
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = async (e, order) => {
    if (order.pay === "vnpay") {
      if (e.target.value === "pending" || e.target.value === "cancel") {
        toast.error(`Can't change status to ${e.target.value}`);
      } else {
        try {
          const res = await request.postRequest(`orders/editStatus`, {
            id: order.id,
            status: e.target.value,
          });
          // console.log(res);
          if (res.status === 200) {
            toast.success(res.data.message);
            fetchOrders();
          }
        } catch (err) {
          console.error(err);
        }
      }
    } else {
      // console.log(e.target.value);
      if (order.status === "being_shipped" || order.status === "successfully") {
        if (
          e.target.value === "pending" ||
          e.target.value === "cancel" ||
          e.target.value === "confirm"
        ) {
          toast.error(`Can't change status to ${e.target.value}`);
        } else {
          try {
            const res = await request.postRequest(`orders/editStatus`, {
              id: order.id,
              status: e.target.value,
            });
            // console.log(res);
            if (res.status === 200) {
              toast.success(res.data.message);
              fetchOrders();
            }
          } catch (err) {
            console.error(err);
          }
        }
      } else {
        try {
          const res = await request.postRequest(`orders/editStatus`, {
            id: order.id,
            status: e.target.value,
          });
          // console.log(res);
          if (res.status === 200) {
            toast.success(res.data.message);
            fetchOrders();
          }
        } catch (err) {
          console.error(err);
        }
      }
    }
  };
  useEffect(() => {
    if (orders && orders.length > 0) {
      setIsLoading(true);
      const lastIndex = (page + 1) * rowsPerPage;
      const firstIndex = lastIndex - rowsPerPage;
      const records = orders.slice(firstIndex, lastIndex);
      setOrdersNum(records);
      setIsLoading(false);
    }
  }, [page, rowsPerPage]);
  const fetchOrders = async () => {
    try {
      const res = await request.getRequest(`orders/getAll`);
      // console.log(res);
      if (res.status === 200) {
        // console.log(res);
        setOrders(res.data.results);
        setTotal(res.data.results.length);
        const lastIndex = (page + 1) * rowsPerPage;
        const firstIndex = lastIndex - rowsPerPage;
        const records = res.data.results.slice(firstIndex, lastIndex);
        setOrdersNum(records);
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <div className="handleAddContainer">
        <p>Orders</p>
      </div>
      <Grid container>
        <Grid item xs={12}>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table">
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
                    <TableCell align="left">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading
                    ? Array(rowsPerPage)
                        .fill(0)
                        .map((_, i) => <OrderAdminSkeleton key={i} />)
                    : orders &&
                      orders.length > 0 &&
                      orders.map((order) => {
                        return (
                          <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>{order.username}</TableCell>
                            <TableCell>{order.address}</TableCell>
                            <TableCell>{order.pay}</TableCell>
                            <TableCell>{order.phone_number}</TableCell>
                            <TableCell>{order.total}</TableCell>
                            <TableCell>
                              {order.pay === "cash" ? (
                                <select
                                  id="status"
                                  className="form-control"
                                  onChange={(e) => handleChange(e, order)}
                                  name="status"
                                  value={order.status}
                                  defaultValue={order.status}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirm">Confirm</option>
                                  <option value="successfully">
                                    Successfully
                                  </option>
                                  <option value="cancel">Cancel</option>
                                  <option value="being_shipped">
                                    Being Shipped
                                  </option>
                                </select>
                              ) : (
                                <select
                                  id="status"
                                  className="form-control"
                                  onChange={(e) => handleChange(e, order)}
                                  name="status"
                                  value={order.status}
                                  defaultValue={order.status}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirm">Confirm</option>
                                  <option value="successfully">
                                    Successfully
                                  </option>
                                  <option value="cancel">Cancel</option>
                                  <option value="being_shipped">
                                    Being Shipped
                                  </option>
                                </select>
                              )}
                            </TableCell>
                            <TableCell>{order.created_at}</TableCell>
                            <TableCell>
                              <div className="handleButtonAction">
                                <button
                                  className="btn btn-danger"
                                  onClick={() => handleDelete(order.id)}
                                >
                                  Delete
                                </button>
                                &nbsp;
                                <button
                                  className="btn btn-success"
                                  onClick={() => handleView(order.id)}
                                >
                                  View
                                </button>
                                {rowId === order.id && (
                                  <MyModal
                                    text={"View Order Detail"}
                                    show={modalView}
                                    onHide={() => setModalView(false)}
                                    size={"xl"}
                                    childrens={
                                      <OrderViewDetail id={order.id} />
                                    }
                                  />
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                </TableBody>
              </Table>
            </TableContainer>
            {orders && (
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={orders.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Orders;
