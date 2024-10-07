import { useState } from "react";
import { Link } from "react-router-dom";
import { UserApi } from "../../apis/UserApi";
import { toast, ToastContainer } from "react-toastify";

const UserForm = () => {
  const [userForm, setUserForm] = useState({
    firstname: "",
    surname: "",
    email: "",
    phoneNumber: "",
    username: "",
    password: "",
    avatar: ""
  });

  const handleChange = (e) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value
    })
  }

  const handleError = (err) =>
    toast.error(err, {
      position: "top-left",
    });

  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "top-left",
    });

  const handleSubmit = (e) => {
    console.log(userForm)
    e.preventDefault();
    UserApi.add(userForm).then((res) => {
      try {
        if (res.status === 200) {
          handleSuccess(res.message);
        } else {
          handleError(res.message);
        }
      } catch (e) {
        handleError(e);
      }
    });
  }

  return (
    <div className="p-5 h-full bg-main">
      <ToastContainer />
      <div className="text-[36px] text-title-2 font-bold my-5 w-full text-center">Settings</div>
      <div className="w-2/3 mx-auto grid grid-cols-1 md:grid-cols-3">
        <div className="col-span-1 md:col-span-2">
          <div className="">
            <div className="text-base text-title-2 font-semibold py-3">New User</div>
            <div className="flex flex-col justify-between items-center gap-3">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="cols-span-1">
                  <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="firstname"
                    type="text" value={userForm.firstname} name="firstname"
                    onChange={(e) => handleChange(e)} />
                </div>
                <div className="cols-span-1">
                  <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="surname"
                    type="text" value={userForm.surname} name="surname"
                    onChange={(e) => handleChange(e)} />
                </div>
              </div>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="cols-span-1">
                  <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="email address"
                    type="text" value={userForm.email} name="email"
                    onChange={(e) => handleChange(e)} />
                </div>
                <div className="cols-span-1">
                  <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="phone number"
                    type="text" value={userForm.phoneNumber} name="phoneNumber"
                    onChange={(e) => handleChange(e)} />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <div className="text-base text-title-2 font-semibold py-3">Login Information</div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="cols-span-1">
                <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="username"
                  type="text" value={userForm.username} name="username"
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="cols-span-1">
                <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="password"
                  type="password" value={userForm.password} name="password"
                  onChange={(e) => handleChange(e)} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <div className="text-base text-title-2 font-semibold py-3 text-center">Profile Image</div>
          <div className="flex justify-center items-center">
            <div className="w-[120px] h-[120px] mx-auto border border-dashed border-dashed-color rounded-lg flex justify-center items-center">
              <div className="text-gray text-sm uppercase w-1/3 flex justify-center items-center text-center">Profile Image</div>
            </div>
          </div>
          <div className="text-kanban text-sm uppercase decoration-2 underline my-2 text-center font-semibold cursor-pointer hover:text-black">Update</div>
        </div>
      </div>

      <div className="flex justify-start md:justify-center items-center mt-12 gap-5">
        <button className="bg-button-6 h-12 md:h-9 text-center rounded-[12px] text-white font-bold tracking-wider w-full md:w-[160px]
                            block rounded leading-normal shadow-md transition duration-150 ease-in-out
                            hover:bg-[#a38b7b] hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 
                            active:bg-[#978172] active:shadow-lg text-sm" type="button"
          onClick={(e) => handleSubmit(e)}>Create</button>

        <Link to={"/settings"} className="w-full sm:w-fit">
          <button className="bg-button-6 h-12 md:h-9 text-center rounded-[12px] text-white font-bold tracking-wider w-full md:w-[160px]
                            block rounded leading-normal shadow-md transition duration-150 ease-in-out
                            hover:bg-[#a38b7b] hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 
                            active:bg-[#978172] active:shadow-lg text-sm">Close</button>
        </Link>

        <button className="bg-button-4 h-12 md:h-9 text-center rounded-[12px] text-white font-bold tracking-wider w-full md:w-[160px]
                            block rounded leading-normal shadow-md transition duration-150 ease-in-out
                            hover:bg-neutral-700 hover:shadow-lg focus:bg-neutral-700 focus:shadow-md focus:outline-none focus:ring-0 
                            active:bg-neutral-600 active:shadow-lg text-sm" type="button"
          onClick={(e) => handleSubmit(e)}>Update</button>
      </div>
    </div>
  )
}

export default UserForm;