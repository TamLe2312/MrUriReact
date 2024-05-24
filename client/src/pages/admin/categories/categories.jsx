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
import "./categories.css";
import { useEffect, useState } from "react";
import unidecode from "unidecode";
import { toast } from "sonner";
import * as request from "../../../utilities/request";
import UserSkeleton from "../../../components/skeleton/userSkeleton/userSkeleton";
import Validation from "../../../components/validation/validation";

const Categories = () => {
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState();
  const [categoriesNum, setCategoriesNum] = useState();
  const [parentCategories, setParentCategories] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    categoryName: "",
    categorySlug: "",
    categoryParent: 0,
    status: 1,
  });

  const cleaner = () => {
    setFormData({
      categoryName: "",
      categorySlug: "",
      categoryParent: 0,
      status: 1,
    });
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };
  useEffect(() => {
    if (categories && categories.length > 0) {
      setIsLoading(true);
      const lastIndex = (page + 1) * rowsPerPage;
      const firstIndex = lastIndex - rowsPerPage;
      const records = categories.slice(firstIndex, lastIndex);
      setCategoriesNum(records);
      setIsLoading(false);
    }
  }, [page, rowsPerPage]);

  const handleChange = (e) => {
    // console.log(e.target.value, e.target.name);
    let newFormData = { ...formData };

    if (e.target.name === "categoryName") {
      const categorySlug = unidecode(e.target.value)
        .toLowerCase()
        .replace(/\s+/g, "-");
      newFormData = { ...newFormData, categorySlug: categorySlug };
    }
    newFormData = { ...newFormData, [e.target.name]: e.target.value };
    setFormData(newFormData);
  };

  const validate = () => {
    const errors = Validation(formData, "categories");
    let isValid = true;

    setErrors(errors);
    if (
      Object.keys(errors).length !== 0 ||
      !Object.values(formData).every((value) => value !== "")
    ) {
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (isEdit) {
      const isValid = validate();
      if (isValid) {
        // setIsLoading(true);
        const formDatas = new FormData();
        formDatas.append("categoryName", formData.categoryName);
        formDatas.append("categorySlug", formData.categorySlug);
        formDatas.append("categoryParent", formData.categoryParent);
        formDatas.append("status", formData.status);
        try {
          const res = await request.putRequest(
            `categories/edit/${formData.id}`,
            formDatas
          );
          // console.log(res);
          if (res.status === 200) {
            toast.success(res.data.message);
            cleaner();
            fetchCategories();
          }
        } catch (err) {
          console.error(err);
          if (err.response.data.message) {
            toast.error(err.response.data.message);
            setIsLoading(false);
          }
        }
      }
    } else {
      const isValid = validate();
      if (isValid) {
        setIsLoading(true);
        const formDatas = new FormData();
        formDatas.append("categoryName", formData.categoryName);
        formDatas.append("categorySlug", formData.categorySlug);
        formDatas.append("categoryParent", formData.categoryParent);
        formDatas.append("status", formData.status);
        try {
          const res = await request.postRequest("categories/add", formDatas);
          if (res.status === 200) {
            toast.success(res.data.message);
            cleaner();
            fetchCategories();
          }
        } catch (err) {
          // console.log(err);
          if (err.response.data.message) {
            toast.error(err.response.data.message);
            setIsLoading(false);
          }
        }
      }
    }
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      const res = await request.deleteRequest(`categories/delete/${id}`);
      if (res.status === 200) {
        toast.success(res.data.message);
        fetchCategories();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (data) => {
    setIsEdit(true);
    // console.log(data);
    setFormData((prevData) => ({
      ...prevData,
      categoryName: data.category_name,
      categorySlug: data.category_slug,
      categoryParent: data.parent_category,
      status: data.status,
      id: data.id,
    }));
  };

  const fetchParent = async () => {
    try {
      const res = await request.getRequest(`categories/parent-categories`);
      if (res.status === 200) {
        setParentCategories(res.data.results);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const fetchCategories = async () => {
    try {
      const res = await request.getRequest(`categories`);
      if (res.data.results.length > 0) {
        // console.log(res);
        setTotal(res.data.results.length);
        setCategories(res.data.results);
        const lastIndex = (page + 1) * rowsPerPage;
        const firstIndex = lastIndex - rowsPerPage;
        const records = res.data.results.slice(firstIndex, lastIndex);
        setCategoriesNum(records);
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchParent();
    fetchCategories();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <p>Categories</p>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Paper
            sx={{
              p: 2,
            }}
          >
            <div className="form-group">
              <label>Category name</label>
              <input
                type="text"
                className={
                  errors.categoryName
                    ? "form-control is-invalid"
                    : "form-control"
                }
                id="categoryName"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleChange}
              />
              {errors.categoryName && (
                <div
                  id="validationServerBrandFeedback"
                  className="invalid-feedback"
                >
                  {errors.categoryName}
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Category slug</label>
              <input
                type="text"
                className={
                  errors.categorySlug
                    ? "form-control is-invalid"
                    : "form-control"
                }
                id="categorySlug"
                name="categorySlug"
                readOnly
                value={formData.categorySlug}
                onChange={handleChange}
              />
              {errors.categorySlug && (
                <div
                  id="validationServerBrandFeedback"
                  className="invalid-feedback"
                >
                  {errors.categorySlug}
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Category parent</label>
              <select
                id="categoryParent"
                className={
                  errors.categoryParent
                    ? "form-control is-invalid"
                    : "form-control"
                }
                onChange={handleChange}
                onClick={fetchParent}
                name="categoryParent"
                value={formData.categoryParent}
              >
                {errors.categoryParent && (
                  <div
                    id="validationServerBrandFeedback"
                    className="invalid-feedback"
                  >
                    {errors.categoryParent}
                  </div>
                )}
                <option value="0">ROOT</option>
                {parentCategories && (
                  <>
                    {parentCategories.map((parentCategory) => (
                      <option key={parentCategory.id} value={parentCategory.id}>
                        {parentCategory.category_name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                id="status"
                className={
                  errors.status ? "form-control is-invalid" : "form-control"
                }
                onChange={handleChange}
                name="status"
                value={formData.status}
              >
                {errors.status && (
                  <div
                    id="validationServerBrandFeedback"
                    className="invalid-feedback"
                  >
                    {errors.status}
                  </div>
                )}
                <option value="1">Show</option>
                <option value="0">Hide</option>
              </select>
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
                    <TableCell align="left">Category name</TableCell>
                    <TableCell align="left">Category slug</TableCell>
                    <TableCell align="left">Category parent</TableCell>
                    <TableCell align="left">Status</TableCell>
                    <TableCell align="left">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading
                    ? Array(rowsPerPage)
                        .fill(0)
                        .map((_, index) => <UserSkeleton key={index} />)
                    : categoriesNum &&
                      categoriesNum.map((category) => {
                        return (
                          <TableRow key={category.id}>
                            <TableCell>{category.category_name}</TableCell>
                            <TableCell>{category.category_slug}</TableCell>
                            <TableCell>
                              {category.parent_category_name === null
                                ? "ROOT"
                                : category.parent_category_name}
                            </TableCell>
                            <TableCell>
                              {category.status === 1 ? "Show" : "Hide"}
                            </TableCell>
                            <TableCell>
                              <div className="handleButtonAction">
                                <button
                                  className="btn btn-danger"
                                  onClick={() => handleDelete(category.id)}
                                >
                                  Delete
                                </button>
                                <button
                                  className="btn btn-primary"
                                  onClick={() => handleEdit(category)}
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
            {categories && (
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

export default Categories;
