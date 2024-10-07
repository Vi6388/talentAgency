import { useState } from "react";
import { Link } from "react-router-dom";
import AddCircle from "../../svg/add_circle.svg"
import DatePicker from "tailwind-datepicker-react";
import CalendarIcon from "../../svg/calendar_month.svg";
import CancelIcon from "../../svg/cancel.svg";

const JobPublishForm = () => {
  const [publishForm, setPublishForm] = useState({
    jobTitle: "",
    firstDraftDate: "",
    secondDraftDate: "",
    finalDate: "",
    publisher: "",
    keyMessages: "",
    deleverables: "",
    ambassadorship: false
  });

  const [publishList, setPublishList] = useState([]);

  const [show, setShow] = useState({
    firstDraftDate: false,
    secondDraftDate: false,
    finalDate: false,
  })

  const handleChange = (e) => {
    setPublishForm({
      ...publishForm,
      [e.target.name]: e.target.value
    });
  }

  const handleDateChange = (action, selectedDate) => {
    setPublishForm({
      ...publishForm,
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
    setPublishForm({
      ...publishForm,
      ambassadorship: !publishForm.ambassadorship
    })
  }

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
    if (publishForm.jobTitle !== "") {
      const list = publishList;
      list.push(publishForm);
      setPublishList(list);
      setPublishForm({
        jobTitle: "",
        firstDraftDate: "",
        secondDraftDate: "",
        finalDate: "",
        publisher: "",
        keyMessages: "",
        deleverables: "",
        ambassadorship: false
      });
    }
  }

  const cancelJobPublish = (index) => {
    const publish = publishList[index];
    if (publish) {
      if (publishList?.length > 0) {
        const list = publishList.filter((item, i) => i !== index);
        setPublishList(list);
      } else {
        setPublishList([]);
      }
    }
  }

  return (
    <div className="mt-7 w-full bg-main">
      <div className="w-full text-center text-xl md:text-3xl mb-5">
        <span className="text-title-1 uppercase font-bold italic">publishing - </span>
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
                  type="text" value={publishForm.jobTitle} name="jobTitle"
                  onChange={(e) => handleChange(e)} />
              </div>

              <div className="w-full grid grid-cols-1 lg:grid-cols-3 relative gap-3 py-2">
                <DatePicker options={firstDraftDateOption} onChange={(selectedDate) => handleDateChange("firstDraftDate", selectedDate)} show={show.firstDraftDate}
                  setShow={(state) => handleState("firstDraftDate", state)}>
                  <div className="relative">
                    <input type="text" className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase"
                      placeholder="1st Draft Due Date" value={publishForm.firstDraftDate} onFocus={() => setShow({ ...show, firstDraftDate: true })} readOnly />
                    <div className="absolute top-1.5 right-2">
                      <img src={CalendarIcon} alt="calendar" />
                    </div>
                  </div>
                </DatePicker>

                <DatePicker options={secondDraftDateOptions} onChange={(selectedDate) => handleDateChange("secondDraftDate", selectedDate)} show={show.secondDraftDate}
                  setShow={(state) => handleState("secondDraftDate", state)}>
                  <div className="relative">
                    <input type="text" className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase"
                      placeholder="2nd Draft Due Date" value={publishForm.secondDraftDate} onFocus={() => setShow({ ...show, secondDraftDate: true })} readOnly />
                    <div className="absolute top-1.5 right-2">
                      <img src={CalendarIcon} alt="calendar" />
                    </div>
                  </div>
                </DatePicker>

                <DatePicker options={finalDateOptions} onChange={(selectedDate) => handleDateChange("finalDate", selectedDate)} show={show.finalDate}
                  setShow={(state) => handleState("finalDate", state)}>
                  <div className="relative">
                    <input type="text" className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase"
                      placeholder="Final Due Date" value={publishForm.finalDate} onFocus={() => setShow({ ...show, finalDate: true })} readOnly />
                    <div className="absolute top-1.5 right-2">
                      <img src={CalendarIcon} alt="calendar" />
                    </div>
                  </div>
                </DatePicker>
              </div>

              <div className="w-full gap-3 py-2">
                <input className="rounded-[16px] text-input shadow-md shadow-500 h-10 w-full tracking-wider text-sm text-center
                      outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="publisher"
                  type="text" value={publishForm.publisher} name="publisher"
                  onChange={(e) => handleChange(e)} />
              </div>

              <div className="w-full py-2">
                <textarea className="rounded-[16px] text-input shadow-md shadow-500 h-full w-full tracking-wider text-sm resize-none outline-none focus:border-[#d4d5d6] border-none
                        placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase placeholder:text-center"
                  placeholder="Brief Copy Tags Key Messages"
                  type="text" value={publishForm.keyMessages} name="keyMessages" rows={5}
                  onChange={(e) => handleChange(e)} />
              </div>

              <div className="w-full py-2">
                <textarea className="rounded-[16px] text-input shadow-md shadow-500 h-full w-full tracking-wider text-sm resize-none outline-none focus:border-[#d4d5d6] border-none
                        placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase placeholder:text-center"
                  placeholder="Deleverables"
                  type="text" value={publishForm.deleverables} name="deleverables" rows={5}
                  onChange={(e) => handleChange(e)} />
              </div>
            </div>

            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3">
              <label className='themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center w-full'>
                <input
                  type='checkbox'
                  checked={publishForm.ambassadorship}
                  onChange={handleAmbassadorshipChange}
                  className='sr-only'
                />
                <span className={`slider mr-4 flex h-8 w-[60px] items-center rounded-full p-0.5 duration-200 border-button-3  ${publishForm.ambassadorship ? 'bg-button-3' : 'bg-white'}`}>
                  <span className={`dot h-6 w-6 rounded-full duration-200 ${publishForm.ambassadorship ? 'translate-x-[28px] bg-white' : 'bg-button-3'}`}></span>
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

            <button className="w-full flex justify-end items-center gap-2 mt-10 cursor-pointer hover:text-decoration" onClick={addJobPublish}>
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
              {publishList?.length > 0 ?
                publishList?.map((item, index) => {
                  return (
                    <div className="flex justify-between items-center border-b divider-line-color py-3"
                      key={index}>
                      <div className="flex items-center">
                        <span className="text-label italic text-[12px] md:text-[15px] font-semibold uppercase mr-2">Publishing - </span>
                        <span className="text-summary-item text-[12px] md:text-[15px] font-semibold">{item.jobTitle}</span>
                      </div>
                      <div className="flex items-center gap-5">
                        <span className="text-summary-item text-[12px] md:text-[15px] font-semibold">DUE: {item.finalDate}</span>
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
        <Link to={"/job/kanban"} className="w-full">
          <button className="bg-button-1 h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-white-100 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm">Cancel</button>
        </Link>
        <Link to={"/job/edit/1/media"} className="w-full">
          <button className="bg-button-2 h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-white-100 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm">Previous</button>
        </Link>
        <Link to={"/job/edit/1/travel"} className="w-full">
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

export default JobPublishForm;