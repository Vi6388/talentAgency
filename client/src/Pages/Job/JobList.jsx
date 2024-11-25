import { useEffect, useState } from "react";
import CheckIcon from "../../svg/check.svg";
import CloseIcon from "../../svg/close.svg";
import { Link } from "react-router-dom";
import { JobApi } from "../../apis/job";
import { store } from "../../redux/store";
import { CHANGE_IS_LOADING } from "../../redux/actionTypes";
import DownArrow from "../../svg/down-arrow.png";
import { TalentApi } from "../../apis/TalentApi";

const thData = [
  'talent',
  'client',
  'contact',
  'job title',
  'brief date',
  'due date',
  'completion date',
  'invoiced',
  'paid',
  ''
];

const JobList = () => {
  const [list, setList] = useState([]);
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState("desc");
  useEffect(() => {
    TalentApi.getTalentList().then((res) => {
      if (res.data.status === 200) {
        getJobList(res.data.data);
      } else {
        getJobList([]);
      }
    });    
  }, []);

  const getJobList = (talentList) => {
    store.dispatch({ type: CHANGE_IS_LOADING, payload: true });
    JobApi.list(sort, order).then((res) => {
      if (res.data.status === 200) {
        let list = [];
        res?.data?.data?.map((item) => {
          const hightlightColor = talentList.filter(talent => talent.email === item.talent?.email)[0]?.highlightColor;
          const data = {
            ...item,
            hightlightColor: hightlightColor
          };
          list.push(data);
        });
        setList(list);
      }
      store.dispatch({ type: CHANGE_IS_LOADING, payload: false });
    })
  }

  const sortByTalent = () => {
    setSort("talent");
    setOrder(order === "desc" ? "asc" : "desc");
    getJobList();
  }

  const sortByClient = () => {
    setSort("client");
    setOrder(order === "desc" ? "asc" : "desc");
    getJobList();
  }

  const showAll = () => {
    setSort("createdAt");
    setOrder("desc");
    getJobList();
  }

  return (
    <div className="p-5 flex flex-col h-full bg-main">
      <div className="filter-box mb-5 w-full md:w-fit mx-auto grid grid-cols-3 sm:grid-cols-6 gap-3">
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
        <button className="col-span-1 bg-white w-full px-2 h-10 text-center rounded-[12px] text-input font-gotham-bold tracking-wider
                            block rounded-[16px] bg-white leading-normal shadow-md transition duration-150 ease-in-out flex justify-center items-center
                            hover:bg-neutral-200 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 text-sm"
          onClick={sortByClient}>
          Sort jobs by client
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
            {list?.map((item, index) => {
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
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default JobList;