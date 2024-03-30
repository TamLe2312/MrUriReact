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
  const [isLoading, setIsLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "0",
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
    if (isEdit) {
      try {
        await axios.put(`http://localhost:3001/users/${formData.id}`, formData);
        // console.log(res);
        setIsEdit(false);
        setFormData({
          username: "",
          email: "",
          password: "",
          role: "0",
        });
        fetchUser();
        toast.success("Edit Success");
      } catch (err) {
        console.error(err);
      }
    } else {
      await axios
        .post(`http://localhost:3001/users`, formData)
        .then((response) => {
          if (response.status) {
            fetchUser();
            setFormData({
              username: "",
              email: "",
              password: "",
              role: "0",
            });
            toast.success("Add Success");
          }
        })
        .catch((error) => {
          console.error("Error adding post:", error);
          toast.error("Add Failed");
        });
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:3001/users/${id}`);
      if (res.status === 200) {
        toast.success("Delete Success");
        fetchUser();
      }
      // console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (user) => {
    setIsEdit(true);
    setFormData(user);
  };

  const fetchUser = async () => {
    try {
      const res = await request.getRequest(`users`);
      if (res.data) {
        setUsers(res.data.results);
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
            <div className="form-group">
              <label>Role</label>
              <select
                id="role"
                className="form-control"
                onChange={handleChange}
                name="role"
                value={formData.role}
              >
                <option value="0">User</option>
                <option value="1">Admin</option>
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
                    : users &&
                      users.map((user) => {
                        return (
                          <TableRow key={user.id}>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              {user.role == 1 ? "Admin" : "User"}
                            </TableCell>
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
                count={users.length}
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
