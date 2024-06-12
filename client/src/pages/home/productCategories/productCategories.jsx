import { minPrice, truncateText } from "../../../helper/helper";
import * as request from "../../../utilities/request";
import Product from "./product";
import "./productCategories.css";
import { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const ProductCategories = () => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1024 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 1024, min: 800 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 800, min: 464 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
    },
  };
  const [selectCategory, setSelectCategory] = useState(1);
  const [listCategories, setListCategories] = useState([]);
  const [listProducts, setListProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const selectedCategory = (id) => {
    setSelectCategory(id);
    // fetchProducts(id);
  };
  const fetchCategories = async () => {
    try {
      const res = await request.getRequest("categories/productCategories");
      if (res.status === 200) {
        setListCategories(res.data.results);
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const fetchProducts = async (id) => {
    try {
      const res = await request.getRequest(`products/viewByCategory/${id}`);
      // console.log(res);
      const productsArray = res.data.results.map((product) => ({
        ...product,
        images: product.images.split(","),
        selling_price: minPrice(product.selling_price.split(",")),
        product_name: truncateText(product.product_name, 15),
      }));
      setListProducts(productsArray);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts(1);
  }, []);
  useEffect(() => {
    fetchProducts(selectCategory);
  }, [selectCategory]);
  return (
    <div className="container-fluid">
      <div className="container">
        <div className="productCategories">
          <div className="productCategoriesTitle">
            <h5>Products</h5>
            <ul>
              <li
                className={
                  selectCategory === 1 || selectCategory == null
                    ? "productCategoriesTitleActive"
                    : undefined
                }
                onClick={() => selectedCategory(1)}
              >
                All
              </li>
              {isLoading
                ? "Loading..."
                : listCategories.length > 0 &&
                  listCategories.map((item, index) => (
                    <li
                      key={index}
                      className={
                        selectCategory === item.id
                          ? "productCategoriesTitleActive"
                          : undefined
                      }
                      onClick={() => selectedCategory(item.id)}
                    >
                      {item.category_name}
                    </li>
                  ))}
            </ul>
          </div>
          <div className="productByCategory">
            {isLoading ? (
              "Loading..."
            ) : (
              <Carousel
                responsive={responsive}
                showDots={listProducts.length > 4}
              >
                {listProducts.length > 0 ? (
                  listProducts.map((item, index) => (
                    <Product key={index} item={item} />
                  ))
                ) : (
                  <Product />
                )}
              </Carousel>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCategories;
