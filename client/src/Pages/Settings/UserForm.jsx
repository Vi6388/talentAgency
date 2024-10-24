import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { UserApi } from "../../apis/UserApi";
import { toast, ToastContainer } from "react-toastify";
import { isFormValid } from "../../utils/utils";

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [userForm, setUserForm] = useState({
    firstname: "",
    surname: "",
    email: "",
    phoneNumber: "",
    username: "",
    password: "",
    avatar: ""
  });

  const [fileInfo, setFileInfo] = useState({
    filename: "",
    imageSrc: "",
    isPreviewVisible: false
  });

  useEffect(() => {
    if (id !== undefined) {
      UserApi.getUserById(id).then((res) => {
        if (res.data.status === 200) {
          const user = res.data.data;
          setUserForm({
            firstname: user.firstname || "",
            surname: user.surname || "",
            email: user.email || "",
            phoneNumber: user.phoneNumber || "",
            username: user.username || "",
            password: ""
          });
          if (user.avatar !== "") {
            setFileInfo({
              ...fileInfo,
              isPreviewVisible: true,
              imageSrc: user.avatar
            })
          }
        }
      });
    }
  }, [id]);

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
    e.preventDefault();
    const requiredFields = ['firstname', 'surname', 'email', 'username', 'password'];
    const valid = isFormValid(userForm, requiredFields);
    if(!userForm.avatar && !fileInfo.imageSrc) {
      handleError("Please upload avatar.");
    }
    if (valid && (userForm.avatar || fileInfo.imageSrc)) {
      const formData = new FormData();
      formData.append('avatar', userForm.avatar);
      formData.append('firstname', userForm.firstname);
      formData.append('surname', userForm.surname);
      formData.append('email', userForm.email);
      formData.append('phoneNumber', userForm.phoneNumber);
      formData.append('username', userForm.username);
      formData.append('password', userForm.password);

      if (id === undefined) {
        UserApi.add(formData).then((res) => {
          try {
            if (res.data.status === 200) {
              handleSuccess(res.data.message);
              setTimeout(() => {
                navigate("/settings");
              }, 2000);
            } else {
              handleError(res.data.message);
            }
          } catch (e) {
            handleError(e);
          }
        });
      } else {
        UserApi.updateUserById(id, formData).then((res) => {
          try {
            if (res.data.status === 200) {
              handleSuccess(res.data.message);
              setTimeout(() => {
                navigate("/settings");
              }, 2000);
            } else {
              handleError(res.data.message);
            }
          } catch (e) {
            handleError(e);
          }
        })
      }
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUserForm({
      ...userForm,
      avatar: e.target.files[0]
    })

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileInfo({
          filename: file.name,
          imageSrc: e.target.result,
          isPreviewVisible: true
        })
      };
      reader.readAsDataURL(file);
    } else {
      setFileInfo({
        filename: '',
        imageSrc: '',
        isPreviewVisible: false
      })
    }
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
                    type="text" value={userForm.firstname} name="firstname" required
                    onChange={(e) => handleChange(e)} />
                </div>
                <div className="cols-span-1">
                  <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="surname"
                    type="text" value={userForm.surname} name="surname" required
                    onChange={(e) => handleChange(e)} />
                </div>
              </div>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="cols-span-1">
                  <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="email address"
                    type="text" value={userForm.email} name="email" required
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
                  type="text" value={userForm.username} name="username" required
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="cols-span-1">
                <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="password"
                  type="password" value={userForm.password} name="password" required
                  onChange={(e) => handleChange(e)} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <div className="text-base text-title-2 font-semibold py-3 text-center">Profile Image</div>
          <div className="flex justify-center items-center">
            <label className="w-[120px] h-[120px] mx-auto border border-dashed border-dashed-color rounded-lg flex justify-center items-center cursor-pointer"
              htmlFor="profileImage">
              {fileInfo.isPreviewVisible ?
                <img src={fileInfo.imageSrc} alt="profile image" className="w-full h-full" />
                :
                <div className="text-gray text-sm uppercase w-1/3 flex justify-center items-center text-center">Profile Image</div>
              }
            </label>
            <input type="file" id="profileImage" name="profileImage" onChange={handleFileChange} hidden accept="image/*" />
          </div>
          <div className="w-full text-center">
            <label className="text-kanban text-sm uppercase decoration-2 underline my-2 font-semibold cursor-pointer hover:text-black" htmlFor="profileImage">Update</label>
          </div>
        </div>
      </div>

      <div className="flex justify-start md:justify-center items-center mt-12 gap-5">
        {location.pathname === "/settings/user/add" &&
          <button className="bg-button-6 h-12 md:h-9 text-center rounded-[12px] text-white font-bold tracking-wider w-full md:w-[160px]
                            block rounded leading-normal shadow-md transition duration-150 ease-in-out
                            hover:bg-[#a38b7b] hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 
                            active:bg-[#978172] active:shadow-lg text-sm" type="button"
            onClick={(e) => handleSubmit(e)}>Create</button>}
        <Link to={"/settings"} className="w-full sm:w-fit">
          <button className={`${location.pathname === "/settings/user/add" ? 'bg-button-1 hover:bg-white-200 active:bg-white-100' : 'bg-button-6 hover:bg-[#a38b7b] active:bg-[#978172]'} 
                            h-12 md:h-9 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                            block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full md:w-[160px]
                            hover:bg-white-200 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                            active:bg-white-100 active:shadow-md text-sm`}>Close</button>
        </Link>
        {location.pathname.includes("/settings/user/edit") &&
          <button className="bg-button-4 h-12 md:h-9 text-center rounded-[12px] text-white font-bold tracking-wider w-full md:w-[160px]
                            block rounded leading-normal shadow-md transition duration-150 ease-in-out
                            hover:bg-neutral-700 hover:shadow-lg focus:bg-neutral-700 focus:shadow-md focus:outline-none focus:ring-0 
                            active:bg-neutral-600 active:shadow-lg text-sm" type="button"
            onClick={(e) => handleSubmit(e)}>Update</button>}
      </div>
    </div>
  )
}

export default UserForm;