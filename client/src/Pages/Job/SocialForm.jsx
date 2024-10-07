import { useState } from "react";
import { Link } from "react-router-dom";
import AddCircle from "../../svg/add_circle.svg"
import DatePicker from "tailwind-datepicker-react";
import CalendarIcon from "../../svg/calendar_month.svg";
import CancelIcon from "../../svg/cancel.svg";

const JobSocialForm = () => {
  const [socialForm, setSocialForm] = useState({
    jobTitle: "",
    conceptDueDate: "",
    contentDueDate: "",
    liveDate: "",
    keyMessages: "",
    deleverables: "",
    ambassadorship: false
  });

  const [jobList, setJobList] = useState([]);

  const [show, setShow] = useState({
    conceptDueDate: false,
    contentDueDate: false,
    liveDate: false
  })

  const addSocialJob = () => {
    if (socialForm.jobTitle !== "") {
      const list = jobList;
      list.push(socialForm);
      setJobList(list);
      setSocialForm({
        jobTitle: "",
        conceptDueDate: "",
        contentDueDate: "",
        liveDate: "",
        keyMessages: "",
        deleverables: "",
        ambassadorship: false
      });
    }
  }

  const cancelSocialJob = (index) => {
    const social = jobList[index];
    if (social) {
      if (jobList?.length > 0) {
        const list = jobList.filter((item, i) => i !== index);
        setJobList(list);
      } else {
        setJobList([]);
      }
    }
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
      [action]: selectedDate.toLocaleDateString("en-US")
    })
  }

  const handleState = (action, state) => {
    setShow({
      ...show,
      [action]: state,
    })
  }

  const handleAmbassadorshipChange = () => {
    setSocialForm({
      ...socialForm,
      ambassadorship: !socialForm.ambassadorship
    })
  }

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

  const contentDateOptions = {
    autoHide: true,
    datepickerClassNames: "",
    defaultDate: "",
    language: "en",
    inputPlaceholderProp: "CONTENT DUE DATE",
    inputDateFormatProp: {
      day: "numeric",
      month: "numeric",
      year: "numeric"
    }
  }

  const liveDateOptions = {
    autoHide: true,
    datepickerClassNames: "",
    defaultDate: "",
    language: "en",
    inputPlaceholderProp: "LIVE DATE",
    inputDateFormatProp: {
      day: "numeric",
      month: "numeric",
      year: "numeric"
    }
  }

  return (
    <div className="mt-7 w-full bg-main">
      <div className="w-full text-center text-xl md:text-3xl mb-5">
        <span className="text-title-1 uppercase font-bold italic">social - </span>
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
                <input className="rounded-[16px] text-input shadow-md shadow-500 h-10 w-full tracking-wider text-sm text-center
                      outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="job title"
                  type="text" value={socialForm.jobTitle} name="jobTitle"
                  onChange={(e) => handleChange(e)} />
              </div>

              <div className="w-full grid grid-cols-1 lg:grid-cols-3 relative gap-3 py-2">
                <DatePicker options={conceptDateOptions} onChange={(selectedDate) => handleDateChange("conceptDueDate", selectedDate)} show={show.conceptDueDate}
                  setShow={(state) => handleState("conceptDueDate", state)}>
                  <div className="relative">
                    <input type="text" className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase"
                      placeholder="Concept Due Date" value={socialForm.conceptDueDate} onFocus={() => setShow({ ...show, conceptDueDate: true })} readOnly />
                    <div className="absolute top-1.5 right-2">
                      <img src={CalendarIcon} alt="calendar" />
                    </div>
                  </div>
                </DatePicker>

                <DatePicker options={conceptDateOptions} onChange={(selectedDate) => handleDateChange("contentDueDate", selectedDate)} show={show.contentDueDate}
                  setShow={(state) => handleState("contentDueDate", state)}>
                  <div className="relative">
                    <input type="text" className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase"
                      placeholder="Content Due Date" value={socialForm.contentDueDate} onFocus={() => setShow({ ...show, contentDueDate: true })} readOnly />
                    <div className="absolute top-1.5 right-2">
                      <img src={CalendarIcon} alt="calendar" />
                    </div>
                  </div>
                </DatePicker>

                <DatePicker options={conceptDateOptions} onChange={(selectedDate) => handleDateChange("liveDate", selectedDate)} show={show.liveDate}
                  setShow={(state) => handleState("liveDate", state)}>
                  <div className="relative">
                    <input type="text" className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase"
                      placeholder="Live Date" value={socialForm.liveDate} onFocus={() => setShow({ ...show, liveDate: true })} readOnly />
                    <div className="absolute top-1.5 right-2">
                      <img src={CalendarIcon} alt="calendar" />
                    </div>
                  </div>
                </DatePicker>
              </div>

              <div className="w-full py-2">
                <textarea className="rounded-[16px] text-input shadow-md shadow-500 h-full w-full tracking-wider text-sm resize-none outline-none focus:border-[#d4d5d6] border-none
                        placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase placeholder:text-center"
                  placeholder="Brief Copy Tags Key Messages"
                  type="text" value={socialForm.keyMessages} name="keyMessages" rows={5}
                  onChange={(e) => handleChange(e)} />
              </div>

              <div className="w-full py-2">
                <textarea className="rounded-[16px] text-input shadow-md shadow-500 h-full w-full tracking-wider text-sm resize-none outline-none focus:border-[#d4d5d6] border-none
                        placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase placeholder:text-center"
                  placeholder="Deleverables"
                  type="text" value={socialForm.deleverables} name="deleverables" rows={5}
                  onChange={(e) => handleChange(e)} />
              </div>
            </div>

            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3">
              <label className='themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center w-full'>
                <input
                  type='checkbox'
                  checked={socialForm.ambassadorship}
                  onChange={handleAmbassadorshipChange}
                  className='sr-only'
                />
                <span className={`slider mr-4 flex h-8 w-[60px] items-center rounded-full p-0.5 duration-200 border-button-3  ${socialForm.ambassadorship ? 'bg-button-3' : 'bg-white'}`}>
                  <span className={`dot h-6 w-6 rounded-full duration-200 ${socialForm.ambassadorship ? 'translate-x-[28px] bg-white' : 'bg-button-3'}`}></span>
                </span>
                <span className='label flex items-center text-sm font-semibold text-estimateDate text-estimateDate'>
                  Part of ambassadorship
                </span>
              </label>
              <select className="bg-white text-center border-none outline-none text-sm rounded-lg w-52 text-[#d4d5d6] font-bold tracking-wider
                          focus:ring-primary-500 focus:border-primary-100 shadow-md block w-full p-2">
                <option>AMBASSADORSHIP</option>
              </select>
            </div>

            <button className="w-full flex justify-end items-center gap-2 mt-10 cursor-pointer hover:text-decoration" onClick={addSocialJob}>
              <span className="text-estimateDate text-sm font-semibold">Add to job list</span>
              <img src={AddCircle} alt="add" />
            </button>
          </div>
        </div>
        <div className="col-span-1">
          <div className="flex flex-col justify-between items-center h-full w-full">
            <div className="w-full pt-2">
              <span className="text-base text-title-2 font-medium">Job Summary</span>
            </div>
            <div className="rounded-[16px] shadow-md shadow-500 h-full min-h-[160px] w-full tracking-wider text-md bg-white px-5 py-2">
              {jobList?.length > 0 ?
                jobList?.map((item, index) => {
                  return (
                    <div className="flex justify-between items-center border-b divider-line-color py-3"
                      key={index}>
                      <div className="flex items-center">
                        <span className="text-label italic text-[12px] md:text-[15px] font-semibold uppercase mr-2">Social - </span>
                        <span className="text-summary-item text-[12px] md:text-[15px] font-semibold">{item.jobTitle}</span>
                      </div>
                      <div className="flex items-center gap-5">
                        <span className="text-summary-item text-[12px] md:text-[15px] font-semibold">DUE: {item.liveDate}</span>
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
        <Link to={"/job/kanban"} className="w-full">
          <button className="bg-button-1 h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-white-100 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm">Cancel</button>
        </Link>
        <Link to={"/job/edit/1/invoice"} className="w-full">
          <button className="bg-button-2 h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-white-100 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm">Previous</button>
        </Link>
        <Link to={"/job/edit/1/event"} className="w-full">
          <button className="bg-button-3 h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-white-100 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm">Next...</button>
        </Link>
        <div className="w-full">
          <button className="bg-button-4 h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-white-100 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm">Update</button>
        </div>
      </div>

    </div>
  )
};

export default JobSocialForm;