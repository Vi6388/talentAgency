import { useState } from "react";
import SearchIcon from "../../svg/search.svg";
import Datepicker from "tailwind-datepicker-react";
import CalendarIcon from "../../svg/calendar_month.svg";
import DescriptionIcon from "../../svg/description.svg";
import { Link } from "react-router-dom";

const JobDetailsForm = () => {
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
    ambassadorshipName: "",
    startDate: "",
    endDate: "",
    supplierRequired: true
  });
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [uploadedList, setUploadedList] = useState([
    { id: 1, filename: "Contract file name", type: "contact", path: "file_location/file_location/file_location" },
    { id: 2, filename: "Brief file name", type: "contact", path: "file_location/file_location/file_location" },
    { id: 3, filename: "Supporting file name", type: "contact", path: "file_location/file_location/file_location" },
  ]);

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

  const handleSupplierRequired = () => {
    setJobDetailsForm({
      ...jobDetailsForm,
      supplierRequired: !jobDetailsForm.supplierRequired
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

  return (
    <div className="mt-7 w-full bg-main">
      <div className="w-full text-center text-xl md:text-3xl mb-5">
        <span className="text-title-1 uppercase font-bold italic">{jobDetailsForm.jobName === "" ? "new job -" : ""} </span>
        <span className="text-title-2 uppercase font-bold">{jobDetailsForm.jobName === "" ? 'Details' : jobDetailsForm.jobName}</span>
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
                <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="First Name"
                  type="text" value={jobDetailsForm.firstname} name="firstname"
                  onChange={(e) => handleChange(e)} />
                <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="surname"
                  type="text" value={jobDetailsForm.surname} name="surname"
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="flex justify-center items-center py-2">
                <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="Email Address"
                  type="text" value={jobDetailsForm.email} name="email"
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="flex justify-between items-center gap-3 py-2">
                <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="position"
                  type="text" value={jobDetailsForm.position} name="position"
                  onChange={(e) => handleChange(e)} />
                <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="phone Number"
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
                <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="Company Name"
                  type="text" value={jobDetailsForm.companyName} name="companyName"
                  onChange={(e) => handleChange(e)} />
                <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="abn"
                  type="text" value={jobDetailsForm.abn} name="abn"
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="flex justify-center items-center py-2">
                <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="Postal Address"
                  type="text" value={jobDetailsForm.postalAddress} name="postalAddress"
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="flex justify-between items-center gap-3 py-2">
                <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="suburb"
                  type="text" value={jobDetailsForm.suburb} name="suburb"
                  onChange={(e) => handleChange(e)} />
                <div className="flex items-center justify-between gap-3 w-full">
                  <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="State"
                    type="text" value={jobDetailsForm.state} name="state"
                    onChange={(e) => handleChange(e)} />
                  <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="postcode"
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
                <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="job name"
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
                <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="talent name"
                  type="text" value={jobDetailsForm.talentName} name="talentName"
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="flex justify-between items-center gap-3 py-2">
                <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="mananger"
                  type="text" value={jobDetailsForm.manager} name="manager"
                  onChange={(e) => handleChange(e)} />
              </div>
            </div>
          </div>
          <div className="mb-3 w-full">
            <div className="flex justify-between items-center pt-2">
              <span className="text-base text-title-2 font-medium">Ambassadorship</span>
              <img src={SearchIcon} className="w-4 h-4" alt="search icon" />
            </div>
            <div>
              <div className="flex justify-between items-center gap-3 py-2">
                <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase" placeholder="name"
                  type="text" value={jobDetailsForm.ambassadorshipName} name="ambassadorshipName"
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
                    <input type="text" className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase"
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
                    <input type="text" className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase"
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

      <div className="grid grid-cols-1 w-full px-4 sm:w-3/4 sm:px-0 md:w-2/3 sm:mx-auto gap-8 mt-5 lg:mt-0">
        <div className="w-full flex justify-between items-center gap-3">
          <label className='themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center w-full'>
            <input
              type='checkbox'
              checked={jobDetailsForm.supplierRequired}
              onChange={handleSupplierRequired}
              className='sr-only'
            />
            <span className={`slider mr-4 flex h-8 w-[60px] items-center rounded-full p-0.5 duration-200 border-button-3  ${jobDetailsForm.supplierRequired ? 'bg-button-3' : 'bg-white'}`}>
              <span className={`dot h-6 w-6 rounded-full duration-200 ${jobDetailsForm.supplierRequired ? 'translate-x-[28px] bg-white' : 'bg-button-3'}`}></span>
            </span>
            <span className='label flex items-center text-sm font-semibold text-estimateDate text-estimateDate'>
              Supplier setup required
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-7">
          <div className="col-span-1">
            <div className="text-center my-3">
              <span className="text-base text-title-2 font-medium">Uploaded Files</span>
            </div>
            <div className="rounded-[16px] shadow-md shadow-500 w-full tracking-wider text-md bg-white px-3 py-1">
              {uploadedList?.length > 0 ?
                uploadedList?.map((item, index) => {
                  return (
                    <div className="flex justify-between items-center border-b divider-line-color last:border-none py-2 overflow-hidden"
                      key={index}>
                      <div className="flex items-center gap-1">
                        <img src={DescriptionIcon} alt="file" className="w-4 h-4" />
                        <span className="text-summary-item text-sm">{item.filename}</span>
                      </div>
                      <div className="flex items-center w-20 px-2">
                        <span className="text-summary-item text-sm">{item.path}</span>
                      </div>
                    </div>
                  )
                })
                : <></>
              }
            </div>
          </div>
          <div className="col-span-1 flex flex-col justify-between">
            <div className="text-center my-3">
              <span className="text-base text-title-2 font-medium">Uploaded Files</span>
            </div>
            <div className="flex justify-between h-full">
              <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-1 lg:gap-4 md:gap-8">
                <div className="w-[120px] h-[120px] mx-auto border border-dashed border-dashed-color rounded-lg flex justify-center items-center">
                  <div className="text-gray text-sm uppercase w-1/3 flex justify-center items-center text-center">Contact</div>
                </div>
                <div className="w-[120px] h-[120px] mx-auto border border-dashed border-dashed-color rounded-lg flex justify-center items-center">
                  <div className="text-gray text-sm uppercase w-1/3 flex justify-center items-center text-center">Brief</div>
                </div>
                <div className="w-[120px] h-[120px] mx-auto border border-dashed border-dashed-color rounded-lg flex justify-center items-center">
                  <div className="text-gray text-sm uppercase w-1/3 flex justify-center items-center text-center">Supporting Files</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-3 w-full px-4 sm:w-2/3 lg:w-1/2 xl:w-1/3 sm:mx-auto gap-3">
        <Link to={"/job/kanban"} className="w-full">
          <button className="bg-button-1 h-9 md:h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-white-200 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm">Cancel</button>
        </Link>
        <Link to={"/job/edit/1/invoice"} className="w-full">
          <button className="bg-button-3 h-9 md:h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-white-200 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm">Next...</button>
        </Link>
        <Link className="w-full">
          <button className="bg-button-4 h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-white-100 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm">Update</button>
        </Link>
      </div>

    </div>
  )
};

export default JobDetailsForm;