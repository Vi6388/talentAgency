import { useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify";
import { companyTypeList } from "../../utils/utils";
import { useParams } from "react-router-dom";
import { store } from "../../redux/store";
import { CHANGE_IS_LOADING, SAVE_CLIENT } from "../../redux/actionTypes";
import { ClientApi } from "../../apis/ClientApi";
import { useSelector } from "react-redux";

const ClientProfile = () => {
  const { id } = useParams();
  const { client } = useSelector((state) => state.job);
  const [profileForm, setProfileForm] = useState({
    companyName: "",
    abn: "",
    postalAddress: "",
    postalSuburb: "",
    postalState: "",
    postalPostcode: "",
    billingAddress: "",
    billingSuburb: "",
    billingState: "",
    billingPostcode: "",
    website: "",
    phoneNumber: "",
    companyType: "",
  });

  const [sameAsPostal, setSameAsPostal] = useState(false);

  useEffect(() => {
    if (id) {
      store.dispatch({ type: CHANGE_IS_LOADING, payload: true });
      ClientApi.getClientById(id).then((res) => {
        if (res.data.status === 200) {
          const data = res.data.data;
          store.dispatch({ type: SAVE_CLIENT, payload: data });
          initialProfileForm(data);
        } else {
          toast.error(res.data.message, {
            position: "top-left",
          });
        }
        store.dispatch({ type: CHANGE_IS_LOADING, payload: false });
      });
    } else {
      initialProfileForm(client);
    }
  }, [id]);

  const initialProfileForm = (data) => {
    const company = data.company;
    setProfileForm(company);
  }

  const handleChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    })
  }

  const handleSameAsPostal = () => {
    setSameAsPostal(!sameAsPostal);
    let address = "";
    let suburb = "";
    let state = "";
    let postcode = "";
    if (!sameAsPostal) {
      address = profileForm.postalAddress;
      suburb = profileForm.postalSuburb;
      state = profileForm.postalState;
      postcode = profileForm.postalPostcode;
    }
    setProfileForm({
      ...profileForm,
      billingAddress: address,
      billingSuburb: suburb,
      billingState: state,
      billingPostcode: postcode
    })
  }

  const handleError = (err) => {
    toast.error(err, {
      position: "top-left",
    });
  }

  const handleSuccess = (msg) => {
    toast.success(msg, {
      position: "top-left",
    });
  }

  const onSubmit = () => {
    if (id !== undefined) {
      store.dispatch({ type: CHANGE_IS_LOADING, payload: true });
      ClientApi.updateClientById(id, profileForm).then((res) => {
        try {
          if (res.data.status === 200) {
            handleSuccess(res.data.message);
            initialProfileForm(res.data.data);
          } else {
            handleError(res.data.message);
          }
          store.dispatch({ type: CHANGE_IS_LOADING, payload: false });
        } catch (e) {
          handleError(e);
          store.dispatch({ type: CHANGE_IS_LOADING, payload: false });
        }
      });
    } else {
      store.dispatch({ type: CHANGE_IS_LOADING, payload: true });
      ClientApi.add(profileForm).then((res) => {
        try {
          if (res.data.status === 200) {
            handleSuccess(res.data.message);
          } else {
            handleError(res.data.message);
          }
          store.dispatch({ type: CHANGE_IS_LOADING, payload: false });
        } catch (e) {
          handleError(e);
          store.dispatch({ type: CHANGE_IS_LOADING, payload: false });
        }
      });
    }
  }

  return (
    <div>
      <ToastContainer />
      <div className="w-full md:w-2/3 lg:w-1/2 mx-auto">
        <div className="text-base text-title-2 font-semibold py-3 text-center">Company Details</div>
        <div className="flex flex-col justify-between items-center gap-3">
          <div className="w-full">
            <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none" placeholder="company Name"
              type="text" value={profileForm.companyName} name="companyName"
              onChange={(e) => handleChange(e)} />
          </div>

          <div className="w-full">
            <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none" placeholder="abn"
              type="text" value={profileForm.abn} name="abn"
              onChange={(e) => handleChange(e)} />
          </div>

          <div className="postal-address flex flex-col justify-between items-center gap-3 mt-8 w-full">
            <div className="w-full">
              <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none" placeholder="postal Address"
                type="text" value={profileForm.postalAddress} name="postalAddress"
                onChange={(e) => handleChange(e)} />
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="cols-span-1">
                <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none" placeholder="Suburb"
                  type="text" value={profileForm.postalSuburb} name="postalSuburb"
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="cols-span-1">
                <div className="grid grid-cols-2 gap-3">
                  <div className="w-full cols-span-1">
                    <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none" placeholder="State"
                      type="text" value={profileForm.postalState} name="postalState"
                      onChange={(e) => handleChange(e)} />
                  </div>
                  <div className="cols-span-1">
                    <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none" placeholder="Postcode"
                      type="text" value={profileForm.postalPostcode} name="postalPostcode"
                      onChange={(e) => handleChange(e)} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-between items-center gap-3 mt-8">
            <div className="w-full text-center">
              <label className='themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center w-fit'>
                <input
                  type='checkbox'
                  checked={sameAsPostal}
                  onChange={handleSameAsPostal}
                  className='sr-only'
                />
                <span className={`slider mr-4 flex h-6 w-[40px] items-center rounded-full p-0.5 duration-200 border-button-3  ${sameAsPostal ? 'bg-button-3 hover:shadow-md' : 'bg-white'}`}>
                  <span className={`dot h-4 w-4 rounded-full duration-200 ${sameAsPostal ? 'translate-x-[18px] bg-white' : 'bg-button-3 hover:shadow-md'}`}></span>
                </span>
                <span className='label flex items-center text-sm font-semibold text-estimateDate text-estimateDate'>
                  Same as Postal Address
                </span>
              </label>
            </div>
          </div>

          <div className="billing-address flex flex-col justify-between items-center gap-3 w-full">
            <div className="w-full">
              <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none" placeholder="billing Address"
                type="text" value={profileForm.billingAddress} name="billingAddress"
                onChange={(e) => handleChange(e)} />
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="cols-span-1">
                <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none" placeholder="Suburb"
                  type="text" value={profileForm.billingSuburb} name="billingSuburb"
                  onChange={(e) => handleChange(e)} />
              </div>
              <div className="cols-span-1">
                <div className="w-full grid grid-cols-2 gap-3">
                  <div className="cols-span-1">
                    <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none" placeholder="State"
                      type="text" value={profileForm.billingState} name="billingState"
                      onChange={(e) => handleChange(e)} />
                  </div>
                  <div className="cols-span-1">
                    <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none" placeholder="Postcode"
                      type="text" value={profileForm.billingPostcode} name="billingPostcode"
                      onChange={(e) => handleChange(e)} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 my-8">
            <div className="cols-span-1">
              <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none" placeholder="website"
                type="text" value={profileForm.website} name="website"
                onChange={(e) => handleChange(e)} />
            </div>
            <div className="cols-span-1">
              <input className="rounded-[16px] text-input shadow-md shadow-500 text-center h-10 w-full tracking-wider text-sm
                        outline-none focus:border-[#d4d5d6] border-none" placeholder="phoneNumber"
                type="text" value={profileForm.phoneNumber} name="phoneNumber"
                onChange={(e) => handleChange(e)} />
            </div>
          </div>

          <div className="w-full">
            <select
              className="bg-white w-full px-2 h-10 text-center rounded-[12px] text-input tracking-wider border-none
                            block rounded-[16px] bg-white leading-normal shadow-md transition duration-150 ease-in-out flex justify-center items-center
                            hover:shadow-lg focus:shadow-lg focus:ring-1 text-sm"
              value={profileForm?.companyType} onChange={(e) => handleChange(e)} name="companyType" placeholder="Company Type">
              <option value="">Company Type</option>
              {companyTypeList?.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

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

export default ClientProfile;