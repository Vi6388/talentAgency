import { useEffect, useState } from "react";
import SearchIcon from "../../svg/search.svg";
import Datepicker from "tailwind-datepicker-react";
import CalendarIcon from "../../svg/calendar_month.svg";
import DescriptionIcon from "../../svg/description.svg";
import { Link, useNavigate, useParams } from "react-router-dom";
import { baseUrl, jobFormValidateForm } from "../../utils/utils";
import { toast, ToastContainer } from "react-toastify";
import { store } from "../../redux/store";
import { CLEAN_JOB, SAVE_JOB, SAVE_JOB_DETAILS_FORM } from "../../redux/actionTypes";
import { useSelector } from "react-redux";
import { JobApi } from "../../apis/job";

const JobDetailsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
    labelColor: "",
    supplierRequired: true,
    uploadedFiles: {
      contractFile: "",
      briefFile: "",
      supportingFile: ""
    }
  });
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [uploadedList, setUploadedList] = useState([]);
  const [errors, setErrors] = useState({});
  const [fileInfo, setFileInfo] = useState({
    contractFile: {
      filename: "",
      fileSrc: "",
      isPreviewVisible: false
    },
    briefFile: {
      filename: "",
      fileSrc: "",
      isPreviewVisible: false
    },
    supportingFile: {
      filename: "",
      fileSrc: "",
      isPreviewVisible: false
    }
  });

  useEffect(() => {
    if (id) {
      JobApi.getJobById(id).then((res) => {
        if (res.data.status === 200) {
          const data = res.data.data;
          store.dispatch({ type: SAVE_JOB, payload: data });
          initialJobDetailsFormData(data);
        }
      });
    }
  }, [id]);

  const initialJobDetailsFormData = (data) => {
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
      labelColor: data?.details?.labelColor || "",
      startDate: data?.details?.startDate || "",
      endDate: data?.details?.endDate || "",
    })
  }

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

  const handleFileChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setJobDetailsForm({
      ...jobDetailsForm,
      uploadedFiles: {
        ...jobDetailsForm.uploadedFiles,
        [e.target.name]: file
      }
    });
    let list = uploadedList || [];
    let uploadFile = uploadedList?.filter((item) => item?.type === e.target.name)[0];
    if (uploadFile === undefined) {
      uploadFile = {
        filename: file?.name || "",
        path: baseUrl + "uploads/job/" + file?.name || "",
        type: e.target.name || ""
      };
      list.push(uploadFile);
    } else {
      list = uploadedList?.filter((item) => item.type !== e.target.name);
    }
    setUploadedList(list);

    if (file) {
      const reader = new FileReader();
      reader.onload = (reader) => {
        setFileInfo({
          ...fileInfo,
          [e.target.name]: {
            ...[e.target.name],
            filename: file.name,
            fileSrc: reader.target.result,
            isPreviewVisible: true
          }
        })
      };
      reader.readAsDataURL(file);
    } else {
      setFileInfo({
        ...fileInfo,
        [e.target.name]: {
          filename: "",
          fileSrc: "",
          isPreviewVisible: false
        }
      })
    }


  }

  const nextFunc = () => {
    const newErrors = jobFormValidateForm(jobDetailsForm);
    setErrors(newErrors);
    console.log(newErrors)
    if (Object.keys(newErrors).length === 0) {
      store.dispatch({ type: SAVE_JOB_DETAILS_FORM, payload: jobDetailsForm });
      if (jobDetailsForm?.id) {
        navigate("/job/edit/" + jobDetailsForm?.id + "/invoice");
      } else {
        navigate("/job/add/invoice");
      }
    } else {
      toast.error("Form submission failed due to validation errors.", {
        position: "top-left",
      });
    }
  }

  const submitJob = async () => {
    const formData = new FormData();
    // formData.append('contractFile', jobDetailsForm?.uploadedFiles?.contractFile);
    // formData.append('briefFile', jobDetailsForm?.uploadedFiles?.briefFile);
    // formData.append('supportingFile', jobDetailsForm?.uploadedFiles?.supportingFile);
    // await JobApi.uploadFiles(formData).then((res) => {
    //   if (res.data.status === 200) {
    //     const data = res.data.data;
    //     setJobDetailsForm({
    //       ...jobDetailsForm,
    //       uploadedFiles: {
    //         contractFile: data?.contractFile,
    //         briefFile: data?.briefFile,
    //         supportingFile: data?.supportingFile,
    //       }
    //     });
    //   }
    if (jobDetailsForm?.details?._id) {
      JobApi.updateJobById(jobDetailsForm?.details?._id, jobDetailsForm).then((res) => {
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
    } else {
      const data = {
        ...jobEstimate,
        details: jobDetailsForm,
      }
      JobApi.add(data).then((res) => {
        if (res.data.status === 200) {
          store.dispatch({ type: SAVE_JOB_DETAILS_FORM, payload: res.data.data });
          initialJobDetailsFormData(res.data.data);
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
    // });
  }

  const updateJob = async () => {
    if (jobDetailsForm.id) {
      const formData = new FormData();
      formData.append('contractFile', jobDetailsForm?.uploadedFiles?.contractFile);
      formData.append('briefFile', jobDetailsForm?.uploadedFiles?.briefFile);
      formData.append('supportingFile', jobDetailsForm?.uploadedFiles?.supportingFile);
      await JobApi.uploadFiles(formData).then((res) => {
        if (res.data.status === 200) {
          const data = res.data.data;
          setJobDetailsForm({
            ...jobDetailsForm,
            uploadedFiles: {
              contractFile: data?.contractFile,
              briefFile: data?.briefFile,
              supportingFile: data?.supportingFile,
            }
          });
        }
        const data = {
          ...jobEstimate,
          details: jobDetailsForm,
        }
        JobApi.updateJobById(jobDetailsForm.id, data).then((res) => {
          if (res.data.status === 200) {
            store.dispatch({ type: SAVE_JOB_DETAILS_FORM, payload: res.data.data });
            initialJobDetailsFormData(res.data.data);
            toast.success(res.data.message, {
              position: "top-left",
            });
          } else {
            toast.error(res.data.message, {
              position: "top-left",
            });
          }
        });
      });
    }
  }

  const cancelJob = async () => {
    store.dispatch({ type: CLEAN_JOB });
    navigate("/job/kanban");
  }

  return (
    <div className="mt-7 w-full bg-main">
      <ToastContainer />
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
                <div className="w-full">
                  <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm placeholder:text-[#d4d5d6] 
                                    placeholder:font-bold placeholder:uppercase ${errors.firstname ? 'border-[#ff0000] focus:ring-none' : 'border-none'} focus:border-[#d4d5d6]`}
                    placeholder="First Name" type="text" value={jobDetailsForm.firstname} name="firstname"
                    onChange={(e) => handleChange(e)} />
                </div>
                <div className="w-full">
                  <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm placeholder:text-[#d4d5d6] 
                                    placeholder:font-bold placeholder:uppercase ${errors.surname ? 'border-[#ff0000] focus:ring-none' : 'border-none'} focus:border-[#d4d5d6]`}
                    placeholder="surname"
                    type="text" value={jobDetailsForm.surname} name="surname"
                    onChange={(e) => handleChange(e)} />
                </div>
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
                                    placeholder:font-bold placeholder:uppercase ${errors.position ? 'border-[#ff0000] focus:ring-none' : 'border-none'} focus:border-[#d4d5d6]`}
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

          <div className="">
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
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm placeholder:text-[#d4d5d6] 
                                    placeholder:font-bold placeholder:uppercase ${errors.abn ? 'border-[#ff0000] focus:ring-none' : 'border-none'} focus:border-[#d4d5d6]`}
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
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm placeholder:text-[#d4d5d6] 
                                    placeholder:font-bold placeholder:uppercase ${errors.suburb ? 'border-[#ff0000] focus:ring-none' : 'border-none'} focus:border-[#d4d5d6]`}
                  placeholder="suburb"
                  type="text" value={jobDetailsForm.suburb} name="suburb"
                  onChange={(e) => handleChange(e)} />
                <div className="flex items-center justify-between gap-3 w-full">
                  <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm placeholder:text-[#d4d5d6] 
                                    placeholder:font-bold placeholder:uppercase ${errors.state ? 'border-[#ff0000] focus:ring-none' : 'border-none'} focus:border-[#d4d5d6]`}
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
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm placeholder:text-[#d4d5d6] 
                                    placeholder:font-bold placeholder:uppercase ${errors.manager ? 'border-[#ff0000] focus:ring-none' : 'border-none'} focus:border-[#d4d5d6]`}
                  placeholder="mananger"
                  type="text" value={jobDetailsForm.manager} name="manager"
                  onChange={(e) => handleChange(e)} />
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="w-full relative">
              <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase"
                placeholder="Label Color"
                type="text" value={jobDetailsForm.labelColor} readOnly />
              <input type="color" id="color-picker" value={jobDetailsForm.labelColor} className="absolute left-2 top-2 w-10 md:w-20"
                onChange={(e) => handleChange(e)} name="labelColor" />
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

      <div className="grid grid-cols-1 w-full px-4 sm:w-3/4 sm:px-0 md:w-2/3 sm:mx-auto gap-5 mt-5 lg:mt-3">
        <div className="w-full flex justify-between items-center gap-3">
          <div className="w-full">
            <label className='themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center w-fit'>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
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
                      <div className="flex items-center w-20 md:w-fit px-2">
                        <span className="text-summary-item text-sm">{item.path}</span>
                      </div>
                    </div>
                  )
                })
                : <div className="w-full text-center">No data</div>
              }
            </div>
          </div>
          <div className="col-span-1 flex flex-col justify-between">
            <div className="text-center my-3">
              <span className="text-base text-title-2 font-medium">Uploaded Files</span>
            </div>
            <div className="flex justify-between h-full">
              <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-1 lg:gap-4 md:gap-8">
                <div className="flex justify-center items-center">
                  <label className="w-[120px] h-[120px] mx-auto border border-dashed border-dashed-color rounded-lg flex justify-center items-center cursor-pointer"
                    htmlFor="contractFile">
                    {fileInfo?.contractFile?.isPreviewVisible ?
                      <img src={fileInfo?.contractFile?.fileSrc} alt="contract file" className="w-full h-full" />
                      :
                      <div className="text-gray text-sm uppercase w-1/3 flex justify-center items-center text-center">Contract</div>
                    }
                  </label>
                  <input type="file" id="contractFile" name="contractFile" onChange={handleFileChange} hidden accept="image/*" />
                </div>
                <div className="flex justify-center items-center">
                  <label className="w-[120px] h-[120px] mx-auto border border-dashed border-dashed-color rounded-lg flex justify-center items-center cursor-pointer"
                    htmlFor="briefFile">
                    {fileInfo?.briefFile?.isPreviewVisible ?
                      <img src={fileInfo?.briefFile?.fileSrc} alt="brief file" className="w-full h-full" />
                      :
                      <div className="text-gray text-sm uppercase w-1/3 flex justify-center items-center text-center">Brief</div>
                    }
                  </label>
                  <input type="file" id="briefFile" name="briefFile" onChange={handleFileChange} hidden accept="image/*" />
                </div>

                <div className="flex justify-center items-center">
                  <label className="w-[120px] h-[120px] mx-auto border border-dashed border-dashed-color rounded-lg flex justify-center items-center cursor-pointer"
                    htmlFor="supportingFile">
                    {fileInfo?.supportingFile?.isPreviewVisible ?
                      <img src={fileInfo?.supportingFile?.fileSrc} alt="brief file" className="w-full h-full" />
                      :
                      <div className="text-gray text-sm uppercase w-1/3 flex justify-center items-center text-center">Supporting Files</div>
                    }
                  </label>
                  <input type="file" id="supportingFile" name="supportingFile" onChange={handleFileChange} hidden accept="image/*" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-3 w-full px-4 sm:w-2/3 lg:w-1/2 xl:w-1/3 sm:mx-auto gap-3">
        <div className="w-full">
          <button className="bg-button-1 h-9 md:h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-white-200 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm"
            type="button" onClick={cancelJob}>Cancel</button>
        </div>
        <div className="w-full">
          <button className="bg-button-3 h-9 md:h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-white-200 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm" type="button" onClick={nextFunc}>Next...</button>
        </div>
        {
          jobDetailsForm?.id ?
            <div className="w-full">
              <button className="bg-button-4 h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-white-100 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm" type="button" onClick={updateJob}>Update</button>
            </div> :
            <div className="w-full">
              <button className="bg-button-4 h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                      block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                      hover:bg-white-100 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                      active:bg-white-100 active:shadow-md text-sm" type="button" onClick={submitJob}>Submit</button>
            </div>
        }
      </div>

    </div>
  )
};

export default JobDetailsForm;