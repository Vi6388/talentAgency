import { useState } from "react";
import UserListData from "../../data/user_list.json";
import TalentListData from "../../data/talent_list.json";
import AmbassadorshipsListData from "../../data/ambassadorships_list.json";
import { Link } from "react-router-dom";

const thData = [
  'name',
  'email',
  'phone',
  'username',
  ''
];

const Settings = () => {
  const [userList, setUserList] = useState(UserListData);
  const [talentList, setTalentList] = useState(TalentListData);
  const [ambassadorshipsList, setAmbassdorshipsList] = useState(AmbassadorshipsListData);

  return (
    <div className="p-5 h-full bg-main">
      <div className="text-[36px] text-title-2 font-bold w-full text-center">Settings</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full sm:w-3/4 mx-auto">
        <div className="w-full">
          <div className="text-base text-title-2 font-semibold py-3">Users</div>
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
                {userList?.map((item, index) => {
                  return (
                    <tr className="border-table border-b last:border-b-0" key={index}>
                      <td className="p-2"><span className="text-input text-sm font-medium">{item.name}</span></td>
                      <td className="p-2"><span className="text-input text-sm font-medium">{item.email}</span></td>
                      <td className="p-2"><span className="text-input text-sm font-medium">{item.phone}</span></td>
                      <td className="p-2"><span className="text-input text-sm font-medium">{item.username}</span></td>
                      <td className="p-2 w-[100px] md:w-[160px]">
                        <Link to={"/settings/user/edit/1"}>
                          <button className="bg-button-6 h-12 md:h-9 text-center rounded-[12px] text-white font-bold tracking-wider w-[100px] md:w-[160px]
                            block rounded leading-normal shadow-md transition duration-150 ease-in-out uppercase
                            hover:bg-[#a38b7b] hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 
                            active:bg-[#978172] active:shadow-lg text-sm">Edit details</button>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <Link to={"/settings/user/add"} className="flex justify-start md:justify-center items-center my-5">
            <button className="bg-button-6 h-12 md:h-9 text-center rounded-[12px] text-white font-bold tracking-wider w-full md:w-[160px]
                            block rounded leading-normal shadow-md transition duration-150 ease-in-out uppercase
                            hover:bg-[#a38b7b] hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 
                            active:bg-[#978172] active:shadow-lg text-sm">New User</button>
          </Link>
        </div>
        <div className="w-full">
          <div className="text-base text-title-2 font-semibold py-3">Talent</div>
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
                {talentList?.map((item, index) => {
                  return (
                    <tr className="border-table border-b last:border-b-0" key={index}>
                      <td className="p-2"><span className="text-input text-sm font-medium">{item.name}</span></td>
                      <td className="p-2"><span className="text-input text-sm font-medium">{item.email}</span></td>
                      <td className="p-2"><span className="text-input text-sm font-medium">{item.phone}</span></td>
                      <td className="p-2"><span className="text-input text-sm font-medium">{item.username}</span></td>
                      <td className="p-2 w-[100px] md:w-[160px]">
                        <Link to={"/settings/talent/edit/1"}>
                          <button className="bg-button-6 h-12 md:h-9 text-center rounded-[12px] text-white font-bold tracking-wider w-[100px] md:w-[160px]
                            block rounded leading-normal shadow-md transition duration-150 ease-in-out uppercase
                            hover:bg-[#a38b7b] hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 
                            active:bg-[#978172] active:shadow-lg text-sm">Edit details</button>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <Link to={"/settings/talent/add"} className="flex justify-start md:justify-center items-center my-5">
            <button className="bg-button-6 h-12 md:h-9 text-center rounded-[12px] text-white font-bold tracking-wider w-full md:w-[160px]
                            block rounded leading-normal shadow-md transition duration-150 ease-in-out uppercase
                            hover:bg-[#a38b7b] hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 
                            active:bg-[#978172] active:shadow-lg text-sm">New Talent</button>
          </Link>
        </div>
        <div className="w-full">
          <div className="text-base text-title-2 font-semibold py-3">Ambassadorships</div>
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
                {ambassadorshipsList?.map((item, index) => {
                  return (
                    <tr className="border-table border-b last:border-b-0" key={index}>
                      <td className="p-2"><span className="text-input text-sm font-medium">{item.name}</span></td>
                      <td className="p-2"><span className="text-input text-sm font-medium">{item.email}</span></td>
                      <td className="p-2"><span className="text-input text-sm font-medium">{item.phone}</span></td>
                      <td className="p-2"><span className="text-input text-sm font-medium">{item.username}</span></td>
                      <td className="p-2 w-[100px] md:w-[160px]">
                        <Link to={"/ambassadorships/edit/1"}>
                          <button className="bg-button-6 h-12 md:h-9 text-center rounded-[12px] text-white font-bold tracking-wider w-[100px] md:w-[160px]
                            block rounded leading-normal shadow-md transition duration-150 ease-in-out uppercase
                            hover:bg-[#a38b7b] hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 
                            active:bg-[#978172] active:shadow-lg text-sm">Edit details</button>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <Link to={"/client/add"} className="flex justify-start md:justify-center items-center my-5">
            <button className="bg-button-6 h-12 md:h-9 text-center rounded-[12px] text-white font-bold tracking-wider w-full md:w-[210px]
                            block rounded leading-normal shadow-md transition duration-150 ease-in-out uppercase
                            hover:bg-[#a38b7b] hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 
                            active:bg-[#978172] active:shadow-lg text-sm">New Ambassadorship</button>
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <div className="mt-10 w-fit mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="min-w-[160px]">
              <button className="bg-button-2 h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-white-100 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm">Close</button>
            </div>
            <div className="min-w-[160px]">
              <button className="bg-button-4 h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-white-100 hover:shadow-md focus:bg-white-200 focus:shadow-md focus:outline-none focus:ring-0 
                        active:bg-white-100 active:shadow-md text-sm">Update</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings;