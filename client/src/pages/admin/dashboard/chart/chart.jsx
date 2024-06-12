import * as React from "react";
import Title from "../title/title";
import { useState } from "react";
import { useEffect } from "react";
import * as request from "../../../../utilities/request";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const Chart = () => {
  const [data, setData] = useState({
    labels: [],
    data: [],
  });
  const [datas, setDatas] = useState(null);

  const handleSelect = (e) => {
    if (e.target.value == "year") {
      const newArr = {
        labels: datas.dataLast12Months.map(
          (item) => item.month + " " + item.year
        ),
        data: datas.dataLast12Months.map((item) => item.total.total || 0),
      };
      setData(newArr);
    } else {
      const newArr = {
        labels: datas.dataLast7Days.map((item) => item.date),
        data: datas.dataLast7Days.map((item) => item.total.total || 0),
      };
      setData(newArr);
    }
  };
  useEffect(() => {
    const run = async () => {
      const datas = await request.getRequest(`orders/chart`);
      // console.log(datas.data.results);
      setDatas(datas.data.results);
    };
    run();
  }, []);
  useEffect(() => {
    const run = async () => {
      if (datas) {
        const newArr = {
          labels: datas.dataLast7Days.map((item) => item.date),
          data: datas.dataLast7Days.map((item) => item.total.total || 0),
        };
        setData(newArr);
      }
    };
    run();
  }, [datas]);
  return (
    <div>
      <div className="row chart_mid">
        <div className="chart col-md-12">
          <Title>Thống kê doanh thu</Title>
          <select
            id="chart"
            className="form-control"
            onChange={(e) => handleSelect(e)}
            name="chart"
            defaultValue={"week"}
          >
            <option value="week">Last 7 days</option>
            <option value="year">Last 12 months</option>
          </select>
          <Bar
            data={{
              labels: data.labels,
              datasets: [
                {
                  label: "Profit (đ)",
                  data: data.data,
                  borderRadius: 2,
                  backgroundColor: "#1976d2",
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default Chart;
