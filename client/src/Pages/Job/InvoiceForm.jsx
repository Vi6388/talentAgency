import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddCircle from "../../svg/add_circle.svg";
import CancelIcon from "../../svg/cancel.svg";
import {  dueDateFormat, jobFormValidateForm, numberFormat } from "../../utils/utils";
import { store } from "../../redux/store";
import { CLEAN_JOB, SAVE_JOB_DETAILS_FORM, SAVE_JOB_INVOICE_LIST } from "../../redux/actionTypes";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { JobApi } from "../../apis/job";

const JobInvoiceForm = () => {
  const [invoiceForm, setInvoiceForm] = useState({
    poNumber: "",
    fee: "",
    gst: false,
    usage: "",
    asf: "",
    royalities: "",
    commission: "",
    paymentTerms: "",
    expenses: "",
    expensesDesc: "",
    miscellaneous: "",
    miscellaneousDesc: "",
    createdAt: new Date().toLocaleDateString("en-US"),
    dueDate: new Date().toLocaleDateString("en-US")
  });

  const navigate = useNavigate();
  const [invoiceList, setInvoiceList] = useState([]);
  const [errors, setErrors] = useState({});
  const { job } = useSelector(state => state.job);

  useEffect(() => {
    setInvoiceList(job?.invoiceList)
  }, [job]);

  const handleNumberChange = (e) => {
    setInvoiceForm({
      ...invoiceForm,
      [e.target.name]: numberFormat(e.target.value)
    });
  }

  const handleChange = (e) => {
    setInvoiceForm({
      ...invoiceForm,
      [e.target.name]: e.target.value
    });
  }

  const handleGst = () => {
    setInvoiceForm({
      ...invoiceForm,
      gst: !invoiceForm.gst
    })
  }

  const addInvoice = () => {
    const newErrors = jobFormValidateForm(invoiceForm);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      let list = invoiceList || [];
      list.push(invoiceForm);
      setInvoiceList(list);
      setInvoiceForm({
        poNumber: "",
        fee: "",
        gst: false,
        usage: "",
        asf: "",
        royalities: "",
        commission: "",
        paymentTerms: "",
        expenses: "",
        expensesDesc: "",
        miscellaneous: "",
        miscellaneousDesc: "",
        createdAt: new Date().toLocaleDateString("en-US"),
        dueDate: new Date().toLocaleDateString("en-US")
      });
    } else {
      toast.error("Form submission failed due to validation errors.", {
        position: "top-left",
      });
    }
  }

  const cancelInvoice = (index) => {
    const invoice = invoiceList[index];
    if (invoice) {
      if (invoiceList?.length > 1) {
        const list = invoiceList.filter((item, i) => i !== index);
        setInvoiceList(list);
      } else {
        setInvoiceList([]);
      }
    }
  }

  const nextFunc = () => {
    store.dispatch({ type: SAVE_JOB_INVOICE_LIST, payload: invoiceList });
    if (job?.details?._id) {
      navigate("/job/edit/" + job?.details?._id + "/social");
    } else {
      navigate("/job/add/social");
    }
  }

  const updateJob = () => {
    const data = {
      ...job,
      invoiceList: invoiceList
    }
    if (job?.details?._id) {
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
      });
    } else {
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
      })
    }
  }

  const cancelJob = async () => {
    store.dispatch({ type: CLEAN_JOB });
    navigate("/job/kanban");
  }

  return (
    <div className="mt-7 w-full bg-main pt-12">
      <ToastContainer />
      <div className="w-full text-center text-xl md:text-3xl mb-5">
        <span className="text-title-1 uppercase font-bold italic">finance - </span>
        <span className="text-title-2 uppercase font-bold">{job?.details?.jobName === "" ? '{ Job Name }' : job?.details?.jobName}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 w-fit mx-4 md:w-2/3 sm:mx-auto gap-8">
        <div className="col-span-1">
          <div className="flex flex-col justify-between">
            <div className="flex justify-between items-center pt-2">
              <span className="text-base text-title-2 font-gotham-medium">Job Remuneration</span>
            </div>
            <div>
              <div className="flex justify-between items-center gap-3 py-2">
                <span className="w-[15%] text-label text-sm">Po Number: </span>
                <input className={`rounded-[16px] text-input shadow-md shadow-500 h-10 w-[35%] tracking-wider text-sm text-right pr-4
                      outline-none focus:border-[#d4d5d6] placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase
                      ${errors.poNumber ? 'border-[#ff0000] focus:ring-none' : 'border-none'}`}
                  placeholder="Po Number" type="text" value={invoiceForm.poNumber} name="poNumber" onChange={(e) => handleChange(e)} />
                <span className="w-[15%] text-label text-sm">Fee: $ </span>
                <div className="relative w-[35%]">
                  <input className={`rounded-[16px] text-input shadow-md shadow-500 h-10 w-full text-right text-sm
                        outline-none focus:border-[#d4d5d6] placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase
                        ${errors.fee ? 'border-[#ff0000] focus:ring-none' : 'border-none'}`}
                    type="text" value={invoiceForm.fee} name="fee" placeholder="$" onChange={(e) => handleNumberChange(e)} />
                </div>
              </div>

              <div className="flex justify-between items-center gap-3 py-2">
                <span className="w-[15%] text-label text-sm">Gst 10%: </span>
                <div className="w-[35%]">
                  <div className="flex flex-row">
                    <div role="button" className="flex w-full items-center rounded-lg p-0 transition-all">
                      <label htmlFor="check-vertical-list-group4" className="flex w-full cursor-pointer items-center justify-end">
                        <div className="inline-flex items-center gap-2">
                          <label className="cursor-pointer text-label text-sm" htmlFor="check-vertical-list-group4">Yes</label>
                          <label className="flex items-center cursor-pointer relative" htmlFor="check-vertical-list-group4">
                            <input type="checkbox"
                              className="peer rounded-[16px] text-input shadow-md shadow-500 h-10 w-10 tracking-wider
                                          outline-none focus:border-[#d4d5d6] border-none bg-white cursor-pointer transition-all appearance-none checked:bg-white checked:border-[#d4d5d6]"
                              id="check-vertical-list-group4" checked={invoiceForm.gst} onChange={handleGst} />
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
                    <div role="button" className="flex w-full items-center rounded-lg p-0 transition-all">
                      <label htmlFor="check-vertical-list-group5" className="flex w-full cursor-pointer items-center justify-end">
                        <div className="inline-flex items-center gap-2">
                          <label className="cursor-pointer text-label text-sm" htmlFor="check-vertical-list-group5">No</label>
                          <label className="flex items-center cursor-pointer relative" htmlFor="check-vertical-list-group5">
                            <input type="checkbox"
                              className="peer rounded-[16px] text-input shadow-md shadow-500 h-10 w-10 tracking-wider text-sm text-right
                                          outline-none focus:border-[#d4d5d6] border-none bg-white cursor-pointer transition-all appearance-none checked:bg-white checked:border-[#d4d5d6]"
                              id="check-vertical-list-group5" checked={!invoiceForm.gst} onChange={handleGst} />
                            <span className="absolute text-black opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor"
                                stroke="currentColor" strokeWidth="1">
                                <path fillRule="evenodd"
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
                <span className="w-[15%] text-label text-sm">Usage: </span>
                <div className="relative w-[35%]">
                  <input className={`rounded-[16px] text-input shadow-md shadow-500 h-10 w-full tracking-wider text-sm text-right
                        outline-none focus:border-[#d4d5d6] placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase
                        ${errors.usage ? 'border-[#ff0000] focus:ring-none' : 'border-none'}`}
                    type="text" value={invoiceForm.usage} name="usage" placeholder="$" onChange={(e) => handleNumberChange(e)} />
                </div>
              </div>

              <div className="flex justify-between items-center gap-3 py-2">
                <span className="w-[15%] text-label text-sm">Asf: </span>
                <div className="relative w-[35%]">
                  <input className={`rounded-[16px] text-input shadow-md shadow-500 h-10 w-full tracking-wider text-sm text-right
                        outline-none focus:border-[#d4d5d6] placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase
                        ${errors.asf ? 'border-[#ff0000] focus:ring-none' : 'border-none'}`}
                    type="text" value={invoiceForm.asf} name="asf" placeholder="%" onChange={(e) => handleNumberChange(e)} />
                </div>
                <span className="w-[15%] text-label text-sm">Royalities: </span>
                <div className="relative w-[35%]">
                  <input className={`rounded-[16px] text-input shadow-md shadow-500 h-10 w-full tracking-wider text-sm text-right
                        outline-none focus:border-[#d4d5d6] placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase
                        ${errors.royalities ? 'border-[#ff0000] focus:ring-none' : 'border-none'}`}
                    type="text" value={invoiceForm.royalities} name="royalities" placeholder="$" onChange={(e) => handleNumberChange(e)} />
                </div>
              </div>

              <div className="flex justify-between items-center gap-3 py-2">
                <span className="w-[15%] text-label text-sm">Commission: </span>
                <div className="relative w-[35%]">
                  <input className={`rounded-[16px] text-input shadow-md shadow-500 h-10 w-full tracking-wider text-sm text-right
                        outline-none focus:border-[#d4d5d6] placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase
                        ${errors.commission ? 'border-[#ff0000] focus:ring-none' : 'border-none'}`}
                    type="text" value={invoiceForm.commission} name="commission" placeholder="%" onChange={(e) => handleNumberChange(e)} />
                </div>
                <span className="w-[15%] text-label text-sm">Payment Terms: </span>
                <div className="relative w-[35%]">
                  <input className={`rounded-[16px] text-input shadow-md shadow-500 h-10 w-full tracking-wider text-sm text-right
                        outline-none focus:border-[#d4d5d6] placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase
                        ${errors.paymentTerms ? 'border-[#ff0000] focus:ring-none' : 'border-none'}`}
                    type="text" value={invoiceForm.paymentTerms} name="paymentTerms" placeholder="Days" onChange={(e) => handleNumberChange(e)} />
                </div>
              </div>

              <div className="flex justify-between py-2 gap-3">
                <span className="w-[15%] text-label text-sm mt-2.5">Expenses: </span>
                <div className="w-[85%] flex flex-col justify-start items-center gap-2">
                  <div className="w-full relative">
                    <input className={`rounded-[16px] text-input shadow-md shadow-500 h-10 w-full tracking-wider text-sm text-right
                        outline-none focus:border-[#d4d5d6] placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase
                        ${errors.expenses ? 'border-[#ff0000] focus:ring-none' : 'border-none'}`}
                      type="text" value={invoiceForm.expenses} name="expenses" placeholder="$" onChange={(e) => handleNumberChange(e)} />
                  </div>
                  <div className="w-full">
                    <textarea className={`rounded-[16px] text-input shadow-md shadow-500 h-full w-full tracking-wider text-sm placeholder:text-center resize-none
                        outline-none focus:border-[#d4d5d6] placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase
                        ${errors.expensesDesc ? 'border-[#ff0000] focus:ring-none' : 'border-none'}`}
                      placeholder="expenses"
                      type="text" value={invoiceForm.expensesDesc} name="expensesDesc" rows={4} onChange={(e) => handleChange(e)} />
                  </div>
                </div>
              </div>

              <div className="flex justify-between py-2 gap-3">
                <span className="w-[15%] text-label text-sm mt-2.5">Miscellaneous: </span>
                <div className="w-[85%] flex flex-col justify-start items-center gap-2">
                  <div className="w-full relative">
                    <input className={`rounded-[16px] text-input shadow-md shadow-500 h-10 w-full tracking-wider text-sm text-right
                        outline-none focus:border-[#d4d5d6] placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase
                        ${errors.miscellaneous ? 'border-[#ff0000] focus:ring-none' : 'border-none'}`}
                      type="text" value={invoiceForm.miscellaneous} name="miscellaneous" placeholder="$" onChange={(e) => handleNumberChange(e)} />
                  </div>
                  <div className="w-full">
                    <textarea className={`rounded-[16px] text-input shadow-md shadow-500 h-full w-full tracking-wider text-sm placeholder:text-center resize-none
                        outline-none focus:border-[#d4d5d6] placeholder:text-[#d4d5d6] placeholder:font-bold placeholder:uppercase
                        ${errors.miscellaneousDesc ? 'border-[#ff0000] focus:ring-none' : 'border-none'}`}
                      placeholder="miscellaneous"
                      type="text" value={invoiceForm.miscellaneousDesc} name="miscellaneousDesc" rows={4} onChange={(e) => handleChange(e)} />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex justify-end items-center mt-10 ">
              <button className="w-fit flex gap-2 cursor-pointer hover:text-decoration" onClick={addInvoice}>
                <span className="text-estimateDate text-sm font-semibold">Add to invoice list</span>
                <img src={AddCircle} alt="add" />
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <div className="flex flex-col justify-between items-center h-full w-full">
            <div className="w-full pt-2">
              <span className="text-base text-title-2 font-gotham-medium">Invoice Summary</span>
            </div>
            <div className="rounded-[16px] shadow-md shadow-500 h-full min-h-[160px] w-full tracking-wider text-md bg-white px-5 py-2">
              {invoiceList?.length > 0 ?
                invoiceList?.map((item, index) => {
                  return (
                    <div className="flex justify-between items-center border-b divider-line-color py-1 md:py-3"
                      key={index}>
                      <div className="flex items-center text-summary-item text-[12px] md:text-[15px] font-semibold">
                        Invoice - {item.poNumber}
                      </div>
                      <div className="flex items-center gap-5">
                        <span className="text-summary-item text-[12px] md:text-[15px] font-semibold">DUE: {dueDateFormat(item.createdAt)}</span>
                        <button onClick={() => cancelInvoice(index)}>
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
                        hover:bg-gray-300 hover:shadow-md focus:bg-gray-400 focus:shadow-md focus:outline-none focus:ring-0 text-sm"
            type="button" onClick={cancelJob}>Cancel</button>
        </div>
        <Link to={job?.details?._id ? `/job/edit/${job?.details?._id}/jobDetails` : "/job/add/jobDetails"} className="w-full">
          <button className="bg-button-2 h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-[#afa098] hover:shadow-md focus:bg-[#6a5b53] focus:shadow-md focus:outline-none focus:ring-0 text-sm">Previous</button>
        </Link>
        <div className="w-full">
          <button className="bg-button-3 h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-[#9b8579] hover:shadow-md focus:bg-[#664838] focus:shadow-md focus:outline-none focus:ring-0 text-sm"
            type="button" onClick={nextFunc}>Next...</button>
        </div>
        <div className="w-full">
          <button className="bg-button-4 h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-slate-700 hover:shadow-md focus:bg-slate-800 focus:shadow-md focus:outline-none focus:ring-0 text-sm"
            type="button" onClick={updateJob}>Update</button>
        </div>
      </div>

    </div>
  )
};

export default JobInvoiceForm;