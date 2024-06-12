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
export const getFee = async (district_id, ward_code, service_id) => {
  const res = await axios.post(
    "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
    {
      from_district_id: 1552,
      from_ward_code: "400107",
      service_id: service_id,
      service_type_id: 2,
      to_district_id: district_id,
      to_ward_code: `${ward_code}`,
      height: 1,
      length: 1,
      weight: 1000,
      width: 1,
      insurance_value: 0,
      cod_failed_amount: 2000,
      coupon: null,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Token: TOKEN,
        ShopId: parseInt(SHOPID),
      },
    }
  );
  return res;
};
export const getService = async (district_id) => {
  const res = await axios.post(
    "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services",
    {
      shop_id: parseInt(SHOPID),
      from_district: 1552,
      to_district: district_id,
    },
    {
      headers: {
        "Content-Type": "application/json",
        token: TOKEN,
      },
    }
  );
  return res;
};
