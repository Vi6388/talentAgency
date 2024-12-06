import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AddCircle from "../../svg/add_circle.svg"
import DatePicker from "tailwind-datepicker-react";
import CalendarIcon from "../../svg/calendar_month.svg";
import CancelIcon from "../../svg/cancel.svg";
import { useSelector } from "react-redux";
import { CHANGE_IS_LOADING, CLEAN_JOB, SAVE_JOB, SAVE_JOB_DETAILS_FORM, SAVE_JOB_JOB_SUMMARY_LIST } from "../../redux/actionTypes";
import { JobApi } from "../../apis/job";
import { toast, ToastContainer } from "react-toastify";
import { store } from "../../redux/store";
import { convertDueDate, dueDateFormat } from "../../utils/utils";

const JobSocialForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [socialForm, setSocialForm] = useState({
    jobTitle: "",
    conceptDueDate: "",
    contentDueDate: "",
    liveDate: "",
    keyMessages: "",
    deleverables: "",
    createdAt: new Date().toLocaleDateString("en-US"),
  });
  const { job } = useSelector(state => state.job);

  useEffect(() => {
    if (!job?.details?.id) {
      if (id) {
        store.dispatch({ type: CHANGE_IS_LOADING, payload: true });
        JobApi.getJobById(id).then((res) => {
          if (res.data.status === 200) {
            const data = res.data.data;
            store.dispatch({ type: SAVE_JOB, payload: data });
            setSocialList(data?.jobSummaryList)
            store.dispatch({ type: CHANGE_IS_LOADING, payload: false });
          }
        });
      } else {
        setSocialList(job?.jobSummaryList);
      }
    } else {
      setSocialList(job?.jobSummaryList);
    }
  }, [id]);

  const [socialList, setSocialList] = useState([]);

  const [show, setShow] = useState({
    conceptDueDate: false,
    contentDueDate: false,
    liveDate: false
  });

  const conceptDateRef = useRef(null);
  const contentDateRef = useRef(null);
  const liveDateRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (conceptDateRef.current && !conceptDateRef.current.contains(event.target)) {
        handleState("conceptDueDate", false);
      }
      if (contentDateRef.current && !contentDateRef.current.contains(event.target)) {
        handleState("contentDueDate", false);
      }
      if (liveDateRef.current && !liveDateRef.current.contains(event.target)) {
        handleState("liveDate", false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const addSocialJob = () => {
    if (socialForm?.jobTitle !== "" || socialForm?.jobTitle.trim() !== "") {
      let list = socialList;
      const data = {
        ...socialForm,
        conceptDueDate: convertDueDate(socialForm.conceptDueDate),
        contentDueDate: convertDueDate(socialForm.contentDueDate),
        liveDate: convertDueDate(socialForm.liveDate),
        type: "social"
      }
      list.push(data);
      setSocialList(list);
      setSocialForm({
        jobTitle: "",
        conceptDueDate: "",
        contentDueDate: "",
        liveDate: "",
        keyMessages: "",
        deleverables: "",
        createdAt: new Date().toLocaleDateString("en-US"),
      });
    }
  }

  const cancelSocialJob = (index) => {
    const social = socialList[index];
    let list = [];
    if (social) {
      if (socialList?.length > 0) {
        list = socialList.filter((item, i) => i !== index);
        setSocialList(list);
      } else {
        setSocialList([]);
      }
    }
    store.dispatch({ type: SAVE_JOB_JOB_SUMMARY_LIST, payload: list });
  }

  const handleChange = (e) => {
    setSocialForm({
      ...socialForm,
      [e.target.name]: e.target.value
    });
  }

  const handleDateChange = (action, selectedDate) => {
    setSocialForm({
      ...socialForm,
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
    inputPlaceholderProp: "CONCEPT DUE DATE",
    inputDateFormatProp: {
      day: "numeric",
      month: "numeric",
      year: "numeric"
    }
  }

  const nextFunc = () => {
    store.dispatch({ type: SAVE_JOB_JOB_SUMMARY_LIST, payload: socialList });
    if (job?.details?._id) {
      navigate("/job/edit/" + job?.details?._id + "/event");
    } else {
      navigate("/job/add/event");
    }
  }

  const updateJob = () => {
    const data = {
      ...job,
      jobSummaryList: socialList
    }
    if (job?.details?._id) {
      store.dispatch({ type: CHANGE_IS_LOADING, payload: true });
      JobApi.updateJobById(job?.details?._id, data).then((res) => {
        if (res.data.status === 401) {
          window.location.href = process.env.REACT_APP_API_BACKEND_URL + res.data.redirectUrl;
        } else if (res.data.status === 200) {
          store.dispatch({ type: SAVE_JOB_DETAILS_FORM, payload: res.data.data });
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
    } else {
      store.dispatch({ type: CHANGE_IS_LOADING, payload: true });
      JobApi.add(data).then((res) => {
        if (res.data.status === 401) {
          window.location.href = process.env.REACT_APP_API_BACKEND_URL + res.data.redirectUrl;
        } else if (res.data.status === 200) {
          store.dispatch({ type: SAVE_JOB_DETAILS_FORM, payload: res.data.data });
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

  const cancelJob = () => {
    store.dispatch({ type: CLEAN_JOB });
    navigate("/job/kanban");
  }

  const edit = (item, index) => {
    if (item?.type === "social") {
      setSocialForm({
        ...item,
        conceptDueDate: dueDateFormat(item.conceptDueDate),
        contentDueDate: dueDateFormat(item.contentDueDate),
        liveDate: dueDateFormat(item.liveDate),
      });
      const list = socialList?.filter((item, i) => i !== index);
      setSocialList(list);
    }
  }

  return (
    <div className="mt-7 w-full bg-main pt-12">
      <ToastContainer />
      <div className="w-full text-center text-xl md:text-3xl mb-5">
        <span className="text-title-1 uppercase font-gotham-bold italic">social - </span>
        <span className="text-title-2 uppercase font-gotham-bold">{job?.details?.jobName === "" ? '{ Job Name }' : job?.details?.jobName}</span>
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
                  placeholder="job title"
                  type="text" value={socialForm.jobTitle} name="jobTitle"
                  onChange={(e) => handleChange(e)} />
              </div>

              <div className="w-full grid grid-cols-1 lg:grid-cols-3 relative gap-3 py-2">
                <div ref={conceptDateRef}>
                  <DatePicker options={conceptDateOptions} onChange={(selectedDate) => handleDateChange("conceptDueDate", selectedDate)} show={show.conceptDueDate}
                    setShow={(state) => handleState("conceptDueDate", state)}>
                    <div className="relative">
                      <input type="text" className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none`}
                        placeholder="Concept Due Date" value={socialForm.conceptDueDate} onFocus={() => setShow({ ...show, conceptDueDate: true })} readOnly />
                      <div className="absolute top-1.5 right-2">
                        <img src={CalendarIcon} alt="calendar" />
                      </div>
                    </div>
                  </DatePicker>
                </div>

                <div ref={contentDateRef}>
                  <DatePicker options={conceptDateOptions} onChange={(selectedDate) => handleDateChange("contentDueDate", selectedDate)} show={show.contentDueDate}
                    setShow={(state) => handleState("contentDueDate", state)}>
                    <div className="relative">
                      <input type="text" className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none`}
                        placeholder="Content Due Date" value={socialForm.contentDueDate} onFocus={() => setShow({ ...show, contentDueDate: true })} readOnly />
                      <div className="absolute top-1.5 right-2">
                        <img src={CalendarIcon} alt="calendar" />
                      </div>
                    </div>
                  </DatePicker>
                </div>

                <div ref={liveDateRef}>
                  <DatePicker options={conceptDateOptions} onChange={(selectedDate) => handleDateChange("liveDate", selectedDate)} show={show.liveDate}
                    setShow={(state) => handleState("liveDate", state)}>
                    <div className="relative">
                      <input type="text" className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none`}
                        placeholder="Live Date" value={socialForm.liveDate} onFocus={() => setShow({ ...show, liveDate: true })} readOnly />
                      <div className="absolute top-1.5 right-2">
                        <img src={CalendarIcon} alt="calendar" />
                      </div>
                    </div>
                  </DatePicker>
                </div>
              </div>

              <div className="w-full py-2">
                <textarea className={`rounded-[16px] text-input shadow-md shadow-500 h-full w-full tracking-wider text-sm resize-none outline-none focus:border-[#d4d5d6]
                       placeholder:text-center border-none`}
                  placeholder="Brief Copy&#10;Tags&#10;Key Messages"
                  type="text" value={socialForm.keyMessages} name="keyMessages" rows={5}
                  onChange={(e) => handleChange(e)} />
              </div>

              <div className="w-full py-2">
                <textarea className={`rounded-[16px] text-input shadow-md shadow-500 h-full w-full tracking-wider text-sm resize-none outline-none focus:border-[#d4d5d6]
                       placeholder:text-center border-none`}
                  placeholder="Deleverables"
                  type="text" value={socialForm.deleverables} name="deleverables" rows={5}
                  onChange={(e) => handleChange(e)} />
              </div>
            </div>

            <div className="w-full flex justify-end items-center mt-10 ">
              <button className="w-fit flex gap-2 cursor-pointer hover:text-decoration" onClick={addSocialJob}>
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
              {socialList?.length > 0 ?
                socialList?.map((item, index) => {
                  return (
                    <div className="flex justify-between items-center border-b divider-line-color py-3"
                      key={index}>
                      <div className="flex items-center overflow-hidden">
                        <span className="text-label italic text-[12px] md:text-[15px] font-semibold uppercase mr-2">{item.type} - </span>
                        <span className="text-summary-item text-[12px] md:text-[15px] font-semibold">{item.jobTitle}</span>
                      </div>
                      <div className="flex items-center gap-5">
                        <span className="text-summary-item text-[12px] md:text-[15px] font-semibold">DUE: {dueDateFormat(item.createdAt)}</span>
                        <button className="text-white bg-black rounded-xl px-4" onClick={() => edit(item, index)}>Edit</button>
                        <button onClick={() => cancelSocialJob(index)}>
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
          <button className="bg-button-1 h-10 tracking-wider text-center rounded-[12px] text-white font-gotham-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-gray-300 hover:shadow-md focus:bg-gray-400 focus:shadow-md focus:outline-none focus:ring-0 text-sm"
            type="button" onClick={cancelJob}>Cancel</button>
        </div>
        <Link to={job?.details?._id ? `/job/edit/${job?.details?._id}/invoice` : "/job/add/invoice"} className="w-full">
          <button className="bg-button-2 h-10 tracking-wider text-center rounded-[12px] text-white font-gotham-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-[#afa098] hover:shadow-md focus:bg-[#6a5b53] focus:shadow-md focus:outline-none focus:ring-0 text-sm">Previous</button>
        </Link>
        <div className="w-full">
          <button className="bg-button-3 h-10 tracking-wider text-center rounded-[12px] text-white font-gotham-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-[#9b8579] hover:shadow-md focus:bg-[#664838] focus:shadow-md focus:outline-none focus:ring-0 text-sm"
            type="button" onClick={nextFunc}
          >Next...</button>
        </div>
        <div className="w-full">
          <button className="bg-button-4 h-10 tracking-wider text-center rounded-[12px] text-white font-gotham-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-slate-700 hover:shadow-md focus:bg-slate-800 focus:shadow-md focus:outline-none focus:ring-0 text-sm"
            type="button" onClick={updateJob}>{job?.details?._id ? "Update" : "Submit"}</button>
        </div>
      </div>

    </div>
  )
};

export default JobSocialForm;