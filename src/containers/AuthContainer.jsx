import React, { useState, useEffect } from "react";
import LoginModal from "../components/LoginModal";
import { login, register } from "../utils/api";''

export default function AuthContainer({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
  }, [setToken]);

  const toggleLogin = () => {
    setIsLogin((prev) => !prev);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const authAction = isLogin ? login : register;

    authAction(form)
      .then((res) => {
        if (isLogin) {
          localStorage.setItem("token", res.accessToken);
          setToken(res.accessToken);
        } else {
          alert("register success");
        }
        setForm({
          username: "",
          password: "",
        });
        setError(null);
        if (!isLogin) setIsLogin(true);
      })
      .catch((err) => {
        setError(err.response.data.error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <LoginModal
        form={form}
        loading={loading}
        error={error}
        handleChange={handleChange}
        isLogin={isLogin}
        toggleLogin={toggleLogin}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
