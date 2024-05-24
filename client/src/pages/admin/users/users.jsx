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
import "./users.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import * as request from "../../../utilities/request";
import UserSkeleton from "../../../components/skeleton/userSkeleton/userSkeleton";

const Users = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [users, setUsers] = useState();
  const [total, setTotal] = useState(0);
  const [usersNum, setUsersNum] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "user",
    password: "",
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

  const handleUser = async () => {
    setIsLoading(true);
    if (isEdit) {
      try {
        const res = await request.postRequest(`users/edit`, {
          username: formData.username,
          email: formData.email,
          role: formData.role,
        });
        // console.log(res);
        if (res.status === 200) {
          setFormData({
            username: "",
            email: "",
            password: "",
            role: "user",
          });
          fetchUser();
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
        const res = await request.postRequest(`users/add`, {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.username,
        });
        if (res.status === 200) {
          toast.success(res.data.message);
          fetchUser();
        }
      } catch (err) {
        if (err.response.status === 400) {
          toast.error(err.response.data.message);
        }
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await request.deleteRequest(`users/delete/${id}`);
      // console.log(res);
      if (res.status === 200) {
        toast.success(res.data.message);
        fetchUser();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (user) => {
    setIsLoading(true);
    setIsEdit(true);
    try {
      const res = await request.getRequest(`users/user/${user.id}`);
      if (res.status === 200) {
        const userData = res.data.results[0];
        setFormData({
          username: userData.username,
          email: userData.email,
          role: userData.role,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (users && users.length > 0) {
      setIsLoading(true);
      const lastIndex = (page + 1) * rowsPerPage;
      const firstIndex = lastIndex - rowsPerPage;
      const records = users.slice(firstIndex, lastIndex);
      setUsersNum(records);
      setIsLoading(false);
    }
  }, [page, rowsPerPage]);
  const fetchUser = async () => {
    try {
      const res = await request.getRequest(`users`);
      if (res.data) {
        setUsers(res.data.results);
        setTotal(res.data.results.length);
        const lastIndex = (page + 1) * rowsPerPage;
        const firstIndex = lastIndex - rowsPerPage;
        const records = res.data.results.slice(firstIndex, lastIndex);
        setUsersNum(records);
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <p>Users</p>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Paper
            sx={{
              p: 2,
            }}
          >
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {!isEdit && (
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            )}
            <div className="form-group">
              <label>Role</label>
              <select
                id="role"
                className="form-control"
                onChange={handleChange}
                name="role"
                value={formData.role}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              className={
                "btn mt-3" + (isEdit ? " btn-success" : " btn-primary")
              }
              onClick={handleUser}
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
                    <TableCell align="left">Username</TableCell>
                    <TableCell align="left">Email</TableCell>
                    <TableCell align="left">Role</TableCell>
                    <TableCell align="left">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading
                    ? Array(rowsPerPage)
                        .fill(0)
                        .map((_, index) => <UserSkeleton key={index} />)
                    : usersNum &&
                      usersNum.map((user) => {
                        return (
                          <TableRow key={user.id}>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                              <div className="handleButtonAction">
                                <button
                                  className="btn btn-danger"
                                  onClick={() => handleDelete(user.id)}
                                >
                                  Delete
                                </button>
                                <button
                                  className="btn btn-primary"
                                  onClick={() => handleEdit(user)}
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
            {users && (
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

export default Users;
