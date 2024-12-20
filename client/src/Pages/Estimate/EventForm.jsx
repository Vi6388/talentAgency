import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AddCircle from "../../svg/add_circle.svg"
import DatePicker from "tailwind-datepicker-react";
import CalendarIcon from "../../svg/calendar_month.svg";
import ScheduleIcon from "../../svg/schedule.svg";
import CancelIcon from "../../svg/cancel.svg";
import { CHANGE_IS_LOADING, CLEAN_JOB_ESTIMATE, SAVE_JOB_ESTIMATE, SAVE_JOB_ESTIMATE_DETAILS_FORM, SAVE_JOB_ESTIMATE_JOB_SUMMARY_LIST } from "../../redux/actionTypes";
import { useSelector } from "react-redux";
import { convertDueDate, dueDateFormat } from "../../utils/utils";
import { toast, ToastContainer } from "react-toastify";
import { store } from "../../redux/store";
import { EstimateApi } from "../../apis/EstimateApi";

const EstimateEventForm = () => {
  const { id } = useParams();
  const [eventForm, setEventForm] = useState({
    jobTitle: "",
    eventDate: "",
    eventStartTime: "",
    eventEndTime: "",
    keyMessages: "",
    deleverables: "",
    createdAt: new Date().toLocaleDateString("en-US"),
  });

  const [eventList, setEventList] = useState([]);

  const [inputType, setInputType] = useState({
    startTime: 'text',
    endTime: 'text'
  });

  const [show, setShow] = useState({
    eventDate: false,
    eventStartTime: false,
    eventEndTime: false
  });

  const dateRef = useRef(null);

  const navigate = useNavigate();
  const { jobEstimate } = useSelector(state => state.job);

  useEffect(() => {
    if (!jobEstimate?.details?._id) {
      if (id) {
        store.dispatch({ type: CHANGE_IS_LOADING, payload: true });
        EstimateApi.getJobEstimateById(id).then((res) => {
          if (res.data.status === 200) {
            const data = res.data.data;
            store.dispatch({ type: SAVE_JOB_ESTIMATE, payload: data });
          }
          store.dispatch({ type: CHANGE_IS_LOADING, payload: false });
        });
      } else {
        setEventList(jobEstimate?.jobSummaryList);
      }
    } else {
      setEventList(jobEstimate?.jobSummaryList);
    }
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        handleState("eventDate", false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    setEventForm({
      ...eventForm,
      [e.target.name]: e.target.value
    });
  }

  const handleDateChange = (action, selectedDate) => {
    setEventForm({
      ...eventForm,
      [action]: dueDateFormat(new Date(selectedDate))
    })
  }

  const handleState = (field, state) => {
    setShow((prev) => ({ ...prev, [field]: state }));
  };

  const conceptDateOptions = {
    autoHide: true,
    datepickerClassNames: "",
    defaultDate: "",
    language: "en",
    inputPlaceholderProp: "EVENT DATE",
    inputDateFormatProp: {
      day: "numeric",
      month: "numeric",
      year: "numeric"
    }
  }

  const addJobEvent = () => {
    if (eventForm?.jobTitle !== "" || eventForm?.jobTitle.trim() !== "") {
      let list = eventList;
      const data = {
        ...eventForm,
        eventDate: eventForm.eventDate,
        eventStartTime: eventForm.eventStartTime,
        eventEndTime: eventForm.eventEndTime,
        type: "event"
      }
      list.push(data);
      setEventList(list);
      setEventForm({
        jobTitle: "",
        eventDate: "",
        eventStartTime: "",
        eventEndTime: "",
        keyMessages: "",
        deleverables: "",
        createdAt: new Date().toLocaleDateString("en-US"),
      });
    }
  }

  const cancelJobEvent = (index) => {
    const event = eventList[index];
    let list = [];
    if (event) {
      if (eventList?.length > 0) {
        list = eventList.filter((item, i) => i !== index);
        setEventList(list);
      } else {
        setEventList([]);
      }
    }
    store.dispatch({ type: SAVE_JOB_ESTIMATE_JOB_SUMMARY_LIST, payload: list });
  }

  const nextFunc = () => {
    store.dispatch({ type: SAVE_JOB_ESTIMATE_JOB_SUMMARY_LIST, payload: eventList });
    if (jobEstimate?.details?._id) {
      navigate("/estimate/edit/" + jobEstimate?.details?._id + "/media");
    } else {
      navigate("/estimate/add/media");
    }
  }

  const sendEstimate = () => {
    if (jobEstimate?.details?._id) {
      updateEstimate();
    } else {
      store.dispatch({ type: CHANGE_IS_LOADING, payload: true });
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
        store.dispatch({ type: CHANGE_IS_LOADING, payload: false });
      })
    }
  }

  const updateEstimate = () => {
    const data = {
      ...jobEstimate,
      jobSummaryList: eventList
    }
    if (jobEstimate?.details?._id) {
      store.dispatch({ type: CHANGE_IS_LOADING, payload: true });
      EstimateApi.updateJobEstimateById(jobEstimate?.details?._id, data).then((res) => {
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

  const edit = (item, index) => {
    if (item?.type === "event") {
      setEventForm(item);
      const list = eventList?.filter((item, i) => i !== index);
      setEventList(list);
    }
  }

  return (
    <div className="mt-7 w-full bg-main pt-12">
      <ToastContainer />
      <div className="w-full text-center text-xl md:text-3xl mb-5">
        <span className="text-title-1 uppercase font-gotham-bold italic">estimate - </span>
        <span className="text-title-2 uppercase font-gotham-bold">{jobEstimate?.details?.jobName ? jobEstimate?.details?.jobName : `{ JOB Name }`}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 w-full px-4 md:w-2/3 sm:mx-auto gap-8">
        <div className="col-span-1">
          <div className="flex flex-col justify-between">
            <div className="flex justify-between items-center pt-2">
              <span className="text-base text-title-2 font-gotham-medium">Deliverable details</span>
            </div>
            <div>
              <div className="w-full py-2">
                <input className={`rounded-[16px] text-input shadow-md shadow-500 h-10 w-full tracking-wider text-sm text-center
                      outline-none focus:border-[#d4d5d6] border-none`}
                  placeholder="job title" type="text" value={eventForm.jobTitle} name="jobTitle" onChange={(e) => handleChange(e)} />
              </div>

              <div className="w-full grid grid-cols-1 lg:grid-cols-3 relative gap-3 py-2" ref={dateRef}>
                <DatePicker options={conceptDateOptions} onChange={(selectedDate) => handleDateChange("eventDate", selectedDate)} show={show.eventDate}
                  setShow={(state) => handleState("eventDate", state)}>
                  <div className="relative">
                    <input type="text" className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none`}
                      placeholder="Event Date" value={eventForm.eventDate} onFocus={() => setShow({ ...show, eventDate: true })} readOnly />
                    <div className="absolute top-1.5 right-2">
                      <img src={CalendarIcon} alt="calendar" />
                    </div>
                  </div>
                </DatePicker>

                <div className="relative w-full">
                  <input type={inputType.startTime} name="eventStartTime"
                    className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm py-0 pl-0 
                        outline-none focus:border-[#d4d5d6] border-none`}
                    min="09:00" max="18:00" value={eventForm.eventStartTime} placeholder="EVENT START TIME"
                    onChange={handleChange}
                    onFocus={() => setInputType({ ...inputType, startTime: 'time' })}
                    onBlur={() => setInputType({ ...inputType, startTime: 'text' })} />
                  <div className={`absolute top-1.5 right-2 ${inputType.startTime === 'time' ? 'hidden' : 'block'}`}>
                    <img src={ScheduleIcon} alt="calendar" />
                  </div>
                </div>

                <div className="relative w-full">
                  <input type={inputType.endTime} name="eventEndTime"
                    className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm py-0 pl-0 
                        outline-none focus:border-[#d4d5d6] border-none`}
                    min="09:00" max="18:00" value={eventForm.eventEndTime} placeholder="EVENT END TIME"
                    onChange={handleChange}
                    onFocus={() => setInputType({ ...inputType, endTime: 'time' })}
                    onBlur={() => setInputType({ ...inputType, endTime: 'text' })} />
                  <div className={`absolute top-1.5 right-2 ${inputType.endTime === 'time' ? 'hidden' : 'block'}`}>
                    <img src={ScheduleIcon} alt="calendar" />
                  </div>
                </div>
              </div>

              <div className="w-full py-2">
                <textarea className={`rounded-[16px] text-input shadow-md shadow-500 h-full w-full tracking-wider text-sm resize-none outline-none focus:border-[#d4d5d6]
                       placeholder:text-center border-none`}
                  placeholder="Brief Copy&#10;Tags&#10;Key Messages" type="text" value={eventForm.keyMessages} name="keyMessages" rows={5} onChange={(e) => handleChange(e)} />
              </div>

              <div className="w-full py-2">
                <textarea className={`rounded-[16px] text-input shadow-md shadow-500 h-full w-full tracking-wider text-sm resize-none outline-none focus:border-[#d4d5d6]
                       placeholder:text-center border-none`}
                  placeholder="Deleverables" type="text" value={eventForm.deleverables} name="deleverables" rows={5} onChange={(e) => handleChange(e)} />
              </div>
            </div>

            <div className="w-full flex justify-end items-center mt-10 ">
              <button className="w-fit flex gap-2 cursor-pointer hover:text-decoration" onClick={addJobEvent}>
                <span className="text-estimateDate text-sm font-semibold">Add to job list</span>
                <img src={AddCircle} alt="add" />
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <div className="flex flex-col justify-between items-center h-full w-full">
            <div className="w-full pt-2">
              <span className="text-base text-title-2 font-gotham-medium">Job Summary</span>
            </div>
            <div className="rounded-[16px] shadow-md shadow-500 h-full min-h-[160px] w-full tracking-wider text-md bg-white px-5 py-2">
              {eventList?.length > 0 ?
                eventList?.map((item, index) => {
                  return (
                    <div className="flex justify-between items-center border-b divider-line-color py-1 md:py-3"
                      key={index}>
                      <div className="flex items-center overflow-hidden">
                        <span className="text-label italic text-[12px] md:text-[15px] font-semibold uppercase mr-2">{item.type} - </span>
                        <span className="text-summary-item text-[12px] md:text-[15px] font-semibold">{item.jobTitle}</span>
                      </div>
                      <div className="flex items-center gap-5">
                        <span className="text-summary-item text-[12px] md:text-[15px] font-semibold">DUE: {dueDateFormat(item.createdAt)}</span>
                        <button className="text-white bg-black rounded-xl px-4" onClick={() => edit(item, index)}>Edit</button>
                        <button onClick={() => cancelJobEvent(index)}>
                          <img src={CancelIcon} alt="cancel icon" className="w-5 h-5" />
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

      <div className={`mt-12 grid grid-cols-2 sm:grid-cols-3 ${jobEstimate?.details?._id ? 'md:grid-cols-5' : 'md:grid-cols-4'} w-full px-4 sm:w-2/3 lg:w-1/2 sm:mx-auto gap-3`}>
        <div className="w-full">
          <button className="bg-button-1 h-10 tracking-wider text-center rounded-[12px] text-white font-gotham-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-gray-300 hover:shadow-md focus:bg-gray-400 focus:shadow-md focus:outline-none focus:ring-0 text-sm"
            type="button" onClick={cancelEstimate}>Cancel</button>
        </div>
        <Link to={jobEstimate?.details?._id ? `/estimate/edit/${jobEstimate?.details?._id}/social` : "/estimate/add/social"} className="w-full">
          <button className="bg-button-2 h-10 tracking-wider text-center rounded-[12px] text-white font-gotham-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-[#afa098] hover:shadow-md focus:bg-[#6a5b53] focus:shadow-md focus:outline-none focus:ring-0 text-sm">Previous</button>
        </Link>
        <div className="w-full">
          <button className="bg-button-3 h-10 tracking-wider text-center rounded-[12px] text-white font-gotham-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-[#9b8579] hover:shadow-md focus:bg-[#664838] focus:shadow-md focus:outline-none focus:ring-0 text-sm"
            type="button" onClick={nextFunc}>Next...</button>
        </div>
        {
          jobEstimate?.details?._id ?
            <>
              <div className="w-full">
                <button className="bg-button-4 h-10 tracking-wider text-center rounded-[12px] text-white font-gotham-bold
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-slate-700 hover:shadow-md focus:bg-slate-800 focus:shadow-md focus:outline-none focus:ring-0 text-sm"
                  type="button" onClick={updateAndResend}>Update and ReSend</button>
              </div>
              <div className="w-full">
                <button className="bg-button-5 h-10 tracking-wider text-center rounded-[12px] text-white font-gotham-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-[#b57687] hover:shadow-md focus:bg-[#7c4050] focus:shadow-md focus:outline-none focus:ring-0 text-sm"
                  type="button" onClick={makeJobLive}>Make job live</button>
              </div>
            </> :
            <div className="w-full">
              <button className="bg-button-4 h-10 tracking-wider text-center rounded-[12px] text-white font-gotham-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-slate-700 hover:shadow-md focus:bg-slate-800 focus:shadow-md focus:outline-none focus:ring-0 text-sm"
                type="button" onClick={sendEstimate}>Send Estimate</button>
            </div>
        }
      </div>

    </div>
  )
};

export default EstimateEventForm;