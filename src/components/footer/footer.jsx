import "./footer.css";
import XIcon from "@mui/icons-material/X";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
  return (
    <>
      {/* <!-- Footer Start --> */}
      <div
        className="container-fluid text-white-50 footer pt-5 mt-5"
        style={{ backgroundColor: "#45595b" }}
      >
        <div className="container py-5">
          <div
            className="pb-4 mb-4"
            style={{ borderBottom: "1px solid rgba(226, 175, 24, 0.5)" }}
          >
            <div className="row g-4">
              <div className="col-lg-6">
                <a href="#">
                  <h1 className="mb-0">Mr Uri</h1>
                  <p className="mb-0">Miracle products</p>
                </a>
              </div>
              <div className="col-lg-6">
                <div className="d-flex justify-content-end pt-3">
                  <a className="btn me-2 rounded-circle informIcons" href="">
                    <XIcon />
                  </a>
                  <a className="btn me-2 rounded-circle informIcons" href="">
                    <FacebookIcon />
                  </a>
                  <a className="btn me-2 rounded-circle informIcons" href="">
                    <GitHubIcon />
                  </a>
                  <a className="btn rounded-circle informIcons" href="">
                    <InstagramIcon />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="row g-5">
            <div className="col-lg-3 col-md-6">
              <div className="footer-item">
                <h4 className="text-light mb-3">Why People Like us!</h4>
                <p className="mb-4">
                  typesetting, remaining essentially unchanged. It was
                  popularised in the 1960s with the like Aldus PageMaker
                  including of Lorem Ipsum.
                </p>
                <a
                  href=""
                  className="btn border-secondary py-2 px-4 rounded-pill text-primary"
                >
                  Read More
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="d-flex flex-column text-start footer-item">
                <h4 className="text-light mb-3">Shop Info</h4>
                <a className="btn-link" href="">
                  About Us
                </a>
                <a className="btn-link" href="">
                  Contact Us
                </a>
                <a className="btn-link" href="">
                  Privacy Policy
                </a>
                <a className="btn-link" href="">
                  Terms & Condition
                </a>
                <a className="btn-link" href="">
                  Return Policy
                </a>
                <a className="btn-link" href="">
                  FAQs & Help
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="d-flex flex-column text-start footer-item">
                <h4 className="text-light mb-3">Account</h4>
                <a className="btn-link" href="">
                  My Account
                </a>
                <a className="btn-link" href="">
                  Shop details
                </a>
                <a className="btn-link" href="">
                  Shopping Cart
                </a>
                <a className="btn-link" href="">
                  Wishlist
                </a>
                <a className="btn-link" href="">
                  Order History
                </a>
                <a className="btn-link" href="">
                  International Orders
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="footer-item">
                <h4 className="text-light mb-3">Contact</h4>
                <p>Address: Tây Sơn,Phường Tân Thành,TP Buôn Ma Thuột</p>
                <p>Email: tamlmpk02957@fpt.edu.vn</p>
                <p>Phone: +0817643335</p>
                <p>Payment Accepted</p>
                <img
                  src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png"
                  className="img-fluid"
                  alt=""
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Footer End --> */}
    </>
  );
};

export default Footer;
