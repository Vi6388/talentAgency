import React, { useEffect, useState } from "react";
import WorkflowLogo from "../svg/workflow_logo.png";
import BuildCircle from "../svg/header/build_circle.svg";
import BuildCircleActive from "../svg/header/build_circle_active.svg";
import Article from "../svg/header/article.svg";
import ArticleActive from "../svg/header/article_active.svg";
import ListAlt from "../svg/header/list_alt.svg";
import ListAltActive from "../svg/header/list_alt_active.svg";
import RequestQuote from "../svg/header/request_quote.svg";
import RequestQuoteActive from "../svg/header/request_quote_active.svg";
import ViewKanban from "../svg/header/view_kanban.svg";
import ViewKanbanActive from "../svg/header/view_kanban_active.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CloseIcon from "../svg/cancel.svg";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loggedUser, setLoggedUser] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?._id) {
      setLoggedUser(user);
    } else {
      navigate("/login");
    }
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className="bg-main fixed w-full z-20 top-0 start-0">
        <div className={`w-full flex ${isOpen ? 'flex-wrap border-b border-gray-200' : 'border-0'} md:flex-nowrap md:border-0
                        items-center justify-end sm:justify-between mx-auto py-4 px-4 md:mx-0 gap-1 sm:gap-3`}>
          <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse md:order-2">
            <img src={WorkflowLogo} className="h-full sm:h-8 w-full sm:w-fit" alt="Workflow Logo" />
          </a>
          <div className="flex md:order-3 space-x-3 rtl:space-x-reverse items-center">
            <div className="flex">
              {location.pathname === "/estimate/kanban" ? (
                <Link to={"/estimate/add/jobDetails"}>
                  <button className="bg-black w-24 md:w-32 lg:w-48 h-9 md:h-11 tracking-wider text-center rounded-[12px] text-white font-bold 
                        block rounded bg-black uppercase leading-normal shadow-md transition duration-150 ease-in-out px-3
                        hover:bg-neutral-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 text-sm">New Job</button>
                </Link>
              ) : (location.pathname === "/job/kanban" || location.pathname === "/job/list") ? (
                <Link to={"/job/add/jobDetails"}>
                  <button className="bg-black w-24 md:w-32 lg:w-48 h-9 md:h-11 tracking-wider text-center rounded-[12px] text-white font-bold 
                        block rounded bg-black uppercase leading-normal shadow-md transition duration-150 ease-in-out px-3
                        hover:bg-neutral-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 text-sm">New Job</button>
                </Link>
              ) :
                < button className="bg-main w-24 md:w-32 lg:w-48 h-9 md:h-11 hidden md:block"></button>
              }
            </div>
            <button
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex items-center p-2 w-9 h-9 justify-center text-sm text-[#a48679] rounded-lg 
                   md:hidden hover:bg-main focus:outline-none focus:ring-0"
              aria-controls="navbar-sticky"
              aria-expanded={isOpen}
              onClick={handleToggle}
            >
              {isOpen ?
                <img src={CloseIcon} alt="close" /> :
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                </svg>
              }
            </button>
          </div>
          <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isOpen ? 'block' : 'hidden'}`} id="navbar-sticky">
            <ul className="flex flex-row justify-between md:justify-start px-4 md:p-0 font-gotham-medium items-center rounded-lg md:space-x-8 rtl:space-x-reverse 
                            md:mt-0 md:border-0">
              <li>
                <button className="bg-white w-[88px] h-10 tracking-wider text-center rounded-[12px] text-input font-bold 
                      block rounded bg-white leading-normal shadow-md transition duration-150 ease-in-out 
                      hover:bg-neutral-200 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 text-sm">
                  <img className="relative z-30 inline object-cover w-7 h-7 rounded-full mr-1"
                    src={loggedUser?.avatar ? loggedUser?.avatar :
                      "https://static.vecteezy.com/system/resources/previews/022/123/337/non_2x/user-icon-profile-icon-account-icon-login-sign-line-vector.jpg"}
                    alt="" />
                  {loggedUser?.firstname}
                </button>
              </li>
              <li className="navbar-list-margin">
                <Link to={"/settings"} onClick={handleToggle}>
                  <img src={location.pathname.includes("/settings") ? BuildCircleActive : BuildCircle} alt="Build Circle" className="w-8 h-8" />
                </Link>
              </li>
              <li className="navbar-list-margin">
                <Link to={"/client/list"} onClick={handleToggle}>
                  <img src={location.pathname !== "/client/list" ? ListAlt : ListAltActive} alt="Client List" className="w-8 h-8" />
                </Link>
              </li>
              <li className="navbar-list-margin">
                <Link to={"/estimate/kanban"} onClick={handleToggle}>
                  <img src={location.pathname !== "/estimate/kanban" ? RequestQuote : RequestQuoteActive} alt="Estimate Kanban" className="w-8 h-8" />
                </Link>
              </li>
              <li className="navbar-list-margin">
                <Link to={"/job/kanban"} onClick={handleToggle}>
                  <img src={location.pathname !== "/job/kanban" ? ViewKanban : ViewKanbanActive} alt="Job Kanban" className="w-8 h-8" />
                </Link>
              </li>
              <li className="navbar-list-margin">
                <Link to={"/job/list"} onClick={handleToggle}>
                  <img src={location.pathname !== "/job/list" ? Article : ArticleActive} alt="Job List" className="w-8 h-8" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav >
    </>
  );
};

export default Navbar;
