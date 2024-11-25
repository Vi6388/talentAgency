import { useEffect, useState } from "react";
import SearchIcon from "../../svg/search.svg";
import Datepicker from "tailwind-datepicker-react";
import CalendarIcon from "../../svg/calendar_month.svg";
import { useNavigate, useParams } from "react-router-dom";
import { CHANGE_IS_LOADING, CLEAN_JOB_ESTIMATE, SAVE_JOB_ESTIMATE, SAVE_JOB_ESTIMATE_DETAILS_FORM } from "../../redux/actionTypes";
import { toast, ToastContainer } from "react-toastify";
import { convertDueDate, dueDateFormat } from "../../utils/utils";
import { store } from "../../redux/store";
import { useSelector } from "react-redux";
import { EstimateApi } from "../../apis/EstimateApi";
import { TalentApi } from "../../apis/TalentApi";

const EstimateJobDetailsForm = () => {
  const { id } = useParams();
  const { jobEstimate } = useSelector((state) => state.job);
  const [talentList, setTalentList] = useState([]);
  const [talentSearchList, setTalentSearchList] = useState([]);
  const [showTalentList, setShowTalentList] = useState(false);
  const [jobDetailsForm, setJobDetailsForm] = useState({
    firstname: "",
    surname: "",
    email: "",
    position: "",
    phoneNumber: "",
    companyName: "",
    abn: "",
    postalAddress: "",
    suburb: "",
    state: "",
    postcode: "",
    jobName: "",
    talentName: "",
    talentEmail: "",
    manager: "",
    startDate: "",
    endDate: "",
  });
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      store.dispatch({ type: CHANGE_IS_LOADING, payload: true });
      EstimateApi.getJobEstimateById(id).then((res) => {
        if (res.data.status === 200) {
          const data = res.data.data;
          store.dispatch({ type: SAVE_JOB_ESTIMATE, payload: data });
          initialJobEstimateFormData(data);
        } else {
          toast.error(res.data.message, {
            position: "top-left",
          });
        }
        store.dispatch({ type: CHANGE_IS_LOADING, payload: false });
      });
    } else {
      initialJobEstimateFormData(jobEstimate)
    }
    getTalentList();
  }, [id]);

  const getTalentList = () => {
    TalentApi.getTalentList().then((res) => {
      if (res.data.status === 200) {
        setTalentList(res.data.data);
        setTalentSearchList(res.data.data);
      }
    })
  }

  const initialJobEstimateFormData = (data) => {
    setJobDetailsForm({
      ...data?.details,
      id: data?.details?._id,
      firstname: data?.details?.contactDetails?.firstname || (data?.details?.firstname || ""),
      surname: data?.details?.contactDetails?.surname || (data?.details?.surname || ""),
      email: data?.details?.contactDetails?.email || (data?.details?.email || ""),
      position: data?.details?.contactDetails?.position || (data?.details?.position || ""),
      phoneNumber: data?.details?.contactDetails?.phoneNumber || (data?.details?.phoneNumber || ""),
      companyName: data?.details?.companyDetails?.companyName || (data?.details?.companyName || ""),
      abn: data?.details?.companyDetails?.abn || (data?.details?.abn || ""),
      postalAddress: data?.details?.companyDetails?.postalAddress || (data?.details?.postalAddress || ""),
      suburb: data?.details?.companyDetails?.suburb || (data?.details?.suburb || ""),
      state: data?.details?.companyDetails?.state || (data?.details?.state || ""),
      postcode: data?.details?.companyDetails?.postcode || (data?.details?.postcode || ""),
      jobName: data?.details?.jobName || (data?.details?.jobName || ""),
      talentName: data?.details?.talent?.talentName || (data?.details?.talentName || ""),
      talentEmail: data?.details?.talent?.email || (data?.details?.talentEmail || ""),
      manager: data?.details?.talent?.manager || (data?.details?.manager || ""),
      startDate: id ? data?.details?.startDate : (data?.details?.startDate ? dueDateFormat(convertDueDate(data?.details?.startDate)) : dueDateFormat(new Date())),
      endDate: id ? data?.details?.endDate : (data?.details?.endDate ? dueDateFormat(convertDueDate(data?.details?.endDate)) : dueDateFormat(new Date())),
    })
  }

  const handleChange = (e) => {
    setJobDetailsForm({
      ...jobDetailsForm,
      [e.target.name]: e.target.value
    });

    if (e.target.name === "talentName") {
      if (e.target.value !== "") {
        const list = talentList?.filter((item) => (item?.firstname?.toLowerCase()?.includes(e.target.value?.toLowerCase()) ||
          item?.surname?.toLowerCase()?.includes(e.target.value?.toLowerCase()) || item?.email?.toLowerCase()?.includes(e.target.value?.toLowerCase())));
        setTalentSearchList(list);
        setShowTalentList(true);
      } else {
        setTalentSearchList(talentList);
        setShowTalentList(false);
      }
    }
  }

  const focusTalent = () => {
    setShowTalentList(!showTalentList);
  }

  const changeTalent = (item) => {
    setJobDetailsForm({
      ...jobDetailsForm,
      talentName: item.firstname + " " + item.surname,
      talentEmail: item.email,
      talent: {
        ...jobDetailsForm?.talent,
        talentName: item.firstname + " " + item.surname,
        email: item.email,
      }
    });
    setTalentSearchList(talentList);
    setShowTalentList(false);
  }

  const handleStartDateChange = (selectedDate) => {
    setJobDetailsForm({
      ...jobDetailsForm,
      startDate: dueDateFormat(new Date(selectedDate))
    })
  }

  const handleEndDateChange = (selectedDate) => {
    setJobDetailsForm({
      ...jobDetailsForm,
      endDate: dueDateFormat(new Date(selectedDate))
    })
  }

  const startDateOptions = {
    autoHide: true,
    datepickerClassNames: "",
    defaultDate: "",
    language: "en",
    inputPlaceholderProp: "START DATE",
    inputDateFormatProp: {
      day: "numeric",
      month: "numeric",
      year: "numeric"
    }
  }

  const endDateOptions = {
    autoHide: true,
    datepickerClassNames: "",
    defaultDate: "",
    language: "en",
    inputPlaceholderProp: "END DATE",
    inputDateFormatProp: {
      day: "numeric",
      month: "numeric",
      year: "numeric"
    }
  }

  const handleState = (action, state) => {
    if (action === "setShowStart") {
      setShowStart(state);
    } else {
      setShowEnd(state);
    }
  }

  const nextFunc = () => {
    store.dispatch({ type: SAVE_JOB_ESTIMATE_DETAILS_FORM, payload: jobDetailsForm });
    if (jobDetailsForm?.id) {
      navigate("/estimate/edit/" + jobDetailsForm?.id + "/invoice");
    } else {
      navigate("/estimate/add/invoice");
    }
  }

  const sendEstimate = () => {
    if (jobDetailsForm.id) {
      updateEstimate();
    } else {
      store.dispatch({ type: CHANGE_IS_LOADING, payload: true });
      EstimateApi.add(jobEstimate).then((res) => {
        if (res.data.status === 200) {
          store.dispatch({ type: SAVE_JOB_ESTIMATE_DETAILS_FORM, payload: res.data.data });
          initialJobEstimateFormData({ details: res.data.data });
          toast.success(res.data.message, {
            position: "top-left",
          });
        } else {
          toast.error(res.data.message, {
            position: "top-left",
          });
        }
        store.dispatch({ type: CHANGE_IS_LOADING, payload: false });
      })
    }
  }

  const updateEstimate = () => {
    if (jobDetailsForm.id) {
      store.dispatch({ type: CHANGE_IS_LOADING, payload: true });
      EstimateApi.updateJobEstimateById(jobDetailsForm.id, jobEstimate).then((res) => {
        if (res.data.status === 200) {
          store.dispatch({ type: SAVE_JOB_ESTIMATE_DETAILS_FORM, payload: res.data.data });
          initialJobEstimateFormData({ details: res.data.data })
          toast.success(res.data.message, {
            position: "top-left",
          });
        } else {
          toast.error(res.data.message, {
            position: "top-left",
          });
        }
        store.dispatch({ type: CHANGE_IS_LOADING, payload: false });
      });
    }
  }

  const updateAndResend = () => {
    updateEstimate();
  }

  const makeJobLive = () => {
    store.dispatch({ type: CHANGE_IS_LOADING, payload: true });
    EstimateApi.makeJobLiveById(jobEstimate?.details?._id).then((res) => {
      if (res.data.status === 200) {
        store.dispatch({ type: SAVE_JOB_ESTIMATE_DETAILS_FORM, payload: res.data.data });
        toast.success(res.data.message, {
          position: "top-left",
        });
      } else {
        toast.error(res.data.message, {
          position: "top-left",
        });
      }
      store.dispatch({ type: CHANGE_IS_LOADING, payload: false });
    })
  }

  const cancelEstimate = () => {
    store.dispatch({ type: CLEAN_JOB_ESTIMATE });
    navigate("/estimate/kanban");
  }

  return (
    <div className="mt-7 w-full bg-main pt-12">
      <ToastContainer />
      <div className="w-full text-center text-xl md:text-3xl mb-5">
        <span className="text-title-1 uppercase font-gotham-bold italic">estimate - </span>
        <span className="text-title-2 uppercase font-gotham-bold">{jobDetailsForm.jobName === "" ? '{ Job Name }' : jobDetailsForm.jobName}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 w-fit mx-4 md:w-2/3 sm:mx-auto gap-8">
        <div className="col-span-1">
          <div className="mb-3">
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-title-2 font-gotham-medium">Contact Details</span>
              <img src={SearchIcon} className="w-5 h-5" alt="search icon" />
            </div>
            <div>
              <div className="flex justify-between items-center gap-3 py-2">
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm border-none focus:border-[#d4d5d6]`}
                  placeholder="First Name"
                  type="text" value={jobDetailsForm.firstname} name="firstname"
                  onChange={(e) => handleChange(e)} />
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm border-none focus:border-[#d4d5d6]`}
                  placeholder="surname"
                  type="text" value={jobDetailsForm.surname} name="surname"
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="flex justify-center items-center py-2">
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm border-none focus:border-[#d4d5d6]`}
                  placeholder="Email Address"
                  type="text" value={jobDetailsForm.email} name="email"
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="flex justify-between items-center gap-3 py-2">
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm border-none focus:border-[#d4d5d6]`}
                  placeholder="position"
                  type="text" value={jobDetailsForm.position} name="position"
                  onChange={(e) => handleChange(e)} />
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm border-none focus:border-[#d4d5d6]`}
                  placeholder="phone Number"
                  type="text" value={jobDetailsForm.phoneNumber} name="phoneNumber"
                  onChange={(e) => handleChange(e)} />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-title-2 font-gotham-medium">Company Details</span>
              <img src={SearchIcon} className="w-5 h-5" alt="search icon" />
            </div>
            <div>
              <div className="flex justify-between items-center gap-3 py-2">
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm border-none focus:border-[#d4d5d6]`}
                  placeholder="Company Name"
                  type="text" value={jobDetailsForm.companyName} name="companyName"
                  onChange={(e) => handleChange(e)} />
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none`}
                  placeholder="abn"
                  type="text" value={jobDetailsForm.abn} name="abn"
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="flex justify-center items-center py-2">
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm border-none focus:border-[#d4d5d6]`}
                  placeholder="Postal Address"
                  type="text" value={jobDetailsForm.postalAddress} name="postalAddress"
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="flex justify-between items-center gap-3 py-2">
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none`}
                  placeholder="suburb"
                  type="text" value={jobDetailsForm.suburb} name="suburb"
                  onChange={(e) => handleChange(e)} />
                <div className="flex items-center justify-between gap-3 w-full">
                  <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none`}
                    placeholder="State"
                    type="text" value={jobDetailsForm.state} name="state"
                    onChange={(e) => handleChange(e)} />
                  <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm border-none focus:border-[#d4d5d6]`}
                    placeholder="postcode"
                    type="text" value={jobDetailsForm.postcode} name="postcode"
                    onChange={(e) => handleChange(e)} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1 flex flex-col justify-between items-center">
          <div className="mb-3 w-full">
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-title-2 font-gotham-medium">Job Name</span>
            </div>
            <div>
              <div className="flex justify-between items-center gap-3 py-2">
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm border-none focus:border-[#d4d5d6]`}
                  placeholder="job name"
                  type="text" value={jobDetailsForm.jobName} name="jobName"
                  onChange={(e) => handleChange(e)} />
              </div>
            </div>
          </div>
          <div className="mb-3 w-full">
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-title-2 font-gotham-medium">Talent</span>
            </div>
            <div>
              <div className="flex justify-between items-center gap-3 py-2 relative">
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm border-none focus:border-[#d4d5d6]`}
                  placeholder="talent name"
                  type="text" value={jobDetailsForm.talentName} name="talentName"
                  onChange={(e) => handleChange(e)} onFocus={focusTalent} />

                <div className={`absolute top-[50px] w-full shadow-xl z-10 rounded-lg ${showTalentList ? 'block' : 'hidden'}`}>
                  <ul className="bg-white rounded-lg w-full">
                    {talentSearchList?.map((item, index) =>
                      <li key={index} className={`p-3 hover:bg-[#f1f1f1] text-input ${index < talentList?.length ? 'border-b' : ''}`} onClick={() => changeTalent(item)}>
                        {item.firstname + " " + item.surname} ({item.email})
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              <div className="flex justify-between items-center gap-3 py-2">
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none`}
                  placeholder="mananger"
                  type="text" value={jobDetailsForm.manager} name="manager"
                  onChange={(e) => handleChange(e)} />
              </div>
            </div>
          </div>

          <div className="mb-3 w-full">
            <div className="grid grid-cols-2 w-full gap-3 py-2">
              <div className="col-span-1 w-full flex justify-between items-center relative">
                <Datepicker options={startDateOptions} onChange={handleStartDateChange} show={showStart} setShow={(state) => handleState("setShowStart", state)}>
                  <div className="relative">
                    <input type="text" className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none`}
                      placeholder="Start Date" value={jobDetailsForm.startDate} onFocus={() => setShowStart(true)} readOnly />
                    <div className="absolute top-1.5 right-2">
                      <img src={CalendarIcon} alt="calendar" />
                    </div>
                  </div>
                </Datepicker>
              </div>
              <div className="col-span-1 w-full justify-between items-center relative">
                <Datepicker options={endDateOptions} onChange={handleEndDateChange} show={showEnd} setShow={(state) => handleState("setShowEnd", state)}>
                  <div className="relative">
                    <input type="text" className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none`}
                      placeholder="End Date" value={jobDetailsForm.endDate} onFocus={() => setShowEnd(true)} readOnly />
                    <div className="absolute top-1.5 right-2">
                      <img src={CalendarIcon} alt="calendar" />
                    </div>
                  </div>
                </Datepicker>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`mt-10 md:mt-52 grid grid-cols-2 ${jobDetailsForm?.id ? 'sm:grid-cols-4' : 'sm:grid-cols-3'} w-full px-4 sm:w-2/3 lg:w-1/2 xl:w-5/12 sm:mx-auto gap-3`}>
        <div className="w-full">
          <button className="bg-button-1 h-9 md:h-10 tracking-wider text-center rounded-[12px] text-white font-gotham-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-gray-300 hover:shadow-md focus:bg-gray-400 focus:shadow-md focus:outline-none focus:ring-0 text-sm"
            type="button" onClick={cancelEstimate}>Cancel</button>
        </div>
        <div className="w-full">
          <button className="bg-button-3 h-9 md:h-10 tracking-wider text-center rounded-[12px] text-white font-gotham-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-[#9b8579] hover:shadow-md focus:bg-[#664838] focus:shadow-md focus:outline-none focus:ring-0 text-sm"
            type="button" onClick={nextFunc}>Next...</button>
        </div>
        {
          jobEstimate?.details?._id ?
            <>
              <div className="w-full">
                <button className="bg-button-4 h-9 md:h-10 tracking-wider text-center rounded-[12px] text-white font-gotham-bold
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-slate-700 hover:shadow-md focus:bg-slate-800 focus:shadow-md focus:outline-none focus:ring-0 text-sm"
                  type="button" onClick={updateAndResend}>Update and ReSend</button>
              </div>
              <div className="w-full">
                <button className="bg-button-5 h-9 md:h-10 tracking-wider text-center rounded-[12px] text-white font-gotham-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-[#b57687] hover:shadow-md focus:bg-[#7c4050] focus:shadow-md focus:outline-none focus:ring-0 text-sm"
                  type="button" onClick={makeJobLive}>Make job live</button>
              </div>
            </> :
            <div className="w-full">
              <button className="bg-button-4 h-9 md:h-10 tracking-wider text-center rounded-[12px] text-white font-gotham-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-slate-700 hover:shadow-md focus:bg-slate-800 focus:shadow-md focus:outline-none focus:ring-0 text-sm"
                type="button" onClick={sendEstimate}>Send Estimate</button>
            </div>
        }
      </div>

    </div>
  )
};

export default EstimateJobDetailsForm;