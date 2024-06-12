import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import Title from "../title/title";
import "./productStockPie.css";
import { useEffect, useState } from "react";
import * as request from "../../../../utilities/request";
import randomColor from "randomcolor";
import { useSpring, animated } from "react-spring";

ChartJS.register(ArcElement, Tooltip, Legend);

const ProductStockPie = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: "Total Category",
        data: [],
        backgroundColor: [],
        borderWidth: 1,
      },
    ],
  });
  const [datas, setDatas] = useState(null);
  const [total, setTotal] = useState(0);
  const [totalSell, setTotalSell] = useState(0);
  function NumberAnimated({ n }) {
    const { number } = useSpring({
      from: { number: 0 },
      number: n,
      delay: 200,
      config: { mass: 1, tension: 20, friction: 10 },
    });
    return <animated.div>{number.to((n) => n.toFixed(0))}</animated.div>;
  }

  useEffect(() => {
    const run = async () => {
      const datas = await request.getRequest(`orders/pie`);
      //   console.log(datas.data.results);
      setDatas(datas);
      setTotalSell(datas.data.results.totalSell);
      setTotal(datas.data.results.total);
    };
    run();
  }, []);
  useEffect(() => {
    const run = async () => {
      if (datas) {
        const newArr = {
          labels: datas.data.results.products.map(
            (product) => product.category_name
          ),
          datasets: [
            {
              label: "Total Category",
              data: datas.data.results.products.map(
                (product) => product.total_products
              ),
              backgroundColor: datas.data.results.products.map((product) =>
                randomColor(product.category_name)
              ),
              borderWidth: 1,
            },
          ],
        };
        setData(newArr);
      }
    };
    run();
  }, [datas]);
  return (
    <div className="row chart_mid mb-2">
      <div className="row mb-2">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Products</h5>
              <div className="card-text">
                <h3 id="total-tweets">
                  <NumberAnimated n={total} />
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Sell Products</h5>
              <div className="card-text">
                <h3 id="total-retweets">
                  <NumberAnimated n={totalSell} />
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="chart col-md-12">
        <Title>Product Stock</Title>
        <Pie className="chart_pie" data={data} />
      </div>
    </div>
  );
};

export default ProductStockPie;
