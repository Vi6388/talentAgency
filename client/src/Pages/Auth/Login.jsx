import { useState } from "react";
import WorkflowLogo from "../../svg/workflow_logo.png";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../apis";
import { store } from "../../redux/store";
import { CHANGE_IS_LOADING } from "../../redux/actionTypes";
import { useSelector } from "react-redux";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isLoading } = useSelector((state) => state.job);

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

  const handleSubmit = async () => {
    store.dispatch({ type: CHANGE_IS_LOADING, payload: true });
    try {
      api.login(loginForm).then((res) => {
        if (res.data.status === 200) {
          handleSuccess(res.data.message);
          login(res.data.data);
          setTimeout(() => {
            navigate("/");
            setLoginForm({
              ...loginForm,
              email: "",
              password: "",
            });
            store.dispatch({ type: CHANGE_IS_LOADING, payload: false });
          }, 2000);
        } else {
          store.dispatch({ type: CHANGE_IS_LOADING, payload: false });
          handleError(res.data.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className={`flex bg-main w-full h-full min-h-screen flex flex-col items-center justify-between`}>
        {
          isLoading ?
            <>
              <div className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2 z-10">
                <svg aria-hidden="true" className="w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
              </div>
              <div className="bg-black fixed z-30 w-full h-screen opacity-20"></div>
            </> :
            <></>
        }
        <main className="w-full h-full">
          <div className="w-full height-login-form flex items-center justify-center">
            <div className="flex flex-col items-center justify-center lg:justify-start mx-4">
              <div className="mb-16">
                <img src={WorkflowLogo} alt="Workflow Logo" />
              </div>
              <div className="my-2 w-full flex justify-center items-center">
                <input className="rounded-[16px] text-input shadow-lg shadow-500 text-center h-11 sm:w-96 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none" placeholder="EMAIL ADDRESS"
                  type="text" name="email" value={loginForm.email}
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="my-2 w-full flex justify-center items-center">
                <input className="rounded-[16px] text-input shadow-lg shadow-500 text-center h-11 sm:w-96 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none" placeholder="PASSWORD"
                  type="password" value={loginForm.password} name="password"
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="my-8 w-full flex justify-center items-center">
                <button className="bg-black w-64 h-11 tracking-wider text-center rounded-[12px] text-white font-gotham-bold 
                        block rounded bg-black uppercase leading-normal shadow-md transition duration-150 ease-in-out 
                        hover:bg-neutral-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 text-sm"
                  type="button" onClick={handleSubmit}>Login</button>
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