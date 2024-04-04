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
import axios from "axios";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ProductAdminSkeleton from "../../../components/skeleton/productAdminSkeleton/productAdminSkeleton";
import { EditProductContext } from "../../../context/editProductProvider";
import * as request from "../../../utilities/request";

const Products = () => {
  const [products, setProducts] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const { setEditedProduct, setIsEdit } = useContext(EditProductContext);
  const [isLoading, setIsLoading] = useState(true);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const fetchProducts = async () => {
    try {
      const res = await request.getRequest(`products`);
      if (res.data.results.length > 0) {
        setProducts(res.data.results);
        setIsLoading(false);
      }
    } catch (err) {
      // console.error(err);
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
                    <TableCell align="left">ID</TableCell>
                    <TableCell align="left">Product Name</TableCell>
                    <TableCell align="left">Stock</TableCell>
                    <TableCell align="left">Selling Price</TableCell>
                    <TableCell align="left">Imported Price</TableCell>
                    <TableCell align="left">Status</TableCell>
                    <TableCell align="left">Created At</TableCell>
                    <TableCell align="left">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading
                    ? Array(rowsPerPage)
                        .fill(0)
                        .map((_, i) => <ProductAdminSkeleton key={i} />)
                    : products &&
                      products.map((products) => {
                        return (
                          <TableRow key={products.id}>
                            <TableCell>{products.id}</TableCell>
                            <TableCell>{products.product_name}</TableCell>
                            <TableCell>{products.stock}</TableCell>
                            <TableCell>{products.selling_price}</TableCell>
                            <TableCell>{products.imported_price}</TableCell>
                            <TableCell>{products.status}</TableCell>
                            <TableCell>{products.created_at}</TableCell>
                            <TableCell>
                              <div className="handleButtonAction">
                                <button
                                  className="btn btn-danger"
                                  onClick={() => handleDelete(products.id)}
                                >
                                  Delete
                                </button>
                                &nbsp;
                                <button className="btn btn-success">
                                  View
                                </button>
                                &nbsp;
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
