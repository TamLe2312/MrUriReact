import axios from "axios";
import { TOKEN, SHOPID } from "../../config/env";

export const getProvinces = async () => {
  const res = await axios.get(
    `https://online-gateway.ghn.vn/shiip/public-api/master-data/province`,
    {
      headers: {
        token: TOKEN,
      },
    }
  );
  if (res) {
    return res;
  }
  return () => {};
};
export const getDistricts = async (province_id) => {
  const res = await axios.get(
    `https://online-gateway.ghn.vn/shiip/public-api/master-data/district`,
    {
      headers: {
        token: TOKEN,
      },
      params: {
        province_id: province_id,
      },
    }
  );
  return res;
};
export const getWards = async (district_id) => {
  const res = await axios.get(
    `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward`,
    {
      headers: {
        token: TOKEN,
      },
      params: {
        district_id: district_id,
      },
    }
  );
  return res;
};
