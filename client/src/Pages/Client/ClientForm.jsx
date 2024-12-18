import { useState } from "react";
import ClientProfile from "./ClientProfile";
import ClientContacts from "./ClientContacts";
import ClientNotes from "./ClientNotes";
import ClientJobs from "./ClientJobs";

const ClientForm = () => {
  const [tab, setTab] = useState("profile");

  const onChangeTab = (tab) => {
    setTab(tab);
  }

  return (
    <div className="p-5 h-full bg-main">
      <div className="w-full md:w-2/3 lg:w-1/2 mx-auto">
        <div className="flex justify-center items-center gap-2 md:gap-5">
          <button className={`w-[100px] px-2 h-10 text-center rounded-[12px] font-gotham-bold tracking-wider
                            block rounded-[16px] bg-white leading-normal shadow-md transition duration-150 ease-in-out 
                            hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 text-sm
                            ${tab === "profile" ? 'bg-[#a48679] text-white' : 'bg-white text-input'}`}
            onClick={() => onChangeTab("profile")}>Profile
          </button>
          <button className={`w-[100px] px-2 h-10 text-center rounded-[12px] font-gotham-bold tracking-wider
                            block rounded-[16px] bg-white leading-normal shadow-md transition duration-150 ease-in-out 
                            hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 text-sm
                            ${tab === "contacts" ? 'bg-[#a48679] text-white' : 'bg-white text-input'}`}
            onClick={() => onChangeTab("contacts")}>Contacts
          </button>
          <button className={`w-[100px] px-2 h-10 text-center rounded-[12px] font-gotham-bold tracking-wider
                            block rounded-[16px] bg-white leading-normal shadow-md transition duration-150 ease-in-out 
                            hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 text-sm
                            ${tab === "notes" ? 'bg-[#a48679] text-white' : 'bg-white text-input'}`}
            onClick={() => onChangeTab("notes")}>Notes
          </button>
          <button className={`w-[100px] px-2 h-10 text-center rounded-[12px] font-gotham-bold tracking-wider
                            block rounded-[16px] bg-white leading-normal shadow-md transition duration-150 ease-in-out 
                            hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 text-sm
                            ${tab === "jobs" ? 'bg-[#a48679] text-white' : 'bg-white text-input'}`}
            onClick={() => onChangeTab("jobs")}>Jobs
          </button>
        </div>
      </div>
      <div className="mt-8">
        {tab === "profile" && <ClientProfile />}
        {tab === "contacts" && <ClientContacts />}
        {tab === "notes" && <ClientNotes />}
        {tab === "jobs" && <ClientJobs />}
      </div>
    </div>
  )
}

export default ClientForm;