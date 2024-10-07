import { useState } from "react";
import ClientListData from "../../data/client_list.json";
import { Link } from "react-router-dom";

const thData = [
  'client',
  'contact',
  'phone',
  'state',
  'type',
  ''
];

const ClientList = () => {
  const [list, setList] = useState(ClientListData);
  return (
    <div className="p-5 flex flex-col h-full bg-main">
      <div className="filter-box mb-5 w-full md:w-fit mx-auto grid grid-cols-2 md:grid-cols-5 gap-3">
        <Link to={"/client/add"} className="order-2 md:order-none">
          <button className="col-span-1 bg-button-6 h-10 text-center rounded-[12px] text-white font-bold tracking-wider w-full px-4
                            block rounded leading-normal shadow-md transition duration-150 ease-in-out uppercase 
                            hover:bg-[#a38b7b] hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 
                            active:bg-[#978172] active:shadow-lg text-sm">New Client</button>
        </Link>
        <input className="order-1 md:order-none col-span-2 md:col-span-3 rounded-[16px] text-sm text-input shadow-md shadow-500 h-10 w-full tracking-wider text-center px-4 py-2
                          outline-none focus:border-[#d4d5d6] border-none placeholder:text-input placeholder:font-bold"
          placeholder="Search" type="text" />
        <button className="order-3 md:order-none col-span-1 bg-white w-full px-4 h-10 text-center rounded-[12px] text-input font-bold tracking-wider
                            block rounded-[16px] bg-white leading-normal shadow-md transition duration-150 ease-in-out 
                            hover:bg-neutral-200 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 
                            active:bg-neutral-100 active:shadow-lg text-sm">Show all</button>
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
                  <td className="p-2"><span className="text-input text-sm font-medium">{item.client}</span></td>
                  <td className="p-2"><span className="text-input text-sm font-medium">{item.contact}</span></td>
                  <td className="p-2"><span className="text-input text-sm font-medium">{item.phone}</span></td>
                  <td className="p-2"><span className="text-input text-sm font-medium uppercase">{item.state}</span></td>
                  <td className="p-2"><span className="text-input text-sm font-medium">{item.type}</span></td>
                  <td className="p-2 w-[100px] md:w-[160px]">
                    <Link to={"/client/edit/1"}>
                      <button className="bg-button-6 h-12 md:h-9 text-center rounded-[12px] text-white font-bold tracking-wider w-[100px] md:w-[160px]
                            block rounded leading-normal shadow-md transition duration-150 ease-in-out uppercase
                            hover:bg-[#a38b7b] hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 
                            active:bg-[#978172] active:shadow-lg text-sm">See details</button>
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

export default ClientList;