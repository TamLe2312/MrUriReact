import "./navbar.css";
import { IoIosArrowDown } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaSearch, FaUser } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userProvider";
import * as request from "../../utilities/request";
const Navbar = () => {
  const { user, handleSet } = useContext(UserContext);
  const [currentUser, setCurrentUser] = useState({});
  const [categories, setCategories] = useState();
  const handleLogout = () => {
    localStorage.removeItem("token");
    handleSet(null);
  };
  const fetchUser = async (userId) => {
    if (userId) {
      try {
        const res = await request.getRequest(`users/user/${userId}`);
        if (res.status === 200) {
          setCurrentUser(res.data.results[0]);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };
  const fetchCategories = async () => {
    try {
      const res = await request.getRequest("categories");
      if (res.status === 200) {
        // console.log(res.data);
        setCategories(res.data.results);
      } else {
        setCategories(null);
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (user !== null) {
      fetchUser(user.id);
    } else {
      setCurrentUser(null);
    }
    fetchCategories();
  }, [user]);
  return (
    <>
      {/* <!-- Navbar start --> */}
      <div className="container-fluid fixed-top navbarContainer">
        <div className="container topbar bg-primary d-none d-lg-block navbarTop">
          <div className="d-flex justify-content-between">
            <div className="top-info ps-2">
              <small className="me-3">
                <IoLocationOutline className="me-2" id="navbarIcons" />
                <a href="#" className="text-white">
                  Tây Sơn,Phường Tân Thành,TP.Buôn Ma Thuộc
                </a>
              </small>
              <small className="me-3">
                <MdOutlineMailOutline className="me-2" id="navbarIcons" />
                <a href="#" className="text-white">
                  tamlmpk02957@fpt.edu.vn
                </a>
              </small>
            </div>
            <div className="top-link pe-2">
              {currentUser !== null ? (
                <small className="text-white userInform">
                  Hello {currentUser.username},
                  <button onClick={handleLogout}>Logout</button>
                </small>
              ) : (
                <small className="text-white userInform">
                  <Link to={"/sign-in"}>Sign-in</Link> or{" "}
                  <Link to={"/sign-up"}>Sign-up</Link>
                </small>
              )}
            </div>
          </div>
        </div>
        <div className="container px-0 navbarBottom">
          <nav className="navbar navbar-light bg-white navbar-expand-xl">
            <Link to="/" className="navbar-brand">
              <h1 className="text-primary display-6">Mr Uri</h1>
            </Link>
            <button
              className="navbar-toggler py-2 px-3"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarCollapse"
            >
              <span className="fa fa-bars text-primary"></span>
            </button>
            <div
              className="collapse navbar-collapse bg-white"
              id="navbarCollapse"
            >
              <div className="navbar-nav mx-auto">
                {categories && categories.length > 0 ? (
                  categories.map((category) => {
                    const childCategories = categories.filter(
                      (childCategory) =>
                        category.id === childCategory.parent_category
                    );
                    return (
                      category.parent_category === 0 &&
                      category.status === 1 &&
                      (childCategories && childCategories.length > 0 ? (
                        <div className="nav-item dropdown" key={category.id}>
                          <Link
                            to={`categories/${category.category_slug}`}
                            className="nav-link "
                          >
                            {category.category_name} &nbsp;
                            <IoIosArrowDown />
                          </Link>
                          <div className="dropdown-menu m-0 bg-secondary rounded-0">
                            {childCategories.map((childCategory) => {
                              return (
                                <Link
                                  to={`categories/${childCategory.category_slug}`}
                                  className="dropdown-item"
                                  key={childCategory.id}
                                >
                                  {childCategory.category_name}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <Link
                          className="nav-item nav-link"
                          to={`categories/${category.category_slug}`}
                          key={category.id}
                        >
                          {category.category_name}
                        </Link>
                      ))
                    );
                  })
                ) : (
                  <a className="nav-item nav-link">Không có danh mục</a>
                )}
              </div>
              <div className="d-flex m-3 me-0">
                <button
                  className="d-flex btn-search btn border border-secondary btn-md-square rounded-circle bg-white me-4"
                  data-bs-toggle="modal"
                  data-bs-target="#searchModal"
                >
                  <FaSearch id="navbarHandleIcons" />
                </button>
                <a href="/carts" className="position-relative me-4 my-auto">
                  <FiShoppingCart id="navbarHandleIcons" />
                </a>
                <a href="/profile" className="my-auto">
                  <FaUser id="navbarHandleIcons" />
                </a>
              </div>
            </div>
          </nav>
        </div>
      </div>
      {/* <!-- Navbar End --> */}
    </>
  );
};
export default Navbar;
