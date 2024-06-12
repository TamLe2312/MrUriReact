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
import "./products.css";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SkeletonRow4 from "../../../components/skeleton/skeletonRow4/skeletonRow4";
import * as request from "../../../utilities/request";
import { SocketContext } from "../../../context/socketContext";

const Products = () => {
  const { socket } = useContext(SocketContext);
  const [products, setProducts] = useState();
  const [total, setTotal] = useState(0);
  const [productsNum, setProductsNum] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  useEffect(() => {
    if (products && products.length > 0) {
      setIsLoading(true);
      const lastIndex = (page + 1) * rowsPerPage;
      const firstIndex = lastIndex - rowsPerPage;
      const records = products.slice(firstIndex, lastIndex);
      setProductsNum(records);
      setIsLoading(false);
    }
  }, [page, rowsPerPage]);
  const fetchProducts = async () => {
    try {
      const res = await request.getRequest(`products`);
      // console.log(res);
      if (res.data.results.length > 0) {
        setProducts(res.data.results);
        setTotal(res.data.results.length);
        const lastIndex = (page + 1) * rowsPerPage;
        const firstIndex = lastIndex - rowsPerPage;
        const records = res.data.results.slice(firstIndex, lastIndex);
        setProductsNum(records);
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      const res = await request.postRequest("products/delete", {
        id: id,
      });
      if (res.status === 200) {
        toast.success(res.data.message);
        await socket.emit("delete_product");
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleChangeFS = async (FS, id) => {
    const newFS = FS === 1 ? 0 : 1;
    try {
      const res = await request.postRequest("products/featureProduct", {
        id: id,
        featureProduct: newFS,
      });
      if (res.status === 200) {
        toast.success(res.data.message);
        await socket.emit("fs_product");
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleEdit = (product) => {
    navigate(`/dashboard/products/edit/${product}`);
  };
  const handleView = (product) => {
    navigate(`/dashboard/products/view/${product}`);
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <div className="handleAddContainer">
        <p>Products</p>
        <Link className="btn btn-success" to="/dashboard/products/add">
          Add
        </Link>
      </div>
      <Grid container>
        <Grid item xs={12}>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">ID</TableCell>
                    <TableCell align="left">Product Name</TableCell>
                    <TableCell align="left">Feature Product</TableCell>
                    <TableCell align="left">Created At</TableCell>
                    <TableCell align="left">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading
                    ? Array(rowsPerPage)
                        .fill(0)
                        .map((_, i) => <SkeletonRow4 key={i} />)
                    : productsNum &&
                      productsNum.map((product) => {
                        return (
                          <TableRow key={product.id}>
                            <TableCell>{product.id}</TableCell>
                            <TableCell>{product.product_name}</TableCell>
                            <TableCell>
                              <div className="cl-toggle-switch">
                                <label className="cl-switch">
                                  <input
                                    type="checkbox"
                                    id="flashSale"
                                    defaultChecked={product.flash_sale === 1}
                                    onChange={() =>
                                      handleChangeFS(
                                        product.flash_sale,
                                        product.id
                                      )
                                    }
                                  />
                                  <span></span>
                                </label>
                              </div>
                            </TableCell>
                            <TableCell>{product.created_at}</TableCell>
                            <TableCell>
                              <div className="handleButtonAction">
                                <button
                                  className="btn btn-danger"
                                  onClick={() => handleDelete(product.id)}
                                >
                                  Delete
                                </button>
                                &nbsp;
                                <button
                                  className="btn btn-success"
                                  onClick={() => handleView(product.id)}
                                >
                                  View
                                </button>
                                &nbsp;
                                <button
                                  className="btn btn-primary"
                                  onClick={() => handleEdit(product.id)}
                                >
                                  Edit
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                </TableBody>
              </Table>
            </TableContainer>
            {products && (
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={total}
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

export default Products;
