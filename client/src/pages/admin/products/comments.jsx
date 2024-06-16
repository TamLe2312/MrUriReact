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
import * as request from "../../../utilities/request";
import SkeletonRow5 from "../../../components/skeleton/skeletonRow5/skeletonRow5";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import Star from "../../../components/star/star";

const Comments = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [comments, setComments] = useState();
  const [total, setTotal] = useState(0);
  const [commentsNum, setCommentsNum] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const handleBack = () => {
    navigate("/dashboard/products");
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      const res = await request.deleteRequest(`users/deleteComment/${id}`);
      // console.log(res);
      if (res.status === 200) {
        toast.success(res.data.message);
        fetchComments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (comments && comments.length > 0) {
      setIsLoading(true);
      const lastIndex = (page + 1) * rowsPerPage;
      const firstIndex = lastIndex - rowsPerPage;
      const records = comments.slice(firstIndex, lastIndex);
      setCommentsNum(records);
      setIsLoading(false);
    }
  }, [page, rowsPerPage]);
  const fetchComments = async (id) => {
    try {
      const res = await request.getRequest(`users/comment/${id}`);
      if (res.data) {
        setComments(res.data.results);
        setTotal(res.data.results.length);
        const lastIndex = (page + 1) * rowsPerPage;
        const firstIndex = lastIndex - rowsPerPage;
        const records = res.data.results.slice(firstIndex, lastIndex);
        setCommentsNum(records);
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchComments(id);
    }
  }, [id]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <div className="handleAddContainer">
        <p>Comments</p>
        <button className="btn btn-success" onClick={handleBack}>
          Back
        </button>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">ID</TableCell>
                    <TableCell align="left">Username</TableCell>
                    <TableCell align="left">Comment</TableCell>
                    <TableCell align="left">Rate</TableCell>
                    <TableCell align="left">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading
                    ? Array(rowsPerPage)
                        .fill(0)
                        .map((_, index) => <SkeletonRow5 key={index} />)
                    : commentsNum &&
                      commentsNum.map((comment) => {
                        return (
                          <TableRow key={comment.id}>
                            <TableCell>{comment.id}</TableCell>
                            <TableCell>{comment.username}</TableCell>
                            <TableCell>{comment.comment}</TableCell>
                            <TableCell>
                              <div className="d-flex">
                                <Star initialRate={comment.rate} />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="handleButtonAction">
                                <button
                                  className="btn btn-danger"
                                  onClick={() => handleDelete(comment.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                </TableBody>
              </Table>
            </TableContainer>
            {comments && (
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

export default Comments;
