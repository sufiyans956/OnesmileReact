import React, { useEffect, useRef, useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import Cookie from "js-cookie";
import axios from "axios";
import { toast } from 'react-toastify';

export default function Login() {
  const navigate = useNavigate();
  const username = useRef();
  const password = useRef();

  const [getuser, setusers] = useState([]);
  const [userdata, setuserdata] = useState([]);
  const [statusCode, setStatusCode] = useState(null);

  useEffect(() => {
    axios
      .get("http://onesmilebackend-production.up.railway.app/user/alluser")
      .then((response) => {
        setusers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://onesmilebackend-production.up.railway.app/user/authuser", {
        uname: username.current.value,
        password: password.current.value
      }, {
        withCredentials: true
      });

      setuserdata(response.data);
      setStatusCode(response.status);
    } catch (error) {
      setStatusCode(error.response ? error.response.status : 500);
      console.error(error);
    }
  };

  useEffect(() => {
    if (statusCode === 200) {
      const { role, uid } = userdata;

      toast.success("Login successful");

      if (role === "patient") {
        window.sessionStorage.setItem("abc", "1");
        window.sessionStorage.setItem("loginstore", "1");
        Cookie.set("usersetid", uid, { expires: 1, secure: true, sameSite: "strict" });
        Cookie.set("userlogin", username.current.value, { expires: 1, secure: true, sameSite: "strict" });

        if (Cookie.get("loginbook") === "1") {
          navigate("/");
        } else if (Cookie.get("book_s") === "2") {
          navigate("/appointmentspage");
        }
      } else if (role === "doctor") {
        window.sessionStorage.setItem("abc", "2");
        Cookie.set("Doctorlog", username.current.value, { expires: 1, secure: true, sameSite: "strict" });
        navigate("/");
        window.location.reload();
      } else if (role === "admin") {
        window.sessionStorage.setItem("abc", "3");
        Cookie.set("Adminlog", username.current.value, { expires: 1, secure: true, sameSite: "strict" });
        navigate("/adminhomepage");
        window.location.reload();
      }
    } else if (statusCode === 404) {
      toast.error("User not found");
    } else if (statusCode === 401) {
      toast.error("Unauthorized access");
    }
  }, [statusCode, userdata, navigate]);

  return (
    <>
      <section className="container-fluid bodycolor" style={{ position: "relative" }}>
        <div className="container py-5">
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div className="card shadow-2-strong" style={{ borderRadius: "#dd4b39" }}>
                <div className="card-body p-5 text-center">
                  <h3 className="mb-5">Sign in</h3>
                  <div className="form-outline mb-4">
                    <input
                      type="email"
                      id="typeEmailX-2"
                      className="form-control form-control-lg"
                      placeholder="User name"
                      ref={username}
                    />
                  </div>
                  <div className="form-outline mb-4">
                    <input
                      type="password"
                      id="typePasswordX-2"
                      className="form-control form-control-lg"
                      placeholder="Password"
                      ref={password}
                    />
                  </div>
                  <div className="form-check d-flex justify-content-start mb-4">
                    <a href="/ForgotPasswordpage">Click to Forgot password</a>
                  </div>
                  <button
                    className="btn btn-primary btn-lg btn-block"
                    type="submit"
                    onClick={handleLogin}
                  >
                    Login
                  </button>
                  <a href="/registerpage">
                    <button
                      className="btn btn-primary btn-lg btn-block"
                      type="submit"
                      style={{ marginLeft: "35px" }}
                    >
                      Register
                    </button>
                  </a>
                  <hr className="my-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
