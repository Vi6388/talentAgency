import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { isFormValid } from "../../utils/utils";
import { ClientApi } from "../../apis/ClientApi";

const ClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [clientForm, setClientForm] = useState({
    firstname: "",
    surname: "",
    email: "",
    phoneNumber: "",
    avatar: "",
    address: "",
    suburb: "",
    state: "",
    postcode: "",
    contact: "",
    type: ""
  });

  const [fileInfo, setFileInfo] = useState({
    filename: "",
    imageSrc: "",
    isPreviewVisible: false
  });

  useEffect(() => {
    if (id !== undefined) {
      ClientApi.getClientById(id).then((res) => {
        if (res.data.status === 200) {
          const client = res.data.data;
          setClientForm({
            firstname: client.firstname || "",
            surname: client.surname || "",
            email: client.email || "",
            phoneNumber: client.phoneNumber || "",
            avatar: client.avatar || "",
            address: client.address || "",
            suburb: client.suburb || "",
            state: client.state || "",
            postcode: client.postcode || "",
            contact: client.contact || "",
            type: client.type || ""
          });
          if (client.avatar !== "") {
            setFileInfo({
              ...fileInfo,
              isPreviewVisible: true,
              imageSrc: client.avatar
            })
          }
        }
      });
    }
  }, []);

  const handleChange = (e) => {
    setClientForm({
      ...clientForm,
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setClientForm({
      ...clientForm,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = ['firstname', 'surname', 'email'];
    const valid = isFormValid(clientForm, requiredFields);
    if(!clientForm.avatar && !fileInfo.imageSrc) {
      handleError("Please upload avatar.");
    }
    if (valid && clientForm.avatar && fileInfo.imageSrc) {
      const formData = new FormData();
      formData.append('avatar', clientForm.avatar);
      formData.append('firstname', clientForm.firstname);
      formData.append('surname', clientForm.surname);
      formData.append('email', clientForm.email);
      formData.append('phoneNumber', clientForm.phoneNumber);
      formData.append('address', clientForm.address);
      formData.append('suburb', clientForm.suburb);
      formData.append('state', clientForm.state);
      formData.append('postcode', clientForm.postcode);
      formData.append('contact', clientForm.contact);
      formData.append('type', clientForm.type);

      if (id !== undefined) {
        ClientApi.updateClientById(id, formData).then((res) => {
          try {
            if (res.data.status === 200) {
              handleSuccess(res.data.message);
              setTimeout(() => {
                navigate("/client/list");
              }, 2000);
            } else {
              handleError(res.data.message);
            }
          } catch (e) {
            handleError(e);
          }
        });
      } else {
        ClientApi.add(formData).then((res) => {
          try {
            if (res.data.status === 200) {
              handleSuccess(res.data.message);
              setTimeout(() => {
                navigate("/client/list");
              }, 2000);
            } else {
              handleError(res.data.message);
            }
          } catch (e) {
            handleError(e);
          }
        });
      }
    }
  }

  return (
    <div className="p-5 h-full bg-main">
      <ToastContainer />
      <div className="text-[36px] text-title-2 font-bold my-5 w-full text-center">Client</div>
      <div className="w-2/3 mx-auto grid grid-cols-1 md:grid-cols-3">
        <div className="col-span-1 md:col-span-2">
          <div className="">
            <div className="text-base text-title-2 font-semibold py-3">New Client</div>
            <div className="flex flex-col justify-between items-center gap-3">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="cols-span-1">
                  <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="firstname"
                    type="text" value={clientForm.firstname} name="firstname"
                    onChange={(e) => handleChange(e)} />
                </div>
                <div className="cols-span-1">
                  <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="surname"
                    type="text" value={clientForm.surname} name="surname"
                    onChange={(e) => handleChange(e)} />
                </div>
              </div>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="cols-span-1">
                  <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="email"
                    type="text" value={clientForm.email} name="email"
                    onChange={(e) => handleChange(e)} />
                </div>
                <div className="cols-span-1">
                  <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="phone Number"
                    type="text" value={clientForm.phoneNumber} name="phoneNumber"
                    onChange={(e) => handleChange(e)} />
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between items-center gap-3 my-12">
              <div className="w-full">
                <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="address"
                  type="text" value={clientForm.address} name="address"
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="cols-span-1">
                  <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="suburb"
                    type="text" value={clientForm.suburb} name="suburb"
                    onChange={(e) => handleChange(e)} />
                </div>
                <div className="cols-span-1">
                  <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="state"
                    type="text" value={clientForm.state} name="state"
                    onChange={(e) => handleChange(e)} />
                </div>
                <div className="cols-span-1">
                  <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="postcode"
                    type="text" value={clientForm.postcode} name="postcode"
                    onChange={(e) => handleChange(e)} />
                </div>
              </div>
            </div>

            <div className="w-full my-12">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="cols-span-1">
                  <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="contact"
                    type="text" value={clientForm.contact} name="contact"
                    onChange={(e) => handleChange(e)} />
                </div>
                <div className="cols-span-1">
                  <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="type"
                    type="text" value={clientForm.type} name="type"
                    onChange={(e) => handleChange(e)} />
                </div>
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
                <img src={fileInfo.imageSrc} alt="profile" className="w-full h-full" />
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
        {location.pathname === "/client/add" &&
          <button className="bg-button-6 h-12 md:h-9 text-center rounded-[12px] text-white font-bold tracking-wider w-full md:w-[160px]
                            block rounded leading-normal shadow-md transition duration-150 ease-in-out
                            hover:bg-[#a38b7b] hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 
                            active:bg-[#978172] active:shadow-lg text-sm" type="button"
            onClick={(e) => handleSubmit(e)}>Create</button>}
        <Link to={"/client/list"} className="w-full sm:w-fit">
          <button className={`${location.pathname === "/client/add" ? 'bg-button-1 hover:bg-white-200 active:bg-white-100' : 'bg-button-6 hover:bg-[#a38b7b] active:bg-[#978172]'} 
                            h-12 md:h-9 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                            block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full md:w-[160px]
                            hover:bg-white-200 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                            active:bg-white-100 active:shadow-md text-sm`}>Close</button>
        </Link>
        {location.pathname.includes("/client/edit") &&
          <button className="bg-button-4 h-12 md:h-9 text-center rounded-[12px] text-white font-bold tracking-wider w-full md:w-[160px]
                            block rounded leading-normal shadow-md transition duration-150 ease-in-out
                            hover:bg-neutral-700 hover:shadow-lg focus:bg-neutral-700 focus:shadow-md focus:outline-none focus:ring-0 
                            active:bg-neutral-600 active:shadow-lg text-sm" type="button"
            onClick={(e) => handleSubmit(e)}>Update</button>}
      </div>
    </div>
  )
}

export default ClientForm;