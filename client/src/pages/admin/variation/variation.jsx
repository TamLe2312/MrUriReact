import "./variation.css";
import { Container } from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as request from "../../../utilities/request";
import SkeletonRow3 from "../../../components/skeleton/skeletonRow3/skeletonRow3";

const Variation = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [variations, setVariations] = useState();
  const [total, setTotal] = useState(0);
  const [errors, setErrors] = useState({});
  const [variationNum, setVariationsNum] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChange = (e) => {
    /* console.log(e.target.value, e.target.name); */
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id) => {
    try {
      const res = await request.deleteRequest(`variation/delete/${id}`);
      // console.log(res);
      setIsLoading(true);
      if (res.status === 200) {
        toast.success(res.data.message);
        fetchVariation();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (variation) => {
    setIsLoading(true);
    setIsEdit(true);
    try {
      const res = await request.getRequest(`variation/getById/${variation.id}`);
      if (res.status === 200) {
        const variationData = res.data.results[0];
        setFormData({
          name: variationData.name,
          id: variationData.id,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (isEdit) {
      try {
        const res = await request.postRequest(`variation/edit`, {
          name: formData.name,
          id: formData.id,
        });
        // console.log(res);
        if (res.status === 200) {
          setFormData({
            name: "",
          });
          fetchVariation();
          setIsEdit(false);
          toast.success(res.data.message);
        }
      } catch (err) {
        if (err.response.status === 400) {
          toast.error(err.response.data.message);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const res = await request.postRequest(`variation/add`, {
          name: formData.name,
        });
        if (res.status === 200) {
          setFormData({
            name: "",
          });
          toast.success(res.data.message);
          fetchVariation();
        }
      } catch (err) {
        if (err.response.status === 400) {
          toast.error(err.response.data.message);
        }
      }
    }
  };
  useEffect(() => {
    if (variations && variations.length > 0) {
      setIsLoading(true);
      const lastIndex = (page + 1) * rowsPerPage;
      const firstIndex = lastIndex - rowsPerPage;
      const records = variations.slice(firstIndex, lastIndex);
      setVariationsNum(records);
      setIsLoading(false);
    }
  }, [page, rowsPerPage]);
  const fetchVariation = async () => {
    try {
      const res = await request.getRequest(`variation`);
      if (res.data) {
        setVariations(res.data.results);
        setTotal(res.data.results.length);
        const lastIndex = (page + 1) * rowsPerPage;
        const firstIndex = lastIndex - rowsPerPage;
        const records = res.data.results.slice(firstIndex, lastIndex);
        setVariationsNum(records);
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVariation();
  }, []);
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <p>Variation</p>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Paper
            sx={{
              p: 2,
            }}
          >
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <div
                  id="validationServerBrandFeedback"
                  className="invalid-feedback"
                >
                  {errors.name}
                </div>
              )}
            </div>
            <button
              className={
                "btn mt-3" + (isEdit ? " btn-success" : " btn-primary")
              }
              onClick={handleSubmit}
            >
              {isEdit ? "Edit" : "Submit"}
            </button>
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Id</TableCell>
                    <TableCell align="left">Name</TableCell>
                    <TableCell align="left">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading
                    ? Array(rowsPerPage)
                        .fill(0)
                        .map((_, index) => <SkeletonRow3 key={index} />)
                    : variationNum &&
                      variationNum.map((variation) => {
                        return (
                          <TableRow key={variation.id}>
                            <TableCell>{variation.id}</TableCell>
                            <TableCell>{variation.variationName}</TableCell>
                            <TableCell>
                              <div className="handleButtonAction">
                                <button
                                  className="btn btn-danger"
                                  onClick={() => handleDelete(variation.id)}
                                >
                                  Delete
                                </button>
                                <button
                                  className="btn btn-primary"
                                  onClick={() => handleEdit(variation)}
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
            {variations && (
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

export default Variation;
