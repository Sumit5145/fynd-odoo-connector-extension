import React, { useContext, useEffect, useState } from "react";
import Loader from "../components/Loader"; // Import Loader component
import { useParams, useNavigate } from "react-router-dom";
import "./style/auth.css";
import MainService from '../services/main-service';
import { UserStateContext } from "../context/UserContext";

function Auth() {
  const [message, setMessage] = useState("");
  const { company_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // State to handle loading
  const { application_id, setCompanyId, setUserId } = useContext(UserStateContext);
  
  const [formData, setFormData] = useState({
    company_id,
    application_id,
    odooUrl: "",
    dbName: "",
    userName: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    try {
      setCompanyId(company_id)
      setLoading(true);
      async function isAuthenticated() {
        try {
          const res = await MainService.existOauthAccount(application_id);

          if (res.status === 200) {
            setUserId(res.data.auth)
            navigate("/dashboard");
          }
          else {
            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
        }
      }
      isAuthenticated();
    } catch (error) {
      setLoading(false);
    }
  }, [application_id]);

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;
    if (!formData.odooUrl) {
      tempErrors.odooUrl = "Odoo URL is required";
      isValid = false;
    } else if (!/^https:\/\/[\w]+\.odoo\.com$/.test(formData.odooUrl)) {
      tempErrors.odooUrl =
        "Odoo URL is invalid. Format should be like https://example.odoo.com";
      isValid = false;
    }
    if (!formData.dbName) {
      tempErrors.dbName = "Database name is required";
      isValid = false;
    }
    if (!formData.userName) {
      tempErrors.userName = "Username is required";
      isValid = false;
    }
    if (!formData.password) {
      tempErrors.password = "Password is required";
      isValid = false;
    }
    setErrors(tempErrors);
    return isValid;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
    // Validate individual field when user types
    validateForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true); // Set loading to true when the form is submitted
      const res = await MainService.createOauth(formData);

      const data = await res.data;
      setMessage("Response Message: " + data.message + data.auth);
      if (data.auth) {
        setUserId(data.auth);
        navigate("/dashboard");
      }
    } catch (error) {
      setMessage(error.message); // Set error message
      setLoading(false); // Ensure loading is set to false on error
    } finally {
      setFormData({
        odooUrl: "",
        dbName: "",
        userName: "",
        password: "",
      });
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {loading ? (
        <Loader />
      ) : (
        <form onSubmit={handleSubmit} className="auth-form">
          <h2 className="font-semibold text-2xl text-black">
            Connect Your Store With Odoo
          </h2>
          <div>
            <div className="text-black text-sm font-normal mb-2 mt-4">
              Odoo url
            </div>
            <input
              type="text"
              name="odooUrl"
              value={formData.odooUrl}
              onChange={handleChange}
              placeholder="Write your odoo url"
              className="auth-input"
              required
            />
            {errors.odooUrl && (
              <div className="error-message">{errors.odooUrl}</div>
            )}
          </div>
          <div>
            <div className="text-black text-sm font-normal mb-2 mt-2">
              DB Name
            </div>
            <input
              type="text"
              name="dbName"
              value={formData.dbName}
              onChange={handleChange}
              placeholder="Write your database name"
              className="auth-input"
              required
            />
            {errors.dbName && (
              <div className="error-message">{errors.dbName}</div>
            )}
          </div>
          <div>
            <div className="text-black text-sm font-normal mb-2 mt-2">
              Username
            </div>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Write your username"
              className="auth-input"
              required
            />
            {errors.userName && (
              <div className="error-message">{errors.userName}</div>
            )}
          </div>
          <div>
            <div className="text-black text-sm font-normal mb-2 mt-2">
              Password
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Write your password"
              className="auth-input"
              required
            />
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div>
          <div className="message-container">{message}</div>
          <button type="submit" className="auth-button">
            Connect your store
          </button>
        </form>
      )}
    </div>
  );
}

export default Auth;
