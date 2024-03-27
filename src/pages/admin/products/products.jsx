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
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEditedProduct } from "../../../context";

const Products = () => {
  const [products, setProducts] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const { setEditedProduct, setIsEdit } = useEditedProduct();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/products`);
      // console.log(res);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:3001/products/${id}`);
      if (res.status === 200) {
        toast.success("Delete Success");
        fetchProducts();
      }
      // console.log(res);
    } catch (err) {
      console.error(err);
    }
  };
  const handleEdit = (product) => {
    // console.log(product);
    setEditedProduct(product);
    setIsEdit(true);
    navigate("/dashboard/products/add");
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
                    <TableCell align="left">Product Name</TableCell>
                    <TableCell align="left">Image</TableCell>
                    <TableCell align="left">Stock</TableCell>
                    <TableCell align="left">Price</TableCell>
                    <TableCell align="left">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products &&
                    products.map((products) => {
                      return (
                        <TableRow key={products.id}>
                          <TableCell>{products.productName}</TableCell>
                          <TableCell>
                            <img
                              className="productImg"
                              src={products.image}
                              alt={products.productName}
                            />
                          </TableCell>
                          <TableCell>{products.stock}</TableCell>
                          <TableCell>{products.price}</TableCell>
                          <TableCell>
                            <div className="handleButtonAction">
                              <button
                                className="btn btn-danger"
                                onClick={() => handleDelete(products.id)}
                              >
                                Delete
                              </button>
                              <button
                                className="btn btn-primary"
                                onClick={() => handleEdit(products)}
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
                count={products.length}
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
