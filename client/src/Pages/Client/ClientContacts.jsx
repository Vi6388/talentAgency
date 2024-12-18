import { useEffect, useState } from "react";
import AddCircle from "../../svg/add_circle.svg";
import CancelIcon from "../../svg/cancel.svg";
import { store } from "../../redux/store";
import { CHANGE_IS_LOADING } from "../../redux/actionTypes";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ContactApi } from "../../apis/ContactApi";

const ClientContacts = () => {
  const { clientId } = useParams();
  const { client } = useSelector((state) => state.job);
  const [contactForm, setContactForm] = useState({
    firstname: "",
    surname: "",
    email: "",
    phoneNumber: "",
    position: "",
    primary: false,
  });

  const [contactList, setContactList] = useState([]);

  useEffect(() => {
    if (clientId) {
      store.dispatch({ type: CHANGE_IS_LOADING, payload: true });
      ContactApi.getContactListByClientId(clientId).then((res) => {
        if (res.data.status === 200) {
          setContactList(res.data.data);
        } else {
          toast.error(res.data.message, {
            position: "top-left",
          });
        }
        store.dispatch({ type: CHANGE_IS_LOADING, payload: false });
      });
    }
  }, [clientId]);

  const handleChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    })
  }

  const handlePrimaryContacts = () => {
    setContactForm({
      ...contactForm,
      primary: !contactForm.primary
    })
  }

  const edit = (item, index) => {
    console.log(item, index);
  }

  const cancel = (index) => {
    console.log(index);
  }

  return (
    <div className="w-full mx-auto">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="cols-span-1 flex justify-end">
          <div className="w-full lg:w-2/3 pr-0 lg:pr-16">
            <div className="text-base text-title-2 font-semibold py-3">Contact Details</div>
            <div className="flex flex-col justify-between items-center gap-3">
              <div className="w-full">
                <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none" placeholder="First Name"
                  type="text" value={contactForm.firstname} name="firstname"
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="w-full">
                <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none" placeholder="Surname"
                  type="text" value={contactForm.surname} name="surname"
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="w-full">
                <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none" placeholder="email Address"
                  type="text" value={contactForm.email} name="email"
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="w-full">
                <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none" placeholder="phone Number"
                  type="text" value={contactForm.phoneNumber} name="phoneNumber"
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="w-full">
                <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none" placeholder="position"
                  type="text" value={contactForm.position} name="position"
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="w-full flex justify-start items-center gap-3">
                <div className="w-full">
                  <label className='themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center w-fit'>
                    <input
                      type='checkbox'
                      checked={contactForm.primary}
                      onChange={handlePrimaryContacts}
                      className='sr-only'
                    />
                    <span className={`slider mr-4 flex h-6 w-[40px] items-center rounded-full p-0.5 duration-200 border-button-3  ${contactForm.primary ? 'bg-button-3 hover:shadow-md' : 'bg-white'}`}>
                      <span className={`dot h-4 w-4 rounded-full duration-200 ${contactForm.primary ? 'translate-x-[18px] bg-white' : 'bg-button-3 hover:shadow-md'}`}></span>
                    </span>
                    <span className='label flex items-center text-sm font-semibold text-estimateDate text-estimateDate'>
                      Make Primary Contact
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="w-full flex justify-end items-center mt-10 ">
              <button className="w-fit flex gap-2 cursor-pointer hover:text-decoration items-center">
                <span className="text-estimateDate text-sm font-semibold">Add to contacts list</span>
                <img src={AddCircle} alt="add" />
              </button>
            </div>
          </div>
        </div>
        <div className="cols-span-1">
          <div className="w-full overflow-auto shadow-md">
            <table className="bg-table rounded-lg shadow-md w-full h-full">
              <thead>
                <tr className="border-b border-table">
                  <th className="text-th text-sm tracking-wider capitalize text-left px-2 py-3">Full Name</th>
                  <th className="text-th text-sm tracking-wider capitalize text-left px-2 py-3">Position</th>
                  <th className="text-th text-sm tracking-wider capitalize text-left px-2 py-3">Email</th>
                  <th className="text-th text-sm tracking-wider capitalize text-left px-2 py-3">Phone</th>
                  <th className="text-th text-sm tracking-wider capitalize text-left px-2 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {contactList?.map((item, index) => {
                  return (
                    <tr className={`border-table border-b last:border-b-0 ${item.primary ? 'bg-white' : ''}`} key={index}>
                      <td className="p-2"><span className="text-input text-sm font-gotham-regular">{item.firstname + " " + item.surname}</span></td>
                      <td className="p-2"><span className="text-input text-sm font-gotham-regular">{item.position}</span></td>
                      <td className="p-2"><span className="text-input text-sm font-gotham-regular">{item.email}</span></td>
                      <td className="p-2"><span className="text-input text-sm font-gotham-regular uppercase">{item.phoneNumber}</span></td>
                      <td className="p-2 flex items-center gap-3">
                        <button className="text-white bg-black rounded-xl px-4" onClick={() => edit(item, index)}>Edit</button>
                        <button onClick={() => cancel(index)}>
                          <img src={CancelIcon} alt="cancel icon" className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {contactList?.length === 0 && <tr><td colSpan="6" className="text-center p-2">No data</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientContacts;