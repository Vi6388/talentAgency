import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddCircle from "../../svg/add_circle.svg"
import DatePicker from "tailwind-datepicker-react";
import CalendarIcon from "../../svg/calendar_month.svg";
import CancelIcon from "../../svg/cancel.svg";
import { useSelector } from "react-redux";
import { JobApi } from "../../apis/job";
import { store } from "../../redux/store";
import { toast, ToastContainer } from "react-toastify";
import { CLEAN_JOB, SAVE_JOB_DETAILS_FORM, SAVE_JOB_JOB_SUMMARY_LIST } from "../../redux/actionTypes";
import { dateFormat, dateTimeFormat, jobFormValidateForm } from "../../utils/utils";

const JobMediaForm = () => {
  const navigate = useNavigate();
  const { job } = useSelector(state => state.job);
  const [mediaForm, setMediaForm] = useState({
    jobTitle: "",
    startDate: "",
    endDate: "",
    type: "podcast",
    numberOfEpisodes: "",
    keyMessages: "",
    deleverables: "",
    createdAt: new Date().toLocaleDateString("en-US"),
  });

  const [mediaList, setMediaList] = useState([]);
  const [errors, setErrors] = useState({});

  const [show, setShow] = useState({
    startDate: false,
    endDate: false,
    eventEndTime: false
  })

  useEffect(() => {
    setMediaList(job?.jobSummaryList);
  }, [job]);

  const handleChange = (e) => {
    setMediaForm({
      ...mediaForm,
      [e.target.name]: e.target.value
    });
  }

  const handleDateChange = (action, selectedDate) => {
    setMediaForm({
      ...mediaForm,
      [action]: selectedDate.toLocaleDateString("en-US")
    })
  }

  const handleState = (action, state) => {
    setShow({
      ...show,
      [action]: state,
    })
  }

  const handleCheckboxChange = (e) => {
    let type = e.target.checked ? e.target.name : "";
    setMediaForm({
      ...mediaForm,
      type: type
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

  const addJobMedia = () => {
    const newErrors = jobFormValidateForm(mediaForm);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      let list = mediaList;
      const data = {
        ...mediaForm,
        startDate: dateTimeFormat(mediaForm.startDate),
        endDate: dateTimeFormat(mediaForm.endDate)
      }
      list.push(data);
      setMediaList(list);
      setMediaForm({
        jobTitle: "",
        startDate: "",
        endDate: "",
        type: "podcast",
        numberOfEpisodes: "",
        keyMessages: "",
        deleverables: "",
        createdAt: new Date().toLocaleDateString("en-US"),
      });
    } else {
      toast.error("Form submission failed due to validation errors.", {
        position: "top-left",
      });
    }
  }

  const cancelJobMedia = (index) => {
    const media = mediaList[index];
    if (media) {
      if (mediaList?.length > 0) {
        const list = mediaList.filter((item, i) => i !== index);
        setMediaList(list);
      } else {
        setMediaList([]);
      }
    }
  }

  const nextFunc = () => {
    store.dispatch({ type: SAVE_JOB_JOB_SUMMARY_LIST, payload: mediaList });
    if (job?.details?._id) {
      navigate("/job/edit/" + job?.details?._id + "/travel");
    } else {
      navigate("/job/add/travel");
    }
  }

  const updateJob = () => {
    let jobSummaryList = job?.jobSummaryList?.filter(item => (item.type === "podcast" || item.type === "radio" || item.type === "webSeries" || item.type === "tv"));
    mediaList?.forEach((item) => {
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
        <span className="text-title-1 uppercase font-bold italic">media - </span>
        <span className="text-title-2 uppercase font-bold">{job.jobName === "" ? '{ Job Name }' : job.jobName}</span>
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
                  type="text" value={mediaForm.jobTitle} name="jobTitle"
                  onChange={(e) => handleChange(e)} />
              </div>

              <div className="w-full grid grid-cols-1 lg:grid-cols-2 relative gap-3 py-2">
                <DatePicker options={startDateOptions} onChange={(selectedDate) => handleDateChange("startDate", selectedDate)} show={show.startDate}
                  setShow={(state) => handleState("startDate", state)}>
                  <div className="relative">
                    <input type="text" className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase
                        ${errors.startDate ? 'border-[#ff0000] focus:ring-none' : 'border-none'}`}
                      placeholder="START Date" value={mediaForm.startDate} onFocus={() => setShow({ ...show, startDate: true })} readOnly />
                    <div className="absolute top-1.5 right-2">
                      <img src={CalendarIcon} alt="calendar" />
                    </div>
                  </div>
                </DatePicker>

                <DatePicker options={endDateOptions} onChange={(selectedDate) => handleDateChange("endDate", selectedDate)} show={show.endDate}
                  setShow={(state) => handleState("endDate", state)}>
                  <div className="relative">
                    <input type="text" className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase
                        ${errors.endDate ? 'border-[#ff0000] focus:ring-none' : 'border-none'}`}
                      placeholder="END Date" value={mediaForm.endDate} onFocus={() => setShow({ ...show, endDate: true })} readOnly />
                    <div className="absolute top-1.5 right-2">
                      <img src={CalendarIcon} alt="calendar" />
                    </div>
                  </div>
                </DatePicker>
              </div>

              <div className="w-full grid grid-cols-1 xl:grid-cols-3 gap-3 py-2">
                <div className="w-full col-span-2 flex flex-wrap xl:flex-nowrap justify-between items-center gap-2">
                  <div className="flex flex-row">
                    <div role="button" className="flex w-full items-center rounded-lg p-0 transition-all">
                      <label htmlFor="check-vertical-list-group4" className="flex w-full cursor-pointer items-center justify-end">
                        <div className="inline-flex items-center gap-2">
                          <label className="cursor-pointer text-label text-sm uppercase" htmlFor="check-vertical-list-group4">podcast</label>
                          <label className="flex items-center cursor-pointer relative" htmlFor="check-vertical-list-group4">
                            <input type="checkbox"
                              className="peer rounded-[16px] text-input shadow-md shadow-500 h-10 w-10 tracking-wider
                                          outline-none focus:border-[#d4d5d6] border-none bg-white cursor-pointer transition-all appearance-none checked:bg-white checked:border-[#d4d5d6]"
                              id="check-vertical-list-group4" checked={mediaForm.type === "podcast"} onChange={(e) => handleCheckboxChange(e)} name="podcast" />
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
                  </div>
                  <div className="flex flex-row">
                    <div role="button" className="flex w-full items-center rounded-lg p-0 transition-all">
                      <label htmlFor="check-vertical-list-group1" className="flex w-full cursor-pointer items-center justify-end">
                        <div className="inline-flex items-center gap-2">
                          <label className="cursor-pointer text-label text-sm uppercase" htmlFor="check-vertical-list-group1">radio</label>
                          <label className="flex items-center cursor-pointer relative" htmlFor="check-vertical-list-group1">
                            <input type="checkbox"
                              className="peer rounded-[16px] text-input shadow-md shadow-500 h-10 w-10 tracking-wider
                                          outline-none focus:border-[#d4d5d6] border-none bg-white cursor-pointer transition-all appearance-none checked:bg-white checked:border-[#d4d5d6]"
                              id="check-vertical-list-group1" checked={mediaForm.type === "radio"} onChange={(e) => handleCheckboxChange(e)} name="radio" />
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
                  </div>
                  <div className="flex flex-row">
                    <div role="button" className="flex w-full items-center rounded-lg p-0 transition-all">
                      <label htmlFor="check-vertical-list-group2" className="flex w-full cursor-pointer items-center justify-end">
                        <div className="inline-flex items-center gap-2">
                          <label className="cursor-pointer text-label text-sm uppercase" htmlFor="check-vertical-list-group2">Web Series</label>
                          <label className="flex items-center cursor-pointer relative" htmlFor="check-vertical-list-group2">
                            <input type="checkbox"
                              className="peer rounded-[16px] text-input shadow-md shadow-500 h-10 w-10 tracking-wider
                                          outline-none focus:border-[#d4d5d6] border-none bg-white cursor-pointer transition-all appearance-none checked:bg-white checked:border-[#d4d5d6]"
                              id="check-vertical-list-group2" checked={mediaForm.type === "webSeries"} onChange={(e) => handleCheckboxChange(e)} name="webSeries" />
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
                  </div>
                  <div className="flex flex-row">
                    <div role="button" className="flex w-full items-center rounded-lg p-0 transition-all">
                      <label htmlFor="check-vertical-list-group3" className="flex w-full cursor-pointer items-center justify-end">
                        <div className="inline-flex items-center gap-2">
                          <label className="cursor-pointer text-label text-sm uppercase" htmlFor="check-vertical-list-group3">tv</label>
                          <label className="flex items-center cursor-pointer relative" htmlFor="check-vertical-list-group3">
                            <input type="checkbox"
                              className="peer rounded-[16px] text-input shadow-md shadow-500 h-10 w-10 tracking-wider
                                          outline-none focus:border-[#d4d5d6] border-none bg-white cursor-pointer transition-all appearance-none checked:bg-white checked:border-[#d4d5d6]"
                              id="check-vertical-list-group3" checked={mediaForm.type === "tv"} onChange={(e) => handleCheckboxChange(e)} name="tv" />
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
                  </div>
                </div>
                <div className="w-full col-span-1">
                  <input className={`rounded-[16px] text-input shadow-md shadow-500 h-10 w-full tracking-wider text-sm text-center
                      outline-none focus:border-[#d4d5d6] placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase
                      ${errors.numberOfEpisodes ? 'border-[#ff0000] focus:ring-none' : 'border-none'}`}
                    placeholder="number Of Episodes"
                    type="text" value={mediaForm.numberOfEpisodes} name="numberOfEpisodes"
                    onChange={(e) => handleChange(e)} />
                </div>
              </div>

              <div className="w-full py-2">
                <textarea className={`rounded-[16px] text-input shadow-md shadow-500 h-full w-full tracking-wider text-sm resize-none outline-none focus:border-[#d4d5d6]
                        placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase placeholder:text-center
                        ${errors.keyMessages ? 'border-[#ff0000] focus:ring-none' : 'border-none'}`}
                  placeholder="Brief Copy Tags Key Messages"
                  type="text" value={mediaForm.keyMessages} name="keyMessages" rows={5}
                  onChange={(e) => handleChange(e)} />
              </div>

              <div className="w-full py-2">
                <textarea className={`rounded-[16px] text-input shadow-md shadow-500 h-full w-full tracking-wider text-sm resize-none outline-none focus:border-[#d4d5d6]
                        placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase placeholder:text-center
                        ${errors.deleverables ? 'border-[#ff0000] focus:ring-none' : 'border-none'}`}
                  placeholder="Deleverables"
                  type="text" value={mediaForm.deleverables} name="deleverables" rows={5}
                  onChange={(e) => handleChange(e)} />
              </div>
            </div>
            <div className="w-full flex justify-end items-center mt-10 ">
              <button className="w-fit flex gap-2 cursor-pointer hover:text-decoration" onClick={addJobMedia}>
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
              {mediaList?.length > 0 ?
                mediaList?.map((item, index) => {
                  return (
                    <div className="flex justify-between items-center border-b divider-line-color py-3"
                      key={index}>
                      <div className="flex items-center">
                        <span className="text-label italic text-[12px] md:text-[15px] font-semibold uppercase mr-2">
                          {item.type} -
                        </span>
                        <span className="text-summary-item text-[12px] md:text-[15px] font-semibold">{item.jobTitle}</span>
                      </div>
                      <div className="flex items-center gap-5">
                        <span className="text-summary-item text-[12px] md:text-[15px] font-semibold">DUE: {dateFormat(item.createdAt)}</span>
                        <button onClick={() => cancelJobMedia(index)}>
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

      <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 w-full px-4 sm:w-2/3 lg:w-1/2 xl:w-1/3 sm:mx-auto gap-3">
        <div className="w-full">
          <button className="bg-button-1 h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-white-100 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm"
            type="button" onClick={cancelJob}>Cancel</button>
        </div>
        <Link to={job?.details?._id ? `/job/edit/${job?.details?._id}/event` : "/job/add/event"} className="w-full">
          <button className="bg-button-2 h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-white-100 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm">Previous</button>
        </Link>
        <div className="w-full">
          <button className="bg-button-3 h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-white-100 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm"
            type="button" onClick={nextFunc}>Next...</button>
        </div>
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

export default JobMediaForm;