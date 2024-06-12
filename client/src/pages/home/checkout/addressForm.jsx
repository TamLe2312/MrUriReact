import { useContext, useEffect, useState } from "react";
import Select from "react-select";
import {
  getDistricts,
  getProvinces,
  getWards,
} from "../../../components/provinces/provinces";
import Validation from "../../../components/validation/validation";
import * as request from "../../../utilities/request";
import { toast } from "sonner";
import { SocketContext } from "../../../context/socketContext";

const AddressFormCheckout = (props) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const { userId, closeModal } = props;
  const options = [{ value: "", label: "" }];
  const [errors, setErrors] = useState({});
  const { socket } = useContext(SocketContext);
  const start = () => {
    setFormData({
      address: "",
      phoneNumber: "",
      provinces: null,
      districts: null,
      wards: null,
    });
  };

  const [formData, setFormData] = useState({
    address: "",
    phoneNumber: "",
    provinces: null,
    districts: null,
    wards: null,
  });
  useEffect(() => {
    const fetchProvinces = async () => {
      start();
      const data = await getProvinces();
      if (data.data.code == 200) {
        const dataProvinces = data.data.data;
        const newArr = dataProvinces.map((item) => ({
          ProvinceID: item.ProvinceID,
          ProvinceName: item.ProvinceName,
        }));
        setProvinces(newArr);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const run = async () => {
      if (formData.provinces) {
        // console.log(formData.provinces);
        const data = await getDistricts(formData.provinces.value);
        if (data.data.code == 200) {
          const dataDistricts = data.data.data;
          const newArr = dataDistricts.map((item) => ({
            DistrictID: item.DistrictID,
            DistrictName: item.DistrictName,
          }));
          setDistricts(newArr);
        }
      }
    };
    run();
  }, [formData.provinces]);
  useEffect(() => {
    const run = async () => {
      if (formData.districts) {
        const data = await getWards(formData.districts.value);
        // console.log(data);
        if (data.data.code == 200) {
          const dataXa = data.data.data;
          const newArr = dataXa.map((item) => ({
            WardCode: item.WardCode,
            WardName: item.WardName,
          }));
          setWards(newArr);
        }
      }
    };
    run();
  }, [formData.districts]);

  const handleProvinces = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      provinces: e,
    }));
  };

  const handleDistricts = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      districts: e,
    }));
  };

  const handleWards = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      wards: e,
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const validate = () => {
    const errors = Validation(formData, "addressForm");
    let isValid = true;
    setErrors(errors);
    if (
      Object.keys(errors).length !== 0 ||
      !Object.values(formData).every((value) => value !== "")
    ) {
      isValid = false;
    }

    return isValid;
  };
  ``;
  const handleSubmit = async () => {
    const isValid = validate();
    if (isValid) {
      try {
        const formDatas = new FormData();
        formDatas.append("address", formData.address);
        formDatas.append("phoneNumber", formData.phoneNumber);
        formDatas.append("id", userId);
        formDatas.append("provinces", JSON.stringify(formData.provinces));
        formDatas.append("districts", JSON.stringify(formData.districts));
        formDatas.append("wards", JSON.stringify(formData.wards));

        const res = await request.postRequest("users/address", formDatas);
        if (res.status === 200) {
          /*console.log(res); */
          await socket.emit("add_address", {
            userId,
            address: formData.address,
            phoneNumber: formData.phoneNumber,
            provinces: formData.provinces,
            districts: formData.districts,
            wards: formData.wards,
          });
          closeModal();
          toast.success(res.data.message);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };
  return (
    <>
      <div className="row">
        <div className="col-md-12 col-lg-4">
          <div className="form-item w-100">
            <label>Tỉnh</label>
            <Select
              onChange={handleProvinces}
              options={
                provinces.length > 0
                  ? provinces.map((i) => ({
                      value: i.ProvinceID,
                      label: i.ProvinceName,
                    }))
                  : options
              }
              className={
                errors.provinces ? "form-control is-invalid" : "form-control"
              }
            />
            {errors.provinces && (
              <div
                id="validationServerBrandFeedback"
                className="invalid-feedback"
              >
                {errors.provinces}
              </div>
            )}
          </div>
        </div>
        <div className="col-md-12 col-lg-4">
          <div className="form-item w-100">
            <label>Huyện</label>
            <Select
              onChange={handleDistricts}
              options={
                districts.length > 0
                  ? districts.map((i) => ({
                      value: i.DistrictID,
                      label: i.DistrictName,
                    }))
                  : options
              }
              className={
                errors.districts ? "form-control is-invalid" : "form-control"
              }
            />
            {errors.districts && (
              <div
                id="validationServerBrandFeedback"
                className="invalid-feedback"
              >
                {errors.districts}
              </div>
            )}
          </div>
        </div>
        <div className="col-md-12 col-lg-4">
          <div className="form-item w-100">
            <label>Wards</label>
            <Select
              onChange={handleWards}
              options={
                wards.length > 0
                  ? wards.map((i) => ({
                      value: i.WardCode,
                      label: i.WardName,
                    }))
                  : options
              }
              className={
                errors.wards ? "form-control is-invalid" : "form-control"
              }
            />
            {errors.wards && (
              <div
                id="validationServerBrandFeedback"
                className="invalid-feedback"
              >
                {errors.wards}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <label className="form-label my-3">
            Address<sup>*</sup>
          </label>
          <input
            type="text"
            className={
              errors.address ? "form-control is-invalid" : "form-control"
            }
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && (
            <div
              id="validationServerBrandFeedback"
              className="invalid-feedback"
            >
              {errors.address}
            </div>
          )}
        </div>
        <div className="col-md-6">
          <label className="form-label my-3">
            Phone number<sup>*</sup>
          </label>
          <input
            type="text"
            className={
              errors.phoneNumber ? "form-control is-invalid" : "form-control"
            }
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          {errors.phoneNumber && (
            <div
              id="validationServerBrandFeedback"
              className="invalid-feedback"
            >
              {errors.phoneNumber}
            </div>
          )}
        </div>
      </div>
      <button className="btn btn-primary mt-3" onClick={handleSubmit}>
        Submit
      </button>
      {/*   <div className="form-item">
        <label className="form-label my-3">
          Address<sup>*</sup>
        </label>
        <input
          type="text"
          className={
            errors.address ? "form-control is-invalid" : "form-control"
          }
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        {errors.address && (
          <div id="validationServerBrandFeedback" className="invalid-feedback">
            {errors.address}
          </div>
        )}
      </div> */}
    </>
  );
};

export default AddressFormCheckout;
