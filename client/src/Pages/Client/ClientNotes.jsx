import { useState } from "react";
import { ToastContainer } from "react-toastify";

const ClientNotes = () => {
  const [notes, setNotes] = useState("");

  const handleChange = (e) => {
    setNotes(e.target.value);
  }

  const onSubmit = () => {
    console.log(notes);
  }

  return (
    <div>
      <ToastContainer />
      <div className="w-full md:w-2/3 lg:w-1/2 mx-auto">
        <textarea className={`rounded-[16px] text-input shadow-md shadow-500 h-full w-full tracking-wider text-sm resize-none outline-none focus:border-[#d4d5d6]
                       placeholder:text-center border-none`}
          placeholder="Notes"
          type="text" value={notes} name="notes" rows={20}
          onChange={(e) => handleChange(e)} />

        <div className="mt-20 flex justify-center">
          <button className="bg-button-4 h-10 tracking-wider text-center rounded-[12px] text-white font-gotham-bold px-3
                        block rounded bg-black leading-normal shadow-md transition duration-150 ease-in-out w-[160px]
                        hover:bg-slate-700 hover:shadow-md focus:bg-slate-800 focus:shadow-md focus:outline-none focus:ring-0 text-sm"
            onClick={onSubmit}>Save</button>
        </div>
      </div>
    </div>
  )
}

export default ClientNotes;