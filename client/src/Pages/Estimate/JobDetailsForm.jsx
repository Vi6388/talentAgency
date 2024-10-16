import { useEffect, useState } from "react";
import SearchIcon from "../../svg/search.svg";
import Datepicker from "tailwind-datepicker-react";
import CalendarIcon from "../../svg/calendar_month.svg";
import { useNavigate, useParams } from "react-router-dom";
import { CLEAN_JOB_ESTIMATE, SAVE_JOB_ESTIMATE, SAVE_JOB_ESTIMATE_DETAILS_FORM } from "../../redux/actionTypes";
import { toast, ToastContainer } from "react-toastify";
import { jobFormValidateForm } from "../../utils/utils";
import { store } from "../../redux/store";
import { useSelector } from "react-redux";
import { EstimateApi } from "../../apis/EstimateApi";

const EstimateJobDetailsForm = () => {
  const { id } = useParams();
  const { jobEstimate } = useSelector((state) => state.job);
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
    manager: "",
    startDate: "",
    endDate: "",
  });
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      EstimateApi.getJobEstimateById(id).then((res) => {
        if (res.data.status === 200) {
          const data = res.data.data;
          store.dispatch({ type: SAVE_JOB_ESTIMATE, payload: data });
          console.log(data)
          setJobDetailsForm({
            ...data?.details,
            id: data?.details?._id,
            firstname: data?.details?.contactDetails?.firstname || "",
            surname: data?.details?.contactDetails?.surname || "",
            email: data?.details?.contactDetails?.email || "",
            position: data?.details?.contactDetails?.position || "",
            phoneNumber: data?.details?.contactDetails?.phoneNumber || "",
            companyName: data?.details?.companyDetails?.companyName || "",
            abn: data?.details?.companyDetails?.abn || "",
            postalAddress: data?.details?.companyDetails?.postalAddress || "",
            suburb: data?.details?.companyDetails?.suburb || "",
            state: data?.details?.companyDetails?.state || "",
            postcode: data?.details?.companyDetails?.postcode || "",
            jobName: data?.details?.jobName || "",
            talentName: data?.details?.talent?.talentName || "",
            manager: data?.details?.talent?.manager || "",
            startDate: data?.details?.startDate || "",
            endDate: data?.details?.endDate || "",
          })
        }
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setJobDetailsForm({
      ...jobDetailsForm,
      [e.target.name]: e.target.value
    });
  }

  const handleStartDateChange = (selectedDate) => {
    setJobDetailsForm({
      ...jobDetailsForm,
      startDate: new Date(selectedDate).toLocaleDateString("en-US")
    })
  }

  const handleEndDateChange = (selectedDate) => {
    setJobDetailsForm({
      ...jobDetailsForm,
      endDate: new Date(selectedDate).toLocaleDateString("en-US")
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
    const newErrors = jobFormValidateForm(jobDetailsForm);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      store.dispatch({ type: SAVE_JOB_ESTIMATE_DETAILS_FORM, payload: jobDetailsForm });
      if (jobDetailsForm?.id) {
        navigate("/estimate/edit/" + jobDetailsForm?.id + "/invoice");
      } else {
        navigate("/estimate/add/invoice");
      }
    } else {
      toast.error("Form submission failed due to validation errors.", {
        position: "top-left",
      });
    }
  }

  const sendEstimate = () => {
    if (jobDetailsForm.id) {
      updateEstimate();
    } else {
      EstimateApi.add(jobEstimate).then((res) => {
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
      })
    }
  }

  const updateEstimate = () => {
    if (jobDetailsForm.id) {
      EstimateApi.updateJobEstimateById(jobDetailsForm.id, jobDetailsForm).then((res) => {
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
      });
    }
  }

  const updateAndResend = () => {
    updateEstimate();
  }

  const makeJobLive = () => {
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
    })
  }

  const cancelEstimate = () => {
    store.dispatch({ type: CLEAN_JOB_ESTIMATE });
    navigate("/estimate/kanban");
  }

  return (
    <div className="mt-7 w-full bg-main">
      <ToastContainer />
      <div className="w-full text-center text-xl md:text-3xl mb-5">
        <span className="text-title-1 uppercase font-bold italic">estimate - </span>
        <span className="text-title-2 uppercase font-bold">{jobDetailsForm.jobName === "" ? '{ Job Name }' : jobDetailsForm.jobName}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 w-fit mx-4 md:w-2/3 sm:mx-auto gap-8">
        <div className="col-span-1">
          <div className="mb-3">
            <div className="flex justify-between items-center pt-2">
              <span className="text-base text-title-2 font-medium">Contact Details</span>
              <img src={SearchIcon} className="w-4 h-4" alt="search icon" />
            </div>
            <div>
              <div className="flex justify-between items-center gap-3 py-2">
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm placeholder:text-[#d4d5d6] 
                                    placeholder:font-bold placeholder:uppercase ${errors.firstname ? 'border-[#ff0000] focus:ring-none' : 'border-none'} focus:border-[#d4d5d6]`}
                  placeholder="First Name"
                  type="text" value={jobDetailsForm.firstname} name="firstname"
                  onChange={(e) => handleChange(e)} />
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm placeholder:text-[#d4d5d6] 
                                    placeholder:font-bold placeholder:uppercase ${errors.surname ? 'border-[#ff0000] focus:ring-none' : 'border-none'} focus:border-[#d4d5d6]`}
                  placeholder="surname"
                  type="text" value={jobDetailsForm.surname} name="surname"
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="flex justify-center items-center py-2">
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm placeholder:text-[#d4d5d6] 
                                    placeholder:font-bold placeholder:uppercase ${errors.email ? 'border-[#ff0000] focus:ring-none' : 'border-none'} focus:border-[#d4d5d6]`}
                  placeholder="Email Address"
                  type="text" value={jobDetailsForm.email} name="email"
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="flex justify-between items-center gap-3 py-2">
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm placeholder:text-[#d4d5d6] 
                                    placeholder:font-bold placeholder:uppercase ${errors.phoneNumber ? 'border-[#ff0000] focus:ring-none' : 'border-none'} focus:border-[#d4d5d6]`}
                  placeholder="position"
                  type="text" value={jobDetailsForm.position} name="position"
                  onChange={(e) => handleChange(e)} />
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm placeholder:text-[#d4d5d6] 
                                    placeholder:font-bold placeholder:uppercase ${errors.phoneNumber ? 'border-[#ff0000] focus:ring-none' : 'border-none'} focus:border-[#d4d5d6]`}
                  placeholder="phone Number"
                  type="text" value={jobDetailsForm.phoneNumber} name="phoneNumber"
                  onChange={(e) => handleChange(e)} />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex justify-between items-center pt-2">
              <span className="text-base text-title-2 font-medium">Company Details</span>
              <img src={SearchIcon} className="w-4 h-4" alt="search icon" />
            </div>
            <div>
              <div className="flex justify-between items-center gap-3 py-2">
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm placeholder:text-[#d4d5d6] 
                                    placeholder:font-bold placeholder:uppercase ${errors.companyName ? 'border-[#ff0000] focus:ring-none' : 'border-none'} focus:border-[#d4d5d6]`}
                  placeholder="Company Name"
                  type="text" value={jobDetailsForm.companyName} name="companyName"
                  onChange={(e) => handleChange(e)} />
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase
                        ${errors.abn ? 'border-[#ff0000] focus:ring-none' : 'border-none'}`}
                  placeholder="abn"
                  type="text" value={jobDetailsForm.abn} name="abn"
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="flex justify-center items-center py-2">
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm placeholder:text-[#d4d5d6] 
                                    placeholder:font-bold placeholder:uppercase ${errors.postalAddress ? 'border-[#ff0000] focus:ring-none' : 'border-none'} focus:border-[#d4d5d6]`}
                  placeholder="Postal Address"
                  type="text" value={jobDetailsForm.postalAddress} name="postalAddress"
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="flex justify-between items-center gap-3 py-2">
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase
                        ${errors.suburb ? 'border-[#ff0000] focus:ring-none' : 'border-none'}`}
                  placeholder="suburb"
                  type="text" value={jobDetailsForm.suburb} name="suburb"
                  onChange={(e) => handleChange(e)} />
                <div className="flex items-center justify-between gap-3 w-full">
                  <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase
                        ${errors.state ? 'border-[#ff0000] focus:ring-none' : 'border-none'}`}
                    placeholder="State"
                    type="text" value={jobDetailsForm.state} name="state"
                    onChange={(e) => handleChange(e)} />
                  <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm placeholder:text-[#d4d5d6] 
                                    placeholder:font-bold placeholder:uppercase ${errors.postcode ? 'border-[#ff0000] focus:ring-none' : 'border-none'} focus:border-[#d4d5d6]`}
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
              <span className="text-base text-title-2 font-medium">Job Name</span>
            </div>
            <div>
              <div className="flex justify-between items-center gap-3 py-2">
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm placeholder:text-[#d4d5d6] 
                                    placeholder:font-bold placeholder:uppercase ${errors.jobName ? 'border-[#ff0000] focus:ring-none' : 'border-none'} focus:border-[#d4d5d6]`}
                  placeholder="job name"
                  type="text" value={jobDetailsForm.jobName} name="jobName"
                  onChange={(e) => handleChange(e)} />
              </div>
            </div>
          </div>
          <div className="mb-3 w-full">
            <div className="flex justify-between items-center pt-2">
              <span className="text-base text-title-2 font-medium">Talent</span>
            </div>
            <div>
              <div className="flex justify-between items-center gap-3 py-2">
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm placeholder:text-[#d4d5d6] 
                                    placeholder:font-bold placeholder:uppercase ${errors.talentName ? 'border-[#ff0000] focus:ring-none' : 'border-none'} focus:border-[#d4d5d6]`}
                  placeholder="talent name"
                  type="text" value={jobDetailsForm.talentName} name="talentName"
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="flex justify-between items-center gap-3 py-2">
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase
                        ${errors.manager ? 'border-[#ff0000] focus:ring-none' : 'border-none'}`}
                  placeholder="mananger"
                  type="text" value={jobDetailsForm.manager} name="manager"
                  onChange={(e) => handleChange(e)} />
              </div>
            </div>
          </div>

          <div className="mb-3 w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 w-full gap-3">
              <div className="col-span-2 sm:col-span-1 md:col-span-2 w-full flex jutify-between items-center gap-3">
                <button className="bg-button-2 w-full px-2 h-10 tracking-wider text-center rounded-[12px] text-white font-bold 
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out 
                        hover:bg-white-100 hover:shadow-md focus:bg-primary-700 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm">New</button>
                <button className="bg-button-2 w-full px-2 h-10 tracking-wider text-center rounded-[12px] text-white font-bold 
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out 
                        hover:bg-white-100 hover:shadow-md focus:bg-primary-700 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm">Existing</button>
              </div>
              <div className="col-span-1 w-full flex justify-between items-center relative">
                <Datepicker options={startDateOptions} onChange={handleStartDateChange} show={showStart} setShow={(state) => handleState("setShowStart", state)}>
                  <div className="relative">
                    <input type="text" className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase
                        ${errors.startDate ? 'border-[#ff0000] focus:ring-none' : 'border-none'}`}
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
                        outline-none focus:border-[#d4d5d6] placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase
                        ${errors.endDate ? 'border-[#ff0000] focus:ring-none' : 'border-none'}`}
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

      <div className={`mt-10 md:mt-52 grid grid-cols-2 sm:grid-cols-3 ${jobDetailsForm?.id ? 'md:grid-cols-4' : 'md:grid-cols-3'} w-full px-4 sm:w-2/3 lg:w-1/2 xl:w-5/12 sm:mx-auto gap-3`}>
        <div className="w-full">
          <button className="bg-button-1 h-9 md:h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-white-200 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm"
            type="button" onClick={cancelEstimate}>Cancel</button>
        </div>
        <div className="w-full">
          <button className="bg-button-3 h-9 md:h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-white-100 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm"
            type="button" onClick={nextFunc}>Next...</button>
        </div>
        {
          jobEstimate?.details?._id ?
            <>
              <div className="w-full">
                <button className="bg-button-4 h-9 md:h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-white-100 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm"
                  type="button" onClick={updateAndResend}>Update and ReSend</button>
              </div>
              <div className="w-full">
                <button className="bg-button-5 h-9 md:h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-white-100 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm"
                  type="button" onClick={makeJobLive}>Make job live</button>
              </div>
            </> :
            <div className="w-full">
              <button className="bg-button-4 h-9 md:h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-white-100 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm"
                type="button" onClick={sendEstimate}>Send Estimate</button>
            </div>
        }
      </div>

    </div>
  )
};

export default EstimateJobDetailsForm;