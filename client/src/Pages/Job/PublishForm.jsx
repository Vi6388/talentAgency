import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AddCircle from "../../svg/add_circle.svg"
import DatePicker from "tailwind-datepicker-react";
import CalendarIcon from "../../svg/calendar_month.svg";
import CancelIcon from "../../svg/cancel.svg";
import { useSelector } from "react-redux";
import { store } from "../../redux/store";
import { CHANGE_IS_LOADING, CLEAN_JOB, SAVE_JOB, SAVE_JOB_DETAILS_FORM, SAVE_JOB_JOB_SUMMARY_LIST } from "../../redux/actionTypes";
import { JobApi } from "../../apis/job";
import { toast, ToastContainer } from "react-toastify";
import { convertDueDate, dueDateFormat } from "../../utils/utils";

const JobPublishForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { job } = useSelector(state => state.job);
  const [publishForm, setPublishForm] = useState({
    jobTitle: "",
    firstDraftDate: "",
    secondDraftDate: "",
    finalDate: "",
    publisher: "",
    keyMessages: "",
    deleverables: "",
    createdAt: new Date().toLocaleDateString("en-US"),
  });

  const [publishList, setPublishList] = useState([]);

  const [show, setShow] = useState({
    firstDraftDate: false,
    secondDraftDate: false,
    finalDate: false,
  });

  useEffect(() => {
    if (!job?.details?._id) {
      if (id) {
        store.dispatch({ type: CHANGE_IS_LOADING, payload: true });
        JobApi.getJobById(id).then((res) => {
          if (res.data.status === 200) {
            const data = res.data.data;
            store.dispatch({ type: SAVE_JOB, payload: data });
            setPublishList(data?.jobSummaryList)
            store.dispatch({ type: CHANGE_IS_LOADING, payload: false });
          }
        });
      } else {
        setPublishList(job?.jobSummaryList);
      }
    } else {
      setPublishList(job?.jobSummaryList);
    }
  }, [id]);

  const firstDateRef = useRef(null);
  const secondDateRef = useRef(null);
  const finalDateRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (firstDateRef.current && !firstDateRef.current.contains(event.target)) {
        handleState("firstDraftDate", false);
      }
      if (secondDateRef.current && !secondDateRef.current.contains(event.target)) {
        handleState("secondDraftDate", false);
      }
      if (finalDateRef.current && !finalDateRef.current.contains(event.target)) {
        handleState("finalDate", false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    setPublishForm({
      ...publishForm,
      [e.target.name]: e.target.value
    });
  }

  const handleDateChange = (action, selectedDate) => {
    setPublishForm({
      ...publishForm,
      [action]: dueDateFormat(new Date(selectedDate))
    })
  }

  const handleState = (field, state) => {
    setShow((prev) => ({ ...prev, [field]: state }));
  };

  const firstDraftDateOption = {
    autoHide: true,
    datepickerClassNames: "",
    defaultDate: "",
    language: "en",
    inputPlaceholderProp: "1ST DRAFT DUE DATE",
    inputDateFormatProp: {
      day: "numeric",
      month: "numeric",
      year: "numeric"
    }
  }

  const secondDraftDateOptions = {
    autoHide: true,
    datepickerClassNames: "",
    defaultDate: "",
    language: "en",
    inputPlaceholderProp: "2ND DRAFT DUE DATE",
    inputDateFormatProp: {
      day: "numeric",
      month: "numeric",
      year: "numeric"
    }
  }

  const finalDateOptions = {
    autoHide: true,
    datepickerClassNames: "",
    defaultDate: "",
    language: "en",
    inputPlaceholderProp: "FINAL DATE",
    inputDateFormatProp: {
      day: "numeric",
      month: "numeric",
      year: "numeric"
    }
  }

  const addJobPublish = () => {
    if (publishForm?.jobTitle !== "" || publishForm?.jobTitle.trim() !== "") {
      let list = publishList;
      const data = {
        ...publishForm,
        firstDraftDate: convertDueDate(publishForm.firstDraftDate),
        secondDraftDate: convertDueDate(publishForm.secondDraftDate),
        finalDate: convertDueDate(publishForm.finalDate),
        type: "publishing"
      }
      list.push(data);
      setPublishList(list);
      setPublishForm({
        jobTitle: "",
        firstDraftDate: "",
        secondDraftDate: "",
        finalDate: "",
        publisher: "",
        keyMessages: "",
        deleverables: "",
        createdAt: new Date().toLocaleDateString("en-US"),
      });
    }
  }

  const cancelJobPublish = (index) => {
    const publish = publishList[index];
    let list = [];
    if (publish) {
      if (publishList?.length > 0) {
        list = publishList.filter((item, i) => i !== index);
        setPublishList(list);
      } else {
        setPublishList([]);
      }
    }
    store.dispatch({ type: SAVE_JOB_JOB_SUMMARY_LIST, payload: list });
  }

  const nextFunc = () => {
    store.dispatch({ type: SAVE_JOB_JOB_SUMMARY_LIST, payload: publishList });
    if (job?.details?._id) {
      navigate("/job/edit/" + job?.details?._id + "/travel");
    } else {
      navigate("/job/add/travel");
    }
  }

  const updateJob = () => {
    const data = {
      ...job,
      jobSummaryList: publishList
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
    if (item?.type === "publishing") {
      setPublishForm({
        ...item,
        firstDraftDate: dueDateFormat(item?.firstDraftDate),
        secondDraftDate: dueDateFormat(item?.secondDraftDate),
        finalDate: dueDateFormat(item?.finalDate),
      });
      const list = publishList?.filter((item, i) => i !== index);
      setPublishList(list);
    }
  }

  return (
    <div className="mt-7 w-full bg-main pt-12">
      <ToastContainer />
      <div className="w-full text-center text-xl md:text-3xl mb-5">
        <span className="text-title-1 uppercase font-gotham-bold italic">publishing - </span>
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
                  type="text" value={publishForm.jobTitle} name="jobTitle"
                  onChange={(e) => handleChange(e)} />
              </div>

              <div className="w-full grid grid-cols-1 lg:grid-cols-3 relative gap-3 py-2">
                <div ref={firstDateRef}>
                  <DatePicker options={firstDraftDateOption} onChange={(selectedDate) => handleDateChange("firstDraftDate", selectedDate)} show={show.firstDraftDate}
                    setShow={(state) => handleState("firstDraftDate", state)}>
                    <div className="relative">
                      <input type="text" className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none`}
                        placeholder="1st Draft Due Date" value={publishForm.firstDraftDate} onFocus={() => setShow({ ...show, firstDraftDate: true })} readOnly />
                      <div className="absolute top-1.5 right-2">
                        <img src={CalendarIcon} alt="calendar" />
                      </div>
                    </div>
                  </DatePicker>
                </div>

                <div ref={secondDateRef}>
                  <DatePicker options={secondDraftDateOptions} onChange={(selectedDate) => handleDateChange("secondDraftDate", selectedDate)} show={show.secondDraftDate}
                    setShow={(state) => handleState("secondDraftDate", state)}>
                    <div className="relative">
                      <input type="text" className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none`}
                        placeholder="2nd Draft Due Date" value={publishForm.secondDraftDate} onFocus={() => setShow({ ...show, secondDraftDate: true })} readOnly />
                      <div className="absolute top-1.5 right-2">
                        <img src={CalendarIcon} alt="calendar" />
                      </div>
                    </div>
                  </DatePicker>
                </div>

                <div ref={finalDateRef}>
                  <DatePicker options={finalDateOptions} onChange={(selectedDate) => handleDateChange("finalDate", selectedDate)} show={show.finalDate}
                    setShow={(state) => handleState("finalDate", state)}>
                    <div className="relative">
                      <input type="text" className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none`}
                        placeholder="Final Due Date" value={publishForm.finalDate} onFocus={() => setShow({ ...show, finalDate: true })} readOnly />
                      <div className="absolute top-1.5 right-2">
                        <img src={CalendarIcon} alt="calendar" />
                      </div>
                    </div>
                  </DatePicker>
                </div>
              </div>

              <div className="w-full gap-3 py-2">
                <input className={`rounded-[16px] text-input shadow-md shadow-500 h-10 w-full tracking-wider text-sm text-center
                      outline-none focus:border-[#d4d5d6] border-none`}
                  placeholder="publisher"
                  type="text" value={publishForm.publisher} name="publisher"
                  onChange={(e) => handleChange(e)} />
              </div>

              <div className="w-full py-2">
                <textarea className={`rounded-[16px] text-input shadow-md shadow-500 h-full w-full tracking-wider text-sm resize-none outline-none focus:border-[#d4d5d6] border-none`}
                  placeholder="Brief Copy&#10;Tags&#10;Key Messages"
                  type="text" value={publishForm.keyMessages} name="keyMessages" rows={5}
                  onChange={(e) => handleChange(e)} />
              </div>

              <div className="w-full py-2">
                <textarea className={`rounded-[16px] text-input shadow-md shadow-500 h-full w-full tracking-wider text-sm resize-none outline-none focus:border-[#d4d5d6] border-none`}
                  placeholder="Deleverables"
                  style={{ whiteSpace: 'pre-line' }}
                  type="text" value={publishForm.deleverables} name="deleverables" rows={5}
                  onChange={(e) => handleChange(e)} />
              </div>
            </div>
            <div className="w-full flex justify-end items-center mt-10 ">
              <button className="w-fit flex gap-2 cursor-pointer hover:text-decoration" onClick={addJobPublish}>
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
              {publishList?.length > 0 ?
                publishList?.map((item, index) => {
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
                        <button onClick={() => cancelJobPublish(index)}>
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
        <Link to={job?.details?._id ? `/job/edit/${job?.details?._id}/media` : "/job/add/media"} className="w-full">
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

export default JobPublishForm;