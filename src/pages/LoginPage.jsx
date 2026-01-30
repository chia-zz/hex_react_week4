import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { adminSignin } from "../api/Api";

function LoginPage() {
  const navigate = useNavigate(); // 建立 navigate router
  const [setIsAuth] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((preData) => ({
      ...preData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      const res = await adminSignin(formData);

      const { token, expired } = res.data;

      // cookie & token setting
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      // axios.defaults.headers.common["Authorization"] = token;
      toast.success("登入成功");
      navigate("/products");
    } catch (error) {
      toast.error(`登入失敗: ${error.response?.data.message}`);
      setIsAuth(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container login">
        <h2>請先登入</h2>
        <form className="form-floating">
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              name="username"
              id="username"
              placeholder="name@gmail.com"
              value={formData.username}
              onChange={(e) => handleInputChange(e)}
              required
            />
            <label htmlFor="username">Email Address</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              name="password"
              id="password"
              placeholder="12345678"
              value={formData.password}
              onChange={(e) => handleInputChange(e)}
              required
            />
            <label htmlFor="password">Password</label>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 mt-2"
            onClick={handleSubmit}
            disabled={!formData.username || !formData.password}
          >
            {formData.username && formData.password ? "登入" : "請輸入帳號密碼"}
          </button>
        </form>
      </div>
    </>
  );
}

export default LoginPage;
