import { useState } from "react";
import WorkflowLogo from "../../svg/workflow_logo.png";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import { api } from "../../apis";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({
      ...loginForm,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "top-left",
    });

  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "top-left",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      api.login(loginForm).then((res) => {
        if (res.data.status === 200) {
          handleSuccess(res.data.message);
          login(res.data.data);
          navigate("/");
        } else {
          handleError(res.data.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
    setLoginForm({
      ...loginForm,
      email: "",
      password: "",
    });
  };

  return (
    <>
      <ToastContainer />
      <div className={`flex bg-main w-full h-full min-h-screen flex flex-col items-center justify-between`}>
        <main className="w-full h-full">
          <div className="w-full height-login-form flex items-center justify-center">
            <div className="flex flex-col items-center justify-center lg:justify-start mx-4">
              <div className="mb-16">
                <img src={WorkflowLogo} alt="Workflow Logo" />
              </div>
              <div className="my-2 w-full flex justify-center items-center">
                <input className="rounded-[16px] text-input shadow-lg shadow-500 text-center h-11 sm:w-96 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold" placeholder="EMAIL ADDRESS"
                  type="text" name="email" value={loginForm.email}
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="my-2 w-full flex justify-center items-center">
                <input className="rounded-[16px] text-input shadow-lg shadow-500 text-center h-11 sm:w-96 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold" placeholder="PASSWORD"
                  type="password" value={loginForm.password} name="password"
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="my-8 w-full flex justify-center items-center">
                <button className="bg-black w-64 h-11 tracking-wider text-center rounded-[12px] text-white font-bold 
                        block rounded bg-black uppercase leading-normal shadow-md transition duration-150 ease-in-out 
                        hover:bg-neutral-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 
                        active:bg-neutral-600 active:shadow-lg text-sm" type="button" onClick={handleSubmit}>Login</button>
              </div>
              <div>
                <span className="text-brown underline underline-offset-1 font-semibold cursor-pointer hover:text-[#61534c] text-sm">Forgot your password?</span>
              </div>
            </div>
          </div>
        </main>
        <footer className="mt-8">
          <span className="text-[#242c32] text-sm font-semibold tracking-wide">&copy;2024 Atarimae Agency & Creative Soldier</span>
        </footer>
      </div>
    </>
  )
};

export default Login;