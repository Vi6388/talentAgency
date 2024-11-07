import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { TalentApi } from "../../apis/TalentApi";
import { toast, ToastContainer } from "react-toastify";
import { isFormValid } from "../../utils/utils";
import { store } from "../../redux/store";
import { CHANGE_IS_LOADING } from "../../redux/actionTypes";

const TalentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [talentForm, setTalentForm] = useState({
    firstname: "",
    surname: "",
    email: "",
    phoneNumber: "",
    avatar: "",
    address: "",
    suburb: "",
    state: "",
    postcode: "",
    preferredAirline: "",
    frequentFlyerNumber: "",
    abn: "",
    publiceLiabilityInsurance: "",
    highlightColor: "#000000"
  });

  const [fileInfo, setFileInfo] = useState({
    filename: "",
    imageSrc: "",
    isPreviewVisible: false
  });

  useEffect(() => {
    if (id !== undefined) {
      store.dispatch({ type: CHANGE_IS_LOADING, payload: true });
      TalentApi.getTalentById(id).then((res) => {
        if (res.data.status === 200) {
          const talent = res.data.data;
          setTalentForm({
            firstname: talent.firstname || "",
            surname: talent.surname || "",
            email: talent.email || "",
            phoneNumber: talent.phoneNumber || "",
            avatar: talent.avatar || "",
            address: talent.address || "",
            suburb: talent.suburb || "",
            state: talent.state || "",
            postcode: talent.postcode || "",
            preferredAirline: talent.preferredAirline || "",
            frequentFlyerNumber: talent.frequentFlyerNumber || "",
            abn: talent.abn || "",
            publiceLiabilityInsurance: talent.publiceLiabilityInsurance || "",
            highlightColor: talent.highlightColor || ""
          });
          if (talent.avatar !== "") {
            setFileInfo({
              ...fileInfo,
              isPreviewVisible: true,
              imageSrc: talent.avatar
            })
          }
        }
        store.dispatch({ type: CHANGE_IS_LOADING, payload: false });
      });
    }
  }, []);

  const handleChange = (e) => {
    setTalentForm({
      ...talentForm,
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
    setTalentForm({
      ...talentForm,
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
    if (!talentForm.avatar && !fileInfo.imageSrc) {
      handleError("Please upload avatar.");
    }
    const valid = isFormValid(talentForm, requiredFields);
    if (valid && (talentForm.avatar || fileInfo.imageSrc)) {
      const formData = new FormData();
      formData.append('avatar', talentForm.avatar);
      formData.append('firstname', talentForm.firstname);
      formData.append('surname', talentForm.surname);
      formData.append('email', talentForm.email);
      formData.append('phoneNumber', talentForm.phoneNumber);
      formData.append('address', talentForm.address);
      formData.append('suburb', talentForm.suburb);
      formData.append('state', talentForm.state);
      formData.append('postcode', talentForm.postcode);
      formData.append('preferredAirline', talentForm.preferredAirline);
      formData.append('frequentFlyerNumber', talentForm.frequentFlyerNumber);
      formData.append('abn', talentForm.abn);
      formData.append('publiceLiabilityInsurance', talentForm.publiceLiabilityInsurance);
      formData.append('highlightColor', talentForm.highlightColor);

      if (id !== undefined) {
        store.dispatch({ type: CHANGE_IS_LOADING, payload: true });
        TalentApi.updateTalentById(id, formData).then((res) => {
          try {
            if (res.data.status === 200) {
              handleSuccess(res.data.message);
              setTimeout(() => {
                navigate("/settings");
              }, 2000);
            } else {
              handleError(res.data.message);
            }
            store.dispatch({ type: CHANGE_IS_LOADING, payload: false });
          } catch (e) {
            handleError(e);
          }
        });
      } else {
        store.dispatch({ type: CHANGE_IS_LOADING, payload: true });
        TalentApi.add(formData).then((res) => {
          try {
            if (res.data.status === 200) {
              handleSuccess(res.data.message);
              setTimeout(() => {
                navigate("/settings");
              }, 2000);
            } else {
              handleError(res.data.message);
            }
            store.dispatch({ type: CHANGE_IS_LOADING, payload: false });
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
      <div className="text-[36px] text-title-2 font-gotham-bold my-5 w-full text-center">Settings</div>
      <div className="w-2/3 mx-auto grid grid-cols-1 md:grid-cols-3">
        <div className="col-span-1 md:col-span-2">
          <div className="">
            <div className="text-base text-title-2 font-gotham-bold py-3">New Talent</div>
            <div className="flex flex-col justify-between items-center gap-3">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="cols-span-1">
                  <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none" placeholder="firstname"
                    type="text" value={talentForm.firstname} name="firstname"
                    onChange={(e) => handleChange(e)} />
                </div>
                <div className="cols-span-1">
                  <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none" placeholder="surname"
                    type="text" value={talentForm.surname} name="surname"
                    onChange={(e) => handleChange(e)} />
                </div>
              </div>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="cols-span-1">
                  <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none" placeholder="email"
                    type="text" value={talentForm.email} name="email"
                    onChange={(e) => handleChange(e)} />
                </div>
                <div className="cols-span-1">
                  <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none" placeholder="phone Number"
                    type="text" value={talentForm.phoneNumber} name="phoneNumber"
                    onChange={(e) => handleChange(e)} />
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between items-center gap-3 my-12">
              <div className="w-full">
                <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none" placeholder="address"
                  type="text" value={talentForm.address} name="address"
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="cols-span-1">
                  <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none" placeholder="suburb"
                    type="text" value={talentForm.suburb} name="suburb"
                    onChange={(e) => handleChange(e)} />
                </div>
                <div className="cols-span-1">
                  <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none" placeholder="state"
                    type="text" value={talentForm.state} name="state"
                    onChange={(e) => handleChange(e)} />
                </div>
                <div className="cols-span-1">
                  <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none" placeholder="postcode"
                    type="text" value={talentForm.postcode} name="postcode"
                    onChange={(e) => handleChange(e)} />
                </div>
              </div>
            </div>

            <div className="w-full my-12">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="cols-span-1">
                  <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none" placeholder="preferred Airline"
                    type="text" value={talentForm.preferredAirline} name="preferredAirline"
                    onChange={(e) => handleChange(e)} />
                </div>
                <div className="cols-span-1">
                  <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none" placeholder="frequent Flyer Number"
                    type="text" value={talentForm.frequentFlyerNumber} name="frequentFlyerNumber"
                    onChange={(e) => handleChange(e)} />
                </div>
              </div>
            </div>

            <div className="w-full my-12">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="cols-span-1">
                  <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none" placeholder="abn"
                    type="text" value={talentForm.abn} name="abn"
                    onChange={(e) => handleChange(e)} />
                </div>
                <div className="cols-span-1">
                  <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none" placeholder="publice Liability Insurance"
                    type="text" value={talentForm.publiceLiabilityInsurance} name="publiceLiabilityInsurance"
                    onChange={(e) => handleChange(e)} />
                </div>
              </div>
            </div>

            <div className="w-full my-12 relative">
              <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none"
                placeholder="Choose Highlight Color"
                type="text" value={talentForm.highlightColor} readOnly />
              <input type="color" id="color-picker" value={talentForm.highlightColor} className="absolute left-2 top-2 w-10 md:w-20"
                onChange={(e) => handleChange(e)} name="highlightColor" />
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <div className="text-base text-title-2 font-gotham-bold py-3 text-center">Profile Image</div>
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
            <label className="text-kanban text-sm uppercase decoration-2 underline my-2 font-gotham-bold cursor-pointer hover:text-black" htmlFor="profileImage">Update</label>
          </div>
        </div>
      </div>

      <div className="flex justify-start md:justify-center items-center mt-12 gap-5">
        {location.pathname === "/settings/talent/add" &&
          <button className="bg-button-6 h-12 md:h-9 text-center rounded-[12px] text-white font-gotham-bold tracking-wider w-full md:w-[160px]
                            block rounded leading-normal shadow-md transition duration-150 ease-in-out
                            hover:bg-[#a38b7b] hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 text-sm"
            type="button" onClick={(e) => handleSubmit(e)}>Create</button>}
        <Link to={"/settings"} className="w-full sm:w-fit">
          <button className={`${location.pathname === "/settings/talent/add" ? 'bg-button-1 hover:bg-gray-300 focus:bg-gray-400' : 'bg-button-6 hover:bg-[#a38b7b] focus:bg-[#978172]'} 
                            h-12 md:h-9 tracking-wider text-center rounded-[12px] text-white font-gotham-bold px-3
                            block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full md:w-[160px]
                            hover:shadow-md focus:shadow-md focus:outline-none focus:ring-0 text-sm`}>Close</button>
        </Link>
        {location.pathname.includes("/settings/talent/edit") &&
          <button className="bg-button-4 h-12 md:h-9 text-center rounded-[12px] text-white font-gotham-bold tracking-wider w-full md:w-[160px]
                            block rounded leading-normal shadow-md transition duration-150 ease-in-out
                            hover:bg-slate-700 hover:shadow-lg focus:bg-slate-800 focus:shadow-md focus:outline-none focus:ring-0 text-sm"
            type="button" onClick={(e) => handleSubmit(e)}>Update</button>}
      </div>
    </div>
  )
}

export default TalentForm;