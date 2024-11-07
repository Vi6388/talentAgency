import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserApi } from "../../apis/UserApi";
import { TalentApi } from "../../apis/TalentApi";

const thData = [
  'name',
  'email',
  'phone',
  'username',
  ''
];

const Settings = () => {
  const [userList, setUserList] = useState();
  const [talentList, setTalentList] = useState();

  useEffect(() => {
    UserApi.getUserList().then((res) => {
      if (res.data.status === 200) {
        setUserList(res.data.data);
      }
    });

    TalentApi.getTalentList().then((res) => {
      if (res.data.status === 200) {
        setTalentList(res.data.data);
      }
    })
  }, []);

  return (
    <div className="p-5 h-full bg-main">
      <div className="text-[36px] text-title-2 font-bold w-full text-center">Settings</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full sm:w-3/4 mx-auto">
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
                      <td className="p-2 w-[20%]"><span className="text-input text-sm font-gotham-medium">{item.firstname + " " + item.surname}</span></td>
                      <td className="p-2"><span className="text-input text-sm font-gotham-medium">{item.email}</span></td>
                      <td className="p-2 w-[20%]"><span className="text-input text-sm font-gotham-medium">{item.phoneNumber}</span></td>
                      <td className="p-2"><span className="text-input text-sm font-gotham-medium">{item.username}</span></td>
                      <td className="p-2 w-full lg:w-[160px]">
                        <Link to={`/settings/user/edit/${item._id}`}>
                          <button className="bg-button-6 h-full lg:h-9 text-center rounded-[12px] text-white font-bold tracking-wider w-[100px] lg:w-[160px]
                            block rounded leading-normal shadow-md transition duration-150 ease-in-out uppercase
                            hover:bg-[#a38b7b] hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 text-sm">Edit details</button>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
                {userList?.length === 0 && <tr><td colSpan="5" className="text-center p-2">No data</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="w-full my-5">
            <Link to={"/settings/user/add"} className="bg-button-6 h-12 md:h-9 text-center rounded-[12px] text-white font-bold tracking-wider w-fit md:w-[160px]
                            flex items-center justify-center rounded leading-normal shadow-md transition duration-150 ease-in-out uppercase
                            hover:bg-[#a38b7b] hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 text-sm mx-auto px-4">New User</Link>
          </div>
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
                      <td className="p-2 w-[20%]"><span className="text-input text-sm font-gotham-medium">{item.firstname + " " + item.surname}</span></td>
                      <td className="p-2"><span className="text-input text-sm font-gotham-medium">{item.email}</span></td>
                      <td className="p-2 w-[20%]"><span className="text-input text-sm font-gotham-medium w-full">{item.phoneNumber}</span></td>
                      <td className="p-2 w-full lg:w-[160px]">
                        <Link to={`/settings/talent/edit/${item._id}`}>
                          <button className="bg-button-6 h-full lg:h-9 text-center rounded-[12px] text-white font-bold tracking-wider w-[100px] lg:w-[160px]
                            block rounded leading-normal shadow-md transition duration-150 ease-in-out uppercase
                            hover:bg-[#a38b7b] hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 text-sm">Edit details</button>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
                {talentList?.length === 0 && <tr><td colSpan="4" className="text-center p-2">No data</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="w-full my-5">
            <Link to={"/settings/talent/add"} className="bg-button-6 h-12 md:h-9 text-center rounded-[12px] text-white font-bold tracking-wider w-fit md:w-[160px]
                            flex justify-center items-center rounded leading-normal shadow-md transition duration-150 ease-in-out uppercase
                            hover:bg-[#a38b7b] hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 text-sm mx-auto px-4">New Talent</Link>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="mt-10 w-fit mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="min-w-[160px]">
              <button className="bg-button-2 h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-[#afa098] hover:shadow-md focus:bg-[#6a5b53] focus:shadow-md focus:outline-none focus:ring-0 text-sm">Close</button>
            </div>
            <div className="min-w-[160px]">
              <button className="bg-button-4 h-10 tracking-wider text-center rounded-[12px] text-white font-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-full
                        hover:bg-slate-700 hover:shadow-md focus:bg-slate-800 focus:shadow-md focus:outline-none focus:ring-0 text-sm">Update</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings;