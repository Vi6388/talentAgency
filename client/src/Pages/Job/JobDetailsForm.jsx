import { useEffect, useRef, useState } from "react";
import SearchIcon from "../../svg/search.svg";
import Datepicker from "tailwind-datepicker-react";
import CalendarIcon from "../../svg/calendar_month.svg";
import DescriptionIcon from "../../svg/description.svg";
import { Link, useNavigate, useParams } from "react-router-dom";
import { convertDueDate, dueDateFormat } from "../../utils/utils";
import { toast, ToastContainer } from "react-toastify";
import { store } from "../../redux/store";
import { CHANGE_IS_LOADING, CLEAN_JOB, SAVE_JOB, SAVE_JOB_DETAILS_FORM } from "../../redux/actionTypes";
import { useSelector } from "react-redux";
import { JobApi } from "../../apis/job";
import { TalentApi } from "../../apis/TalentApi";

const JobDetailsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { job } = useSelector((state) => state.job);
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
    talentEmail: "",
    manager: "",
    startDate: "",
    endDate: "",
    labelColor: "",
    supplierRequired: false,
    uploadedFiles: {
      contractFile: "",
      briefFile: "",
      supportingFile: ""
    }
  });
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [uploadedList, setUploadedList] = useState([]);
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

  const [talentList, setTalentList] = useState([]);
  const [talentSearchList, setTalentSearchList] = useState([]);
  const [showTalentList, setShowTalentList] = useState(false);

  const startDatePickerRef = useRef(null);
  const endDatePickerRef = useRef(null);

  useEffect(() => {
    if (id) {
      store.dispatch({ type: CHANGE_IS_LOADING, payload: true });
      JobApi.getJobById(id).then((res) => {
        if (res.data.status === 200) {
          const data = res.data.data;
          store.dispatch({ type: SAVE_JOB, payload: data });
          initialJobDetailsFormData(data);
        } else {
          toast.error(res.data.message, {
            position: "top-left",
          });
        }
        store.dispatch({ type: CHANGE_IS_LOADING, payload: false });
      });
    } else {
      initialJobDetailsFormData(job);
    }

    getTalentList();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (startDatePickerRef.current && !startDatePickerRef.current.contains(event.target)) {
        setShowStart(false); // Hide the start date picker
      }
      if (endDatePickerRef.current && !endDatePickerRef.current.contains(event.target)) {
        setShowEnd(false); // Hide the end date picker
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getTalentList = () => {
    TalentApi.getTalentList().then((res) => {
      if (res.data.status === 200) {
        setTalentList(res.data.data);
        setTalentSearchList(res.data.data);
      }
    });
  }

  const initialJobDetailsFormData = (data) => {
    setJobDetailsForm({
      ...data?.details,
      id: data?.details?._id,
      firstname: data?.details?.contactDetails?.firstname || (data?.details?.firstname || ""),
      surname: data?.details?.contactDetails?.surname || (data?.details?.surname || ""),
      email: data?.details?.contactDetails?.email || (data?.details?.email || ""),
      position: data?.details?.contactDetails?.position || (data?.details?.position || ""),
      phoneNumber: data?.details?.contactDetails?.phoneNumber || (data?.details?.phoneNumber || ""),
      companyName: data?.details?.companyDetails?.companyName || (data?.details?.companyName || ""),
      abn: data?.details?.companyDetails?.abn || (data?.details?.abn || ""),
      postalAddress: data?.details?.companyDetails?.postalAddress || (data?.details?.postalAddress || ""),
      suburb: data?.details?.companyDetails?.suburb || (data?.details?.suburb || ""),
      state: data?.details?.companyDetails?.state || (data?.details?.state || ""),
      postcode: data?.details?.companyDetails?.postcode || (data?.details?.postcode || ""),
      jobName: data?.details?.jobName || (data?.details?.jobName || ""),
      talentName: data?.details?.talent?.talentName || (data?.details?.talentName || ""),
      talentEmail: data?.details?.talent?.email || (data?.details?.talentEmail || ""),
      talentPhoneNumber: data?.details?.talent?.phoneNumber || (data?.details?.talentPhoneNumber || ""),
      manager: data?.details?.talent?.manager || (data?.details?.manager || ""),
      labelColor: data?.details?.labelColor || (data?.details?.labelColor || ""),
      startDate: id ? data?.details?.startDate : (data?.details?.startDate ? dueDateFormat(convertDueDate(data?.details?.startDate)) : ""),
      endDate: id ? data?.details?.endDate : (data?.details?.endDate ? dueDateFormat(convertDueDate(data?.details?.endDate)) : ""),
      supplierRequired: data?.details?.supplierRequired || (data?.details?.supplierRequired || false),
    });

    const uploadedFiles = data?.details?.uploadedFiles;
    let list = [];
    if (uploadedFiles?.contractFile) {
      if (data?.details?._id) {
        list.push({ filename: uploadedFiles?.contractFile.split('/').pop(), path: uploadedFiles?.contractFile, type: 'contract' })
      } else {
        list.push({ filename: uploadedFiles?.contractFile?.name, path: uploadedFiles?.contractFile?.name, type: 'contract' })
      }
    }
    if (uploadedFiles?.briefFile) {
      if (data?.details?._id) {
        list.push({ filename: uploadedFiles?.briefFile.split('/').pop(), path: uploadedFiles?.briefFile, type: 'brief' })
      } else {
        list.push({ filename: uploadedFiles?.briefFile?.name, path: uploadedFiles?.briefFile?.name, type: 'brief' })
      }
    }
    if (uploadedFiles?.supportingFile) {
      if (data?.details?._id) {
        list.push({ filename: uploadedFiles?.supportingFile.split('/').pop(), path: uploadedFiles?.supportingFile, type: 'supporting' })
      } else {
        list.push({ filename: uploadedFiles?.supportingFile?.name, path: uploadedFiles?.supportingFile?.name, type: 'supporting' })
      }
    }
    setUploadedList(list);
  }

  const handleChange = (e) => {
    setJobDetailsForm({
      ...jobDetailsForm,
      [e.target.name]: e.target.value
    });
    if (e.target.name === "talentName") {
      if (e.target.value !== "") {
        const list = talentList?.filter((item) => (item?.firstname?.toLowerCase()?.includes(e.target.value?.toLowerCase()) ||
          item?.surname?.toLowerCase()?.includes(e.target.value?.toLowerCase()) || item?.email?.toLowerCase()?.includes(e.target.value?.toLowerCase())));
        setTalentSearchList(list);
        setShowTalentList(true);
      } else {
        setTalentSearchList(talentList);
        setShowTalentList(false);
      }
    }
  }

  const focusTalent = () => {
    setShowTalentList(!showTalentList);
  }

  const changeTalent = (item) => {
    const data = {
      ...jobDetailsForm,
      talentName: item.firstname + " " + item.surname,
      talentEmail: item.email,
      talentPhoneNumber: item.phoneNumber
    }
    setJobDetailsForm(data);
    setTalentSearchList(talentList);
    setShowTalentList(false);
  }

  const handleStartDateChange = (selectedDate) => {
    setJobDetailsForm({
      ...jobDetailsForm,
      startDate: dueDateFormat(new Date(selectedDate))
    })
  }

  const handleEndDateChange = (selectedDate) => {
    setJobDetailsForm({
      ...jobDetailsForm,
      endDate: dueDateFormat(new Date(selectedDate))
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
    todayBtn: false,
    clearBtn: false,
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
    todayBtn: false,
    clearBtn: false,
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
    list = uploadedList?.filter((item) => item.type !== e.target.name);
    let uploadFile = {
      filename: file?.name || "",
      path: file?.name || "",
      type: e.target.name || ""
    };
    list.push(uploadFile);
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
    store.dispatch({ type: SAVE_JOB_DETAILS_FORM, payload: jobDetailsForm });
    if (jobDetailsForm?.id) {
      navigate("/job/edit/" + jobDetailsForm?.id + "/invoice");
    } else {
      navigate("/job/add/invoice");
    }
  }

  const submitJob = async () => {
    const formData = new FormData();
    if (jobDetailsForm?.uploadedFiles) {
      const { contractFile, briefFile, supportingFile } = jobDetailsForm.uploadedFiles;

      // Check if files are valid before appending
      if (contractFile instanceof File) {
        formData.append('contractFile', contractFile);
      }
      if (briefFile instanceof File) {
        formData.append('briefFile', briefFile);
      }
      if (supportingFile instanceof File) {
        formData.append('supportingFile', supportingFile);
      }
    }
    formData.append('talentName', jobDetailsForm?.talentName);
    if (jobDetailsForm?.jobName !== "" || jobDetailsForm?.jobName?.trim() !== "") {
      store.dispatch({ type: CHANGE_IS_LOADING, payload: true });
      await JobApi.uploadFiles(formData).then((res) => {
        if (res.data.status === 200) {
          const data = res.data.data;
          const contractFile = data?.filter((item) => item.key === "contractFile")[0];
          const briefFile = data?.filter((item) => item.key === "briefFile")[0];
          const supportingFile = data?.filter((item) => item.key === "supportingFile")[0];
          setJobDetailsForm({
            ...jobDetailsForm,
            uploadedFiles: {
              contractFile: contractFile?.url || "",
              briefFile: briefFile?.url || "",
              supportingFile: supportingFile?.url || "",
            }
          });

          const updateData = {
            ...job,
            details: {
              ...jobDetailsForm,
              uploadedFiles: {
                contractFile: contractFile?.url || "",
                briefFile: briefFile?.url || "",
                supportingFile: supportingFile?.url || "",
              }
            },
          }
          if (jobDetailsForm?.details?._id) {
            JobApi.updateJobById(jobDetailsForm?.details?._id, updateData).then((res) => {
              if (res.data.status === 401) {
                window.location.href = process.env.REACT_APP_API_BACKEND_URL + res.data.redirectUrl;
              } else if (res.data.status === 200) {
                store.dispatch({ type: SAVE_JOB_DETAILS_FORM, payload: res.data.data });
                toast.success(res.data.message, {
                  position: "top-left",
                });
                setTimeout(() => {
                  navigate("/calendar");
                }, 2000);
              } else {
                toast.error(res.data.message, {
                  position: "top-left",
                });
              }
              store.dispatch({ type: CHANGE_IS_LOADING, payload: false });
            })
          } else {
            JobApi.add(updateData).then((res) => {
              if (res.data.status === 401) {
                window.location.href = process.env.REACT_APP_API_BACKEND_URL + res.data.redirectUrl;
              } else if (res.data.status === 200) {
                store.dispatch({ type: SAVE_JOB_DETAILS_FORM, payload: res.data.data });
                initialJobDetailsFormData({ details: res.data.data });
                toast.success(res.data.message, {
                  position: "top-left",
                });
                setTimeout(() => {
                  navigate("/calendar");
                }, 2000);
              } else {
                toast.error(res.data.message, {
                  position: "top-left",
                });
              }
              store.dispatch({ type: CHANGE_IS_LOADING, payload: false });
            })
          }
        } else {
          store.dispatch({ type: CHANGE_IS_LOADING, payload: false });
        }
      });
    }
  }

  const updateJob = async () => {
    if (jobDetailsForm.id) {
      const formData = new FormData();
      if (jobDetailsForm?.uploadedFiles) {
        const { contract, brief, supporting } = jobDetailsForm.uploadedFiles;

        // Check if files are valid before appending
        if (contract instanceof File) {
          formData.append('contractFile', contract);
        }
        if (brief instanceof File) {
          formData.append('briefFile', brief);
        }
        if (supporting instanceof File) {
          formData.append('supportingFile', supporting);
        }
      }
      formData.append('talentName', jobDetailsForm?.talentName);
      store.dispatch({ type: CHANGE_IS_LOADING, payload: true });
      await JobApi.uploadFiles(formData).then((res) => {
        if (res.data.status === 200) {
          const data = res.data.data;
          const contractFile = data?.filter((item) => item.key === "contractFile")[0];
          const briefFile = data?.filter((item) => item.key === "briefFile")[0];
          const supportingFile = data?.filter((item) => item.key === "supportingFile")[0];
          setJobDetailsForm({
            ...jobDetailsForm,
            uploadedFiles: {
              contractFile: contractFile?.url || "",
              briefFile: briefFile?.url || "",
              supportingFile: supportingFile?.url || "",
            }
          });

          const updateData = {
            ...job,
            details: {
              ...jobDetailsForm,
              uploadedFiles: {
                contractFile: contractFile?.url || "",
                briefFile: briefFile?.url || "",
                supportingFile: supportingFile?.url || "",
              }
            },
          }
          JobApi.updateJobById(jobDetailsForm.id, updateData).then((res) => {
            if (res.data.status === 401) {
              const authUrl = process.env.REACT_APP_API_BACKEND_URL + res.data.redirectUrl;
              openAuthPopup(authUrl, () => retryCreateCalendarEvent(updateData));
            } else {
              if (res.data.status === 200) {
                store.dispatch({ type: SAVE_JOB_DETAILS_FORM, payload: res.data.data });
                initialJobDetailsFormData({ details: res.data.data });
                toast.success(res.data.message, {
                  position: "top-left",
                });
                setTimeout(() => {
                  navigate("/calendar");
                }, 2000);
              } else {
                toast.error(res.data.message, {
                  position: "top-left",
                });
              }
            }
            store.dispatch({ type: CHANGE_IS_LOADING, payload: false });
          });
        } else {
          store.dispatch({ type: CHANGE_IS_LOADING, payload: false });
        }
      });
    }
  }

  const openAuthPopup = (url, retryCallback) => {
    const width = 600;
    const height = 700;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    const popup = window.open(url, '_blank', 'OAuth Popup', `width=${width},height=${height},top=${top},left=${left}`);

    // Poll for the popup to close and then retry the calendar event creation
    const interval = setInterval(() => {
      if (popup.closed) {
        clearInterval(interval);
        navigate(-2);
        retryCallback(); // Once popup is closed, retry creating the event
      } else {
        navigate(-2);
      }
    }, 1000);
  };

  const retryCreateCalendarEvent = async (updateData) => {
    try {
      JobApi.updateJobById(jobDetailsForm.id, updateData).then((res) => {
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
    } catch (error) {
      toast.error('Error creating event: ' + error.message);
    }
  };

  const cancelJob = async () => {
    store.dispatch({ type: CLEAN_JOB });
    navigate("/job/kanban");
  }

  return (
    <div className="mt-7 w-full bg-main relative pt-12">
      <ToastContainer />
      <div className="w-full text-center text-xl md:text-3xl mb-5">
        <span className="text-title-1 uppercase font-gotham-bold italic">{jobDetailsForm.jobName === "" ? "new job -" : ""} </span>
        <span className="text-title-2 uppercase font-gotham-bold">{jobDetailsForm.jobName === "" ? 'Details' : jobDetailsForm.jobName}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 w-fit mx-4 md:w-2/3 sm:mx-auto gap-12">
        <div className="col-span-1">
          <div className="mb-3">
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-title-2 font-gotham-medium">Contact Details</span>
              <img src={SearchIcon} className="w-5 h-5" alt="search icon" />
            </div>
            <div>
              <div className="flex justify-between items-center gap-3 py-2">
                <div className="w-full">
                  <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm border-none focus:border-[#d4d5d6]`}
                    placeholder="First Name" type="text" value={jobDetailsForm.firstname} name="firstname"
                    onChange={(e) => handleChange(e)} />
                </div>
                <div className="w-full">
                  <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm border-none focus:border-[#d4d5d6]`}
                    placeholder="surname"
                    type="text" value={jobDetailsForm.surname} name="surname"
                    onChange={(e) => handleChange(e)} />
                </div>
              </div>
              <div className="flex justify-center items-center py-2">
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm border-none focus:border-[#d4d5d6]`}
                  placeholder="Email Address"
                  type="text" value={jobDetailsForm.email} name="email"
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="flex justify-between items-center gap-3 py-2">
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm border-none focus:border-[#d4d5d6]`}
                  placeholder="position"
                  type="text" value={jobDetailsForm.position} name="position"
                  onChange={(e) => handleChange(e)} />
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm border-none focus:border-[#d4d5d6]`}
                  placeholder="phone Number"
                  type="text" value={jobDetailsForm.phoneNumber} name="phoneNumber"
                  onChange={(e) => handleChange(e)} />
              </div>
            </div>
          </div>

          <div className="">
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-title-2 font-gotham-medium">Company Details</span>
              <img src={SearchIcon} className="w-5 h-5" alt="search icon" />
            </div>
            <div>
              <div className="flex justify-between items-center gap-3 py-2">
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm border-none focus:border-[#d4d5d6]`}
                  placeholder="Company Name"
                  type="text" value={jobDetailsForm.companyName} name="companyName"
                  onChange={(e) => handleChange(e)} />
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm border-none focus:border-[#d4d5d6]`}
                  placeholder="abn"
                  type="text" value={jobDetailsForm.abn} name="abn"
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="flex justify-center items-center py-2">
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm border-none focus:border-[#d4d5d6]`}
                  placeholder="Postal Address"
                  type="text" value={jobDetailsForm.postalAddress} name="postalAddress"
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="flex justify-between items-center gap-3 py-2">
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm border-none focus:border-[#d4d5d6]`}
                  placeholder="suburb"
                  type="text" value={jobDetailsForm.suburb} name="suburb"
                  onChange={(e) => handleChange(e)} />
                <div className="flex items-center justify-between gap-3 w-full">
                  <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm border-none focus:border-[#d4d5d6]`}
                    placeholder="State"
                    type="text" value={jobDetailsForm.state} name="state"
                    onChange={(e) => handleChange(e)} />
                  <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm border-none focus:border-[#d4d5d6]`}
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
              <span className="text-sm text-title-2 font-gotham-medium">Job Name</span>
            </div>
            <div>
              <div className="flex justify-between items-center gap-3 py-2">
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm border-none focus:border-[#d4d5d6]`}
                  placeholder="job name"
                  type="text" value={jobDetailsForm.jobName} name="jobName"
                  onChange={(e) => handleChange(e)} />
              </div>
            </div>
          </div>
          <div className="mb-3 w-full">
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-title-2 font-gotham-medium">Talent</span>
            </div>
            <div>
              <div className="flex justify-between items-center gap-3 py-2 relative">
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm border-none focus:border-[#d4d5d6]`}
                  placeholder="talent name"
                  type="text" value={jobDetailsForm.talentName} name="talentName"
                  onChange={(e) => handleChange(e)} onFocus={focusTalent} />

                <div className={`absolute top-[50px] w-full shadow-xl z-10 rounded-lg ${showTalentList ? 'block' : 'hidden'}`}>
                  <ul className="bg-white rounded-lg w-full">
                    {talentSearchList?.map((item, index) =>
                      <li key={index} className={`p-3 hover:bg-[#f1f1f1] text-input ${index < talentList?.length ? 'border-b' : ''}`} onClick={() => changeTalent(item)}>
                        {item.firstname + " " + item.surname} ({item.email})
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              <div className="flex justify-between items-center gap-3 py-2">
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm border-none focus:border-[#d4d5d6]`}
                  placeholder="mananger"
                  type="text" value={jobDetailsForm.manager} name="manager"
                  onChange={(e) => handleChange(e)} />
              </div>
            </div>
          </div>
          <div className="mb-3 w-full">
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-title-2 font-gotham-medium">Ambassadorship</span>
            </div>
            <div className="grid grid-cols-2 w-full gap-3 py-2">
              <div className="col-span-1 w-full flex justify-between items-center relative" ref={startDatePickerRef}>
                <Datepicker options={startDateOptions} onChange={handleStartDateChange} show={showStart} setShow={(state) => handleState("setShowStart", state)}>
                  <div className="relative">
                    <input type="text" className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] placeholder:text-[#d4d5d6] font-gotham-regular placeholder:font-gotham-bold placeholder:uppercase border-none`}
                      placeholder="Start Date" value={jobDetailsForm.startDate} onFocus={() => setShowStart(true)} readOnly />
                    <div className="absolute top-1.5 right-2">
                      <img src={CalendarIcon} alt="calendar" />
                    </div>
                  </div>
                </Datepicker>
              </div>
              <div className="col-span-1 w-full justify-between items-center relative" ref={endDatePickerRef}>
                <Datepicker options={endDateOptions} onChange={handleEndDateChange} show={showEnd} setShow={(state) => handleState("setShowEnd", state)}>
                  <div className="relative">
                    <input type="text" className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] placeholder:text-[#d4d5d6] font-gotham-regular placeholder:font-gotham-bold placeholder:uppercase border-none`}
                      placeholder="End Date" value={jobDetailsForm.endDate} onFocus={() => setShowEnd(true)} readOnly />
                    <div className="absolute top-1.5 right-2">
                      <img src={CalendarIcon} alt="calendar" />
                    </div>
                  </div>
                </Datepicker>
              </div>
            </div>
            <div className="w-full pt-2">
              <div className="w-full relative">
                <input className={`rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] placeholder:text-[#d4d5d6] font-gotham-regular placeholder:font-gotham-bold placeholder:uppercase border-none`}
                  placeholder="Label Color"
                  type="text" value={jobDetailsForm.labelColor} readOnly />
                <input type="color" id="color-picker" value={jobDetailsForm.labelColor} className="absolute left-2 top-2 w-10 md:w-20"
                  onChange={(e) => handleChange(e)} name="labelColor" />
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
              <span className={`slider mr-4 flex h-8 w-[60px] items-center rounded-full p-0.5 duration-200 border-button-3  ${jobDetailsForm.supplierRequired ? 'bg-button-3 hover:shadow-md' : 'bg-white'}`}>
                <span className={`dot h-6 w-6 rounded-full duration-200 ${jobDetailsForm.supplierRequired ? 'translate-x-[28px] bg-white' : 'bg-button-3 hover:shadow-md'}`}></span>
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
              <span className="text-sm text-title-2 font-gotham-medium">Uploaded Files</span>
            </div>
            <div className="rounded-[16px] shadow-md shadow-500 w-full tracking-wider text-md bg-white px-3 py-1 h-[120px]">
              {uploadedList?.length > 0 ?
                uploadedList?.map((item, index) => {
                  return (
                    <div className="flex justify-between items-center border-b divider-line-color py-2 overflow-hidden"
                      key={index}>
                      <div className="flex items-center gap-1 overflow-hidden w-1/2">
                        <img src={DescriptionIcon} alt="file" className="w-4 h-4" />
                        <span className="text-summary-item text-sm capitalize">{item.type} file name</span>
                      </div>
                      <div className="flex items-center w-20 px-2 overflow-hidden w-full justify-end">
                        {item?.path?.includes("storage.googleapis.com") ?
                          <Link className="text-summary-item text-sm hover:underline" title={item.path} to={item.path} target="_blank">{item.path}</Link> :
                          <div className="text-summary-item text-sm cursor-pointer">{item.path}</div>
                        }
                      </div>
                    </div>
                  )
                })
                : <div className="w-full flex items-center justify-center h-full font-gotham-medium text-gray">No data</div>
              }
            </div>
          </div>
          <div className="col-span-1 flex flex-col justify-between">
            <div className="text-center my-3">
              <span className="text-sm text-title-2 font-gotham-medium">Uploaded Files</span>
            </div>
            <div className="flex justify-between h-full">
              <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-1 lg:gap-4 md:gap-8">
                <div className="flex justify-center items-center">
                  <label className="w-full min:w-[120px] h-[120px] mx-auto border-2 border-dashed border-dashed-color rounded-lg flex justify-center items-center cursor-pointer"
                    htmlFor="contractFile">
                    <div className="text-gray text-sm font-gotham-medium uppercase w-1/3 flex justify-center items-center text-center">Contract</div>
                  </label>
                  <input type="file" id="contractFile" name="contract" onChange={handleFileChange} hidden accept="*" />
                </div>
                <div className="flex justify-center items-center">
                  <label className="w-full min:w-[120px] h-[120px] mx-auto border-2 border-dashed border-dashed-color rounded-lg flex justify-center items-center cursor-pointer"
                    htmlFor="briefFile">
                    <div className="text-gray text-sm font-gotham-medium uppercase w-1/3 flex justify-center items-center text-center">Brief</div>
                  </label>
                  <input type="file" id="briefFile" name="brief" onChange={handleFileChange} hidden accept="*" />
                </div>

                <div className="flex justify-center items-center">
                  <label className="w-full min:w-[120px] h-[120px] mx-auto border-2 border-dashed border-dashed-color rounded-lg flex justify-center items-center cursor-pointer"
                    htmlFor="supportingFile">
                    <div className="text-gray text-sm font-gotham-medium uppercase w-1/3 flex justify-center items-center text-center">Supporting Files</div>
                  </label>
                  <input type="file" id="supportingFile" name="supporting" onChange={handleFileChange} hidden accept="*" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-3 w-full px-4 sm:w-2/3 lg:w-1/2 xl:w-1/3 sm:mx-auto gap-3">
        <div className="w-full">
          <button className="bg-button-1 h-9 md:h-10 tracking-wider text-center rounded-[12px] text-white font-gotham-bold px-3
                        block rounded leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-gray-300 hover:shadow-md focus:bg-gray-400 focus:shadow-md focus:outline-none focus:ring-0 text-sm"
            type="button" onClick={cancelJob}>Cancel</button>
        </div>
        <div className="w-full">
          <button className="bg-button-3 h-9 md:h-10 tracking-wider text-center rounded-[12px] text-white font-gotham-bold px-3
                        block rounded leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-[#9b8579] hover:shadow-md focus:bg-[#664838] focus:shadow-md focus:outline-none focus:ring-0 text-sm"
            type="button" onClick={nextFunc}>Next...</button>
        </div>
        {
          jobDetailsForm?.id ?
            <div className="w-full">
              <button className="bg-button-4 h-10 tracking-wider text-center rounded-[12px] text-white font-gotham-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-slate-700 hover:shadow-md focus:bg-slate-800 focus:shadow-md focus:outline-none focus:ring-0 text-sm"
                type="button" onClick={updateJob}>Update</button>
            </div> :
            <div className="w-full">
              <button className="bg-button-4 h-10 tracking-wider text-center rounded-[12px] text-white font-gotham-bold px-3
                      block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                      hover:bg-slate-700 hover:shadow-md focus:bg-slate-800 focus:shadow-md focus:outline-none focus:ring-0 text-sm"
                type="button" onClick={submitJob}>Submit</button>
            </div>
        }
      </div>

    </div>
  )
};

export default JobDetailsForm;