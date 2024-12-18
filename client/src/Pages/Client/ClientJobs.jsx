import { useState } from "react";
import DownArrow from "../../svg/down-arrow.png";
import CheckIcon from "../../svg/check.svg";
import CloseIcon from "../../svg/close.svg";
import { Link } from "react-router-dom";

const thData = [
  'Talent',
  'Client',
  'Contact',
  'Job Title',
  'Brief Date',
  'Due Date',
  'Completion Date',
  'Invoiced',
  'Paid',
  ''
];

const ClientJobs = () => {
  const [jobList, setJobList] = useState([]);

  const sortByTalent = () => {
    console.log('sortByTalent');
  }

  const showAll = () => {
    console.log('showAll');
  }

  return (
    <div className="w-full">
      <div className="filter-box mb-5 w-full md:w-fit mx-auto grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button className="col-span-1 bg-white w-full px-2 h-10 text-center rounded-[12px] text-input font-gotham-bold tracking-wider
                            block rounded-[16px] bg-white leading-normal shadow-md transition duration-150 ease-in-out 
                            hover:bg-neutral-200 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 text-sm">Show urgent jobs
        </button>
        <button className="col-span-1 bg-white w-full px-2 h-10 text-center rounded-[12px] text-input font-gotham-bold tracking-wider
                            block rounded-[16px] bg-white leading-normal shadow-md transition duration-150 ease-in-out flex justify-center items-center
                            hover:bg-neutral-200 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 text-sm"
          onClick={sortByTalent}>
          Sort jobs by talent
          <img src={DownArrow} alt="down" className="w-4 h-3 ml-2" />
        </button>
        <input className="col-span-2 rounded-[16px] text-sm text-input shadow-md shadow-500 h-10 w-full tracking-wider text-center px-4 py-2
                          outline-none focus:border-[#d4d5d6] border-none placeholder:text-input"
          placeholder="Search" type="text" />
        <button className="col-span-1 bg-white w-full px-2 h-10 text-center rounded-[12px] text-input font-gotham-bold tracking-wider
                            block rounded-[16px] bg-white leading-normal shadow-md transition duration-150 ease-in-out 
                            hover:bg-neutral-200 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 text-sm"
          onClick={showAll}>Show all</button>
      </div>

      <div className="w-full overflow-x-auto shadow-md">
        <table className="bg-table rounded-lg shadow-md w-full">
          <thead>
            <tr className="border-b border-table">
              {thData?.map((item, index) => {
                return (<th key={index} className="text-th text-sm tracking-wider capitalize text-left px-2 py-3">{item}</th>)
              })}
            </tr>
          </thead>
          <tbody>
            {jobList?.map((item, index) => {
              return (
                <tr className="border-table border-b last:border-b-0" key={index}>
                  <td className="p-2">
                    <div className="flex justify-start items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item?.hightlightColor }}></div>
                      <span className="text-input text-sm font-gotham-regular">{item.talent?.talentName}</span>
                    </div>
                  </td>
                  <td className="p-2"><span className="text-input text-sm font-gotham-regular">{item.companyDetails?.companyName}</span></td>
                  <td className="p-2"><span className="text-input text-sm font-gotham-regular">{item.contactDetails?.firstname} {item.contactDetails?.surname}</span></td>
                  <td className="p-2"><span className="text-input text-sm font-gotham-regular">{item.jobName}</span></td>
                  <td className="p-2"><span className="text-input text-sm font-gotham-regular">{item.startDate}</span></td>
                  <td className="p-2"><span className="text-input text-sm font-gotham-regular">{item.startDate}</span></td>
                  <td className="p-2"><span className="text-input text-sm font-gotham-regular">{item.endDate}</span></td>
                  <td className="p-2">
                    <img src={item.jobStatus === 6 ? CheckIcon : CloseIcon} alt="check" className="w-3 h-3" />
                  </td>
                  <td className="p-2">
                    <img src={item.jobStatus === 7 ? CheckIcon : CloseIcon} alt="check" className="w-3 h-3" />
                  </td>
                  <td className="p-2 w-[100px] md:w-[160px]">
                    <Link to={`/job/edit/${item._id}/jobDetails`}>
                      <button className="bg-button-6 h-12 md:h-9 text-center rounded-[12px] text-white font-gotham-bold tracking-wider w-[100px] md:w-[160px]
                            block rounded leading-normal shadow-md transition duration-150 ease-in-out uppercase
                            hover:bg-[#a38b7b] hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 text-sm">See job details</button>
                    </Link>
                  </td>
                </tr>
              )
            })}
            {jobList?.length === 0 && <tr><td colSpan="10" className="text-center p-2">No data</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ClientJobs;