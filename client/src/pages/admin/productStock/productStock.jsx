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
import "./productStock.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SkeletonRow4 from "../../../components/skeleton/skeletonRow4/skeletonRow4";
import * as request from "../../../utilities/request";

const ProductStock = () => {
  const [products, setProducts] = useState([]);
  const [productsNum, setProductsNum] = useState([]);
  const [mode, setMode] = useState("HightoLow");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/dashboard/products");
  };

  const handleSwap = (mode) => {
    setMode(mode);
    sortProducts(products, mode);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getMaxStock = (products) => {
    return products.map((product) => {
      const maxStock = Math.max(
        ...product.variants.map((variant) => variant.stock)
      );
      return {
        ...product,
        max_stock: maxStock,
      };
    });
  };

  const sortProducts = (products, mode) => {
    let sortedProducts = [...products];
    if (mode === "LowtoHigh") {
      sortedProducts.sort((a, b) => a.max_stock - b.max_stock);
    } else if (mode === "HightoLow") {
      sortedProducts.sort((a, b) => b.max_stock - a.max_stock);
    }
    setProducts(sortedProducts);
    updateProductsNum(sortedProducts);
  };

  const updateProductsNum = (updatedProducts) => {
    const lastIndex = (page + 1) * rowsPerPage;
    const firstIndex = lastIndex - rowsPerPage;
    const records = updatedProducts.slice(firstIndex, lastIndex);
    setProductsNum(records);
  };

  const fetchProducts = async () => {
    try {
      const res = await request.getRequest(`products/getStock`);
      if (res.data.results.length > 0) {
        const updatedProducts = getMaxStock(res.data.results);
        setProducts(updatedProducts);
        setTotal(res.data.results.length);
        sortProducts(updatedProducts, mode);
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      updateProductsNum(products);
    }
  }, [page, rowsPerPage, products]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <div className="handleAddContainer">
        <p>Product Stock</p>
        <div className="handleButtonContainer">
          <button
            className={
              mode === "LowtoHigh" ? "btn btn-primary" : "btn btn-info"
            }
            onClick={() => handleSwap("LowtoHigh")}
          >
            Low To High
          </button>
          <button
            className={
              mode === "HightoLow" ? "btn btn-primary" : "btn btn-info"
            }
            onClick={() => handleSwap("HightoLow")}
          >
            High to Low
          </button>
          <button className="btn btn-success" onClick={handleBack}>
            Back
          </button>
        </div>
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
                    <TableCell align="left">Created At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading
                    ? Array(rowsPerPage)
                        .fill(0)
                        .map((_, i) => <SkeletonRow4 key={i} />)
                    : productsNum &&
                      productsNum.map((product) => (
                        <TableRow key={product.product_id}>
                          <TableCell>{product.product_id}</TableCell>
                          <TableCell>{product.product_name}</TableCell>
                          <TableCell>{product.max_stock}</TableCell>
                          <TableCell>{product.created_at}</TableCell>
                        </TableRow>
                      ))}
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

export default ProductStock;
