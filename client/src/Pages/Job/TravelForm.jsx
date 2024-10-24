import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddCircle from "../../svg/add_circle.svg"
import DatePicker from "tailwind-datepicker-react";
import CalendarIcon from "../../svg/calendar_month.svg";
import ScheduleIcon from "../../svg/schedule.svg";
import FlightIcon from "../../svg/flight.svg";
import CancelIcon from "../../svg/cancel.svg";
import { useSelector } from "react-redux";
import { dateFormat, jobFormValidateForm } from "../../utils/utils";
import { JobApi } from "../../apis/job";
import { store } from "../../redux/store";
import { toast, ToastContainer } from "react-toastify";
import { CLEAN_JOB, SAVE_JOB_DETAILS_FORM } from "../../redux/actionTypes";

const JobTravelForm = () => {
  const navigate = useNavigate();
  const { job } = useSelector((state) => state.job);
  const [travelForm, setTravelForm] = useState({
    jobTitle: "",
    departureDate: "",
    departureTime: "",
    arrivalDate: "",
    arrivalTime: "",
    preferredCarrier: "",
    frequentFlyerNumber: "",
    clientPaying: "",
    carHireRequired: "",
    travelDetails: "",
  });

  const [travelList, setTravelList] = useState([]);
  const [errors, setErrors] = useState({});

  const [show, setShow] = useState({
    departureDate: false,
    arrivalDate: false,
  });

  const [inputType, setInputType] = useState({
    departureTime: 'text',
    arrivalTime: 'text'
  });

  useEffect(() => {
    setTravelList(job?.jobSummaryList);
  }, [job]);

  const handleChange = (e) => {
    setTravelForm({
      ...travelForm,
      [e.target.name]: e.target.value
    });
  }

  const handleDateChange = (action, selectedDate) => {
    setTravelForm({
      ...travelForm,
      [action]: selectedDate.toLocaleDateString("en-US")
    })
  }

  const handleState = (action, state) => {
    setShow({
      ...show,
      [action]: state,
    })
  }

  const departureDateOption = {
    autoHide: true,
    datepickerClassNames: "",
    defaultDate: "",
    language: "en",
    inputPlaceholderProp: "DEPARTURE DATE",
    inputDateFormatProp: {
      day: "numeric",
      month: "numeric",
      year: "numeric"
    }
  }

  const arrivalDateOptions = {
    autoHide: true,
    datepickerClassNames: "",
    defaultDate: "",
    language: "en",
    inputPlaceholderProp: "ARRIVAL DATE",
    inputDateFormatProp: {
      day: "numeric",
      month: "numeric",
      year: "numeric"
    }
  }

  const addJobTravel = () => {
    const newErrors = jobFormValidateForm(travelForm);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      let list = travelList;
      const data = {
        ...travelForm,
        departureDate: dateFormat(travelForm.departureDate),
        departureTime: travelForm.departureTime,
        arrivalDate: dateFormat(travelForm.arrivalDate),
        arrivalTime: travelForm.arrivalTime,
        type: 'travel'
      }
      list.push(data);
      setTravelList(list);
      setTravelForm({
        jobTitle: "",
        departureDate: "",
        departureTime: "",
        arrivalDate: "",
        arrivalTime: "",
        preferredCarrier: "",
        frequentFlyerNumber: "",
        clientPaying: "",
        carHireRequired: "",
        travelDetails: "",
      });
    } else {
      toast.error("Form submission failed due to validation errors.", {
        position: "top-left",
      });
    }
  }

  const cancelJobTravel = (index) => {
    const travel = travelList[index];
    if (travel) {
      if (travelList?.length > 0) {
        const list = travelList.filter((item, i) => i !== index);
        setTravelList(list);
      } else {
        setTravelList([]);
      }
    }
  }

  const updateJob = () => {
    let jobSummaryList = job?.jobSummaryList?.filter(item => item.type !== "travel");
    travelList?.forEach((item) => {
      jobSummaryList.push(item);
    });
    const data = {
      ...job,
      jobSummaryList: jobSummaryList
    }
    if (job?.details?._id) {
      JobApi.updateJobById(job?.details?._id, data).then((res) => {
        if (res.data.status === 200) {
          store.dispatch({ type: SAVE_JOB_DETAILS_FORM, payload: res.data.data });
          toast.success(res.data.message, {
            position: "top-left",
          });
        } else {
          toast.error(res.data.message, {
            position: "top-left",
          });
        }
      });
    } else {
      JobApi.add(data).then((res) => {
        if (res.data.status === 200) {
          store.dispatch({ type: SAVE_JOB_DETAILS_FORM, payload: res.data.data });
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

  const cancelJob = () => {
    store.dispatch({ type: CLEAN_JOB });
    navigate("/job/kanban");
  }

  return (
    <div className="mt-7 w-full bg-main">
      <ToastContainer />
      <div className="w-full text-center text-xl md:text-3xl mb-5">
        <span className="text-title-1 uppercase font-bold italic">travel - </span>
        <span className="text-title-2 uppercase font-bold">{`{ JOB Name }`}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 w-full px-4 md:w-2/3 sm:mx-auto gap-8">
        <div className="col-span-1">
          <div className="flex flex-col justify-between">
            <div className="flex justify-between items-center pt-2">
              <span className="text-base text-title-2 font-medium">Deliverable details</span>
            </div>
            <div>
              <div className="w-full py-2">
                <input className={`rounded-[16px] text-input shadow-md shadow-500 h-10 w-full tracking-wider text-sm text-center
                      outline-none focus:border-[#d4d5d6] placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase
                      ${errors.jobTitle ? 'border-[#ff0000] focus:ring-none' : 'border-none'}`}
                  placeholder="job title"
                  type="text" value={travelForm.jobTitle} name="jobTitle"
                  onChange={(e) => handleChange(e)} />
              </div>

              <div className="w-full grid grid-cols-1 lg:grid-cols-2 relative gap-3 py-2">
                <div className="w-full grid grid-cols-3 lg:grid-cols-2 gap-2">
                  <DatePicker options={departureDateOption} onChange={(selectedDate) => handleDateChange("departureDate", selectedDate)} show={show.departureDate}
                    setShow={(state) => handleState("departureDate", state)} classNames="col-span-2 lg:col-span-1">
                    <div className="relative">
                      <input type="text" className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase
                        ${errors.departureDate ? 'border-[#ff0000] focus:ring-none' : 'border-none'}`}
                        placeholder="departure Date" value={travelForm.departureDate} onFocus={() => setShow({ ...show, departureDate: true })} readOnly />
                      <div className="absolute top-1.5 right-2">
                        <img src={CalendarIcon} alt="calendar" />
                      </div>
                    </div>
                  </DatePicker>

                  <div className="relative w-full col-span-1">
                    <input type={inputType.departureTime} name="departureTime"
                      className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm py-0 pl-0 
                        outline-none focus:border-[#d4d5d6] placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase
                        ${errors.departureTime ? 'border-[#ff0000] focus:ring-none' : 'border-none'}`}
                      min="09:00" max="18:00" value={travelForm.departureTime} placeholder="DEPARTURE TIME"
                      onChange={handleChange}
                      onFocus={() => setInputType({ ...inputType, departureTime: 'time' })}
                      onBlur={() => setInputType({ ...inputType, departureTime: 'text' })} />
                    <div className={`absolute top-1.5 right-2 ${inputType.departureTime === 'time' ? 'hidden' : 'block'}`}>
                      <img src={ScheduleIcon} alt="calendar" />
                    </div>
                  </div>
                </div>

                <div className="w-full grid grid-cols-3 lg:grid-cols-2 gap-2">
                  <DatePicker options={arrivalDateOptions} onChange={(selectedDate) => handleDateChange("arrivalDate", selectedDate)} show={show.arrivalDate}
                    setShow={(state) => handleState("arrivalDate", state)} classNames="col-span-2 lg:col-span-1">
                    <div className="relative">
                      <input type="text" className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase
                        ${errors.arrivalDate ? 'border-[#ff0000] focus:ring-none' : 'border-none'}`}
                        placeholder="arrival Date" value={travelForm.arrivalDate} onFocus={() => setShow({ ...show, arrivalDate: true })} readOnly />
                      <div className="absolute top-1.5 right-2">
                        <img src={CalendarIcon} alt="calendar" />
                      </div>
                    </div>
                  </DatePicker>

                  <div className="relative w-full col-span-1">
                    <input type={inputType.arrivalTime} name="arrivalTime"
                      className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm py-0 pl-0 
                        outline-none focus:border-[#d4d5d6] placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase
                        ${errors.arrivalTime ? 'border-[#ff0000] focus:ring-none' : 'border-none'}`}
                      min="09:00" max="18:00" value={travelForm.arrivalTime} placeholder="ARRIVAL TIME"
                      onChange={handleChange}
                      onFocus={() => setInputType({ ...inputType, arrivalTime: 'time' })}
                      onBlur={() => setInputType({ ...inputType, arrivalTime: 'text' })} />
                    <div className={`absolute top-1.5 right-2 ${inputType.arrivalTime === 'time' ? 'hidden' : 'block'}`}>
                      <img src={ScheduleIcon} alt="calendar" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3 py-2">
                <div className="relative w-full">
                  <input className={`rounded-[16px] text-input shadow-md shadow-500 h-10 w-full text-sm placeholder:text-center
                        outline-none focus:border-[#d4d5d6] placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase
                        ${errors.preferredCarrier ? 'border-[#ff0000] focus:ring-none' : 'border-none'}`}
                    type="text" value={travelForm.preferredCarrier} name="preferredCarrier" placeholder="PREFERRED CARRIER"
                    onChange={(e) => handleChange(e)} />
                  <div className="absolute top-1.5 right-2">
                    <img src={FlightIcon} alt="calendar" />
                  </div>
                </div>
                <div className="relative w-full">
                  <input className={`rounded-[16px] text-input shadow-md shadow-500 h-10 w-full text-sm placeholder:text-center
                        outline-none focus:border-[#d4d5d6] placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase
                        ${errors.frequentFlyerNumber ? 'border-[#ff0000] focus:ring-none' : 'border-none'}`}
                    type="text" value={travelForm.frequentFlyerNumber} name="frequentFlyerNumber" placeholder="FREQUENT FLYER NUMBER"
                    onChange={(e) => handleChange(e)} />
                  <div className="absolute top-1.5 right-2">
                    <img src={FlightIcon} alt="calendar" />
                  </div>
                </div>
              </div>

              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3 py-2">
                <div className="relative w-full">
                  <div className="flex flex-row">
                    <div className="w-full">
                      <label className="cursor-pointer text-label text-sm">Is client paying for travel</label>
                    </div>
                    <div role="button" className="flex w-full items-center rounded-lg p-0 transition-all">
                      <label htmlFor="check-vertical-list-group4" className="flex w-full cursor-pointer items-center justify-end">
                        <div className="inline-flex items-center gap-2">
                          <label className="cursor-pointer text-label font-semibold text-sm" htmlFor="check-vertical-list-group4">Yes</label>
                          <label className="flex items-center cursor-pointer relative" htmlFor="check-vertical-list-group4">
                            <input type="checkbox"
                              className="peer rounded-[16px] text-input shadow-md shadow-500 h-10 w-10 tracking-wider
                                          outline-none focus:border-[#d4d5d6] border-none bg-white cursor-pointer transition-all appearance-none checked:bg-white checked:border-[#d4d5d6]"
                              id="check-vertical-list-group4" />
                            <span className="absolute text-black opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20"
                                stroke="currentColor" strokeWidth="1">
                                <path
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"></path>
                              </svg>
                            </span>
                          </label>
                        </div>
                      </label>
                    </div>
                    <div role="button" className="flex w-full items-center rounded-lg p-0 transition-all">
                      <label htmlFor="check-vertical-list-group5" className="flex w-full cursor-pointer items-center justify-end">
                        <div className="inline-flex items-center gap-2">
                          <label className="cursor-pointer text-label font-semibold text-sm" htmlFor="check-vertical-list-group5">No</label>
                          <label className="flex items-center cursor-pointer relative" htmlFor="check-vertical-list-group5">
                            <input type="checkbox"
                              className="peer rounded-[16px] text-input shadow-md shadow-500 h-10 w-10 tracking-wider text-sm text-right
                                          outline-none focus:border-[#d4d5d6] border-none bg-white cursor-pointer transition-all appearance-none checked:bg-white checked:border-[#d4d5d6]"
                              id="check-vertical-list-group5" />
                            <span className="absolute text-black opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor"
                                stroke="currentColor" strokeWidth="1">
                                <path fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"></path>
                              </svg>
                            </span>
                          </label>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <input className={`rounded-[16px] text-input shadow-md shadow-500 h-10 w-full text-sm placeholder:text-center
                        outline-none focus:border-[#d4d5d6] placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase
                        ${errors.carHireRequired ? 'border-[#ff0000] focus:ring-none' : 'border-none'}`}
                    type="text" value={travelForm.carHireRequired} name="carHireRequired" placeholder="Car Hire Required"
                    onChange={(e) => handleChange(e)} />
                </div>
              </div>

              <div className="w-full py-2">
                <textarea className={`rounded-[16px] text-input shadow-md shadow-500 h-full w-full tracking-wider text-sm resize-none outline-none focus:border-[#d4d5d6]
                        placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase placeholder:text-center
                        ${errors.travelDetails ? 'border-[#ff0000] focus:ring-none' : 'border-none'}`}
                  placeholder="Transfer and any other travel details"
                  type="text" value={travelForm.travelDetails} name="travelDetails" rows={10}
                  onChange={(e) => handleChange(e)} />
              </div>
            </div>
            <div className="w-full flex justify-end items-center mt-10 ">
              <button className="w-fit flex gap-2 cursor-pointer hover:text-decoration" onClick={addJobTravel}>
                <span className="text-estimateDate text-sm font-semibold">Add to job list</span>
                <img src={AddCircle} alt="add" />
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <div className="flex flex-col justify-between items-center h-full w-full">
            <div className="w-full pt-2">
              <span className="text-base text-title-2 font-medium">Job Summary</span>
            </div>
            <div className="rounded-[16px] shadow-md shadow-500 h-full min-h-[160px] w-full tracking-wider text-md bg-white px-5 py-2">
              {travelList?.length > 0 ?
                travelList?.map((item, index) => {
                  return (
                    <div className="flex justify-between items-center border-b divider-line-color py-3"
                      key={index}>
                      <div className="flex items-center">
                        <span className="text-label italic text-[12px] md:text-[15px] font-semibold uppercase mr-2">Travel - </span>
                        <span className="text-summary-item text-[12px] md:text-[15px] font-semibold">{item.jobTitle}</span>
                      </div>
                      <div className="flex items-center gap-5">
                        <span className="text-summary-item text-[12px] md:text-[15px] font-semibold">DUE: {item.arrivalDate}</span>
                        <button onClick={() => cancelJobTravel(index)}>
                          <img src={CancelIcon} alt="cancel icon" className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  )
                })
                : <></>
              }
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 w-full px-4 sm:w-2/3 lg:w-1/2 xl:w-1/3 sm:mx-auto gap-3">
        <div className="w-full">
          <button className="bg-button-1 h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-white-100 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm"
            type="button" onClick={cancelJob}>Cancel</button>
        </div>
        <Link to={job?.details?._id ? `/job/edit/${job?.details?._id}/publish` : "/job/add/publish"} className="w-full">
          <button className="bg-button-2 h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-white-100 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm">Previous</button>
        </Link>
        <div className="w-full">
          <button className="bg-button-4 h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-white-100 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm"
            type="button" onClick={updateJob}>Update</button>
        </div>
      </div>

    </div>
  )
};

export default JobTravelForm;