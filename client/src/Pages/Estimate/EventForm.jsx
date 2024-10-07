import { useState } from "react";
import { Link } from "react-router-dom";
import AddCircle from "../../svg/add_circle.svg"
import DatePicker from "tailwind-datepicker-react";
import CalendarIcon from "../../svg/calendar_month.svg";
import ScheduleIcon from "../../svg/schedule.svg";
import CancelIcon from "../../svg/cancel.svg";

const EstimateEventForm = () => {
  const [eventForm, setEventForm] = useState({
    jobTitle: "",
    eventDate: "",
    eventStartTime: "",
    eventEndTime: "",
    keyMessages: "",
    deleverables: "",
    ambassadorship: false
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
  })

  const handleChange = (e) => {
    setEventForm({
      ...eventForm,
      [e.target.name]: e.target.value
    });
  }

  const handleDateChange = (action, selectedDate) => {
    setEventForm({
      ...eventForm,
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
    setEventForm({
      ...eventForm,
      ambassadorship: !eventForm.ambassadorship
    })
  }

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
    if (eventForm.jobTitle !== "") {
      const list = eventList;
      list.push(eventForm);
      setEventList(list);
      setEventForm({
        jobTitle: "",
        eventDate: "",
        eventStartTime: "",
        eventEndTime: "",
        keyMessages: "",
        deleverables: "",
        ambassadorship: false
      });
    }
  }

  const cancelJobEvent = (index) => {
    const event = eventList[index];
    if (event) {
      if (eventList?.length > 0) {
        const list = eventList.filter((item, i) => i !== index);
        setEventList(list);
      } else {
        setEventList([]);
      }
    }
  }

  return (
    <div className="mt-7 w-full bg-main">
      <div className="w-full text-center text-xl md:text-3xl mb-5">
        <span className="text-title-1 uppercase font-bold italic">estimate - </span>
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
                  type="text" value={eventForm.jobTitle} name="jobTitle"
                  onChange={(e) => handleChange(e)} />
              </div>

              <div className="w-full grid grid-cols-1 lg:grid-cols-3 relative gap-3 py-2">
                <DatePicker options={conceptDateOptions} onChange={(selectedDate) => handleDateChange("eventDate", selectedDate)} show={show.eventDate}
                  setShow={(state) => handleState("eventDate", state)}>
                  <div className="relative">
                    <input type="text" className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase"
                      placeholder="Concept Due Date" value={eventForm.eventDate} onFocus={() => setShow({ ...show, eventDate: true })} readOnly />
                    <div className="absolute top-1.5 right-2">
                      <img src={CalendarIcon} alt="calendar" />
                    </div>
                  </div>
                </DatePicker>

                <div className="relative w-full">
                  <input type={inputType.startTime} name="eventStartTime"
                    className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm py-0 pl-0 
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase"
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
                    className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm py-0 pl-0 
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase"
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
                <textarea className="rounded-[16px] text-input shadow-md shadow-500 h-full w-full tracking-wider text-sm resize-none outline-none focus:border-[#d4d5d6] border-none
                        placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase placeholder:text-center"
                  placeholder="Brief Copy Tags Key Messages"
                  type="text" value={eventForm.keyMessages} name="keyMessages" rows={5}
                  onChange={(e) => handleChange(e)} />
              </div>

              <div className="w-full py-2">
                <textarea className="rounded-[16px] text-input shadow-md shadow-500 h-full w-full tracking-wider text-sm resize-none outline-none focus:border-[#d4d5d6] border-none
                        placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase placeholder:text-center"
                  placeholder="Deleverables"
                  type="text" value={eventForm.deleverables} name="deleverables" rows={5}
                  onChange={(e) => handleChange(e)} />
              </div>
            </div>

            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3">
              <label className='themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center w-full'>
                <input
                  type='checkbox'
                  checked={eventForm.ambassadorship}
                  onChange={handleAmbassadorshipChange}
                  className='sr-only'
                />
                <span className={`slider mr-4 flex h-8 w-[60px] items-center rounded-full p-0.5 duration-200 border-button-3  ${eventForm.ambassadorship ? 'bg-button-3' : 'bg-white'}`}>
                  <span className={`dot h-6 w-6 rounded-full duration-200 ${eventForm.ambassadorship ? 'translate-x-[28px] bg-white' : 'bg-button-3'}`}></span>
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

            <button className="w-full flex justify-end items-center gap-2 mt-10 cursor-pointer hover:text-decoration" onClick={addJobEvent}>
              <span className="text-estimateDate text-sm font-semibold">Add to list</span>
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
              {eventList?.length > 0 ?
                eventList?.map((item, index) => {
                  return (
                    <div className="flex justify-between items-center border-b divider-line-color py-1 md:py-3"
                      key={index}>
                      <div className="flex items-center">
                        <span className="text-label italic text-[12px] md:text-[15px] font-semibold uppercase mr-2">Event - </span>
                        <span className="text-summary-item text-[12px] md:text-[15px] font-semibold">{item.jobTitle}</span>
                      </div>
                      <div className="flex items-center gap-5">
                        <span className="text-summary-item text-[12px] md:text-[15px] font-semibold">DUE: {item.eventDate}</span>
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

      <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 w-full px-4 md:w-2/3 sm:mx-auto gap-3">
        <Link to={"/estimate/kanban"} className="w-full">
          <button className="bg-button-1 h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-white-100 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm">Cancel</button>
        </Link>
        <Link to={"/estimate/add/social"} className="w-full">
          <button className="bg-button-2 h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-white-100 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm">Previous</button>
        </Link>
        <Link to={"/estimate/add/media"} className="w-full">
          <button className="bg-button-3 h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-white-100 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm">Next...</button>
        </Link>
        <Link className="w-full">
          <button className="bg-button-4 h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-white-100 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm">Send Estimate</button>
        </Link>
        <Link className="w-full">
          <button className="bg-button-4 h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-white-100 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm">Update and ReSend</button>
        </Link>
        <Link className="w-full">
          <button className="bg-button-5 h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-white-100 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm">Make job live</button>
        </Link>
      </div>

    </div>
  )
};

export default EstimateEventForm;