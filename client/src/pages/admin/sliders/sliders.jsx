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
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import "./sliders.css";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import UserSkeleton from "../../../components/skeleton/userSkeleton/userSkeleton";
import * as request from "../../../utilities/request";
import Validation from "../../../components/validation/validation";
import { SocketContext } from "../../../context/socketContext";
import { APP_URL } from "../../../config/env";

const Sliders = () => {
  const { socket } = useContext(SocketContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    alt: "",
    path: "",
  });
  const [sliders, setSliders] = useState([]);
  const [options, setOptions] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState();
  const [errors, setErrors] = useState({});
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleImages = (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("You must upload atleast one image");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("You was upload wrong type of image");
      return;
    }

    const maxSizeInBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      toast.error("Image too heavy");
      return;
    }

    const newImageFile = {
      id: uuidv4(),
      image: file,
      url: URL.createObjectURL(file),
    };

    setImage(newImageFile);
    e.target.value = null;
  };
  const handleDeleteImg = () => {
    setImage();
  };
  const validate = () => {
    const errors = Validation(formData, "slider");
    let isValid = true;
    setErrors(errors);

    if (!image) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: "Images cannot be empty",
      }));
    }
    if (
      Object.keys(errors).length !== 0 ||
      !Object.values(formData).every((value) => value !== "")
    ) {
      isValid = false;
    }

    return isValid;
  };
  const handleChange = (e) => {
    /* console.log(e.target.value, e.target.name); */
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      const res = await request.deleteRequest(`users/deleteSlide/${id}`);
      if (res.status === 200) {
        toast.success(res.data.message);
        await socket.emit("delete_slider");
        fetchSliders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (slider) => {
    // console.log(slider);
    setIsEdit(true);
    try {
      const res = await request.getRequest(`users/getSlide/${slider.id}`);
      // console.log(res);
      if (res.status === 200) {
        const newImageFile = {
          id: uuidv4(),
          urlImg: res.data.results[0].img,
          url: APP_URL + "/public/uploads/" + res.data.results[0].img,
        };
        setFormData({
          id: res.data.results[0].id,
          alt: res.data.results[0].alt,
          path: res.data.results[0].path,
        });
        setImage(newImageFile);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleAdd = async () => {
    setIsLoading(true);
    setErrors({});
    if (isEdit) {
      const isValid = validate();
      if (isValid) {
        try {
          const formDatas = new FormData();
          formDatas.append("id", formData.id);
          formDatas.append("alt", formData.alt);
          formDatas.append("pathCat", formData.path);
          image.image
            ? formDatas.append("image", image.image)
            : formDatas.append("urlImg", image.urlImg);
          const res = await request.postRequest("users/edit/slide", formDatas);
          if (res.data.message) {
            toast.success(res.data.message);
            setFormData({
              alt: "",
              path: "",
            });
            setImage();
            fetchSliders();
            await socket.emit("edit_slider");
          }
        } catch (err) {
          console.error(err);
          if (err.response.data.message) {
            toast.error(err.response.data.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      const isValid = validate();
      if (isValid) {
        try {
          const formDatas = new FormData();
          formDatas.append("alt", formData.alt);
          formDatas.append("pathCat", formData.path);
          formDatas.append("image", image.image);
          const res = await request.postRequest("users/addSlide", formDatas);
          if (res.status === 200) {
            toast.success(res.data.message);
            setFormData({
              alt: "",
              path: "",
            });
            setImage();
            fetchSliders();
            await socket.emit("add_slider");
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };
  const fetchSliders = async () => {
    try {
      const res = await request.getRequest(`users/slider`);
      console.log(res);
      if (res.status === 200) {
        setSliders(res.data.results);
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOption = async () => {
    try {
      const res = await request.getRequest("categories/parent-categories");
      setOptions(res.data.results);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchSliders();
    fetchOption();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <p>Sliders</p>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
            }}
          >
            <div className="form-group">
              <label>Alt image</label>
              <input
                type="text"
                className={
                  errors.alt ? "form-control is-invalid" : "form-control"
                }
                id="alt"
                name="alt"
                value={formData.alt}
                onChange={handleChange}
              />
              {errors.alt && (
                <div
                  id="validationServerBrandFeedback"
                  className="invalid-feedback"
                >
                  {errors.alt}
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Path</label>
              <select
                id="path"
                className={
                  errors.path ? "form-control is-invalid" : "form-control"
                }
                onChange={handleChange}
                name="path"
                value={formData.path}
              >
                <option value="" defaultValue={""}>
                  Please select your path
                </option>
                {options &&
                  options.length > 0 &&
                  options.map((option) => {
                    return (
                      <option value={option.id} key={option.id}>
                        {option.category_name}
                      </option>
                    );
                  })}
              </select>
              {errors.path && (
                <div
                  id="validationServerBrandFeedback"
                  className="invalid-feedback"
                >
                  {errors.path}
                </div>
              )}
            </div>
            <div className="form-group imageInput">
              <label htmlFor="image">
                <FileUploadIcon />
                Upload Image
              </label>
              <input
                type="file"
                className={
                  errors.image ? "form-control is-invalid" : "form-control"
                }
                id="image"
                name="image"
                onChange={handleImages}
              />
              {errors.image && (
                <div
                  id="validationServerBrandFeedback"
                  className="invalid-feedback"
                >
                  {errors.image}
                </div>
              )}
              <div className="sliderContainer">
                {image && (
                  <div className="image-item" key={image.id}>
                    <img src={image.url} />
                    <DeleteOutlineIcon
                      className="trashIcon"
                      onClick={handleDeleteImg}
                    />
                  </div>
                )}
              </div>
            </div>
            <button
              className={
                "btn mt-3" + (isEdit ? " btn-success" : " btn-primary")
              }
              onClick={handleAdd}
            >
              {isEdit ? "Edit" : "Submit"}
            </button>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Id</TableCell>
                    <TableCell align="left">Alt</TableCell>
                    <TableCell align="left">Path</TableCell>
                    <TableCell align="left">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading
                    ? Array(rowsPerPage)
                        .fill(0)
                        .map((_, index) => <UserSkeleton key={index} />)
                    : sliders &&
                      sliders.map((slider) => {
                        return (
                          <TableRow key={slider.id}>
                            <TableCell>{slider.id}</TableCell>
                            <TableCell>{slider.alt}</TableCell>
                            <TableCell>{slider.category_name}</TableCell>
                            <TableCell>
                              <div className="handleButtonAction">
                                <button
                                  className="btn btn-danger"
                                  onClick={() => handleDelete(slider.id)}
                                >
                                  Delete
                                </button>
                                <button
                                  className="btn btn-primary"
                                  onClick={() => handleEdit(slider)}
                                >
                                  View & Edit
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                </TableBody>
              </Table>
            </TableContainer>
            {sliders && (
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={sliders.length}
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

export default Sliders;
