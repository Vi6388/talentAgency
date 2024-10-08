import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Login from "../Pages/Auth/Login";

import EstimateKanban from "../Pages/Estimate/kanban";
import EstimateJobDetailsForm from "../Pages/Estimate/JobDetailsForm";
import EstimateInvoiceForm from "../Pages/Estimate/InvoiceForm";
import EstimateSocialForm from "../Pages/Estimate/SocialForm";
import EstimateEventForm from "../Pages/Estimate/EventForm";
import EstimateMediaForm from "../Pages/Estimate/MediaForm";
import EstimatePublishForm from "../Pages/Estimate/PublishForm";
import EstimateTravelForm from "../Pages/Estimate/TravelForm";

import JobKanban from "../Pages/Job/kanban";
import JobList from "../Pages/Job/JobList";
import JobDetailsForm from "../Pages/Job/JobDetailsForm";
import JobInvoiceForm from "../Pages/Job/InvoiceForm";
import JobSocialForm from "../Pages/Job/SocialForm";
import JobEventForm from "../Pages/Job/EventForm";
import JobMediaForm from "../Pages/Job/MediaForm";
import JobPublishForm from "../Pages/Job/PublishForm";
import JobTravelForm from "../Pages/Job/TravelForm";

import ClientList from "../Pages/Client/List";

import Settings from "../Pages/Settings/Settings";
import UserForm from "../Pages/Settings/UserForm";
import TalentForm from "../Pages/Settings/TalentForm";
import ClientForm from "../Pages/Client/ClientForm";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout children={<Navigate to="/estimate/kanban" />} />,
  },
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/estimate/kanban",
    element: <RootLayout children={<EstimateKanban />} />
  },
  {
    path: "/estimate/add/jobDetails",
    element: <RootLayout children={<EstimateJobDetailsForm />} />
  },
  {
    path: "/estimate/add/invoice",
    element: <RootLayout children={<EstimateInvoiceForm />} />
  },
  {
    path: "/estimate/add/social",
    element: <RootLayout children={<EstimateSocialForm />} />
  },
  {
    path: "/estimate/add/event",
    element: <RootLayout children={<EstimateEventForm />} />
  },
  {
    path: "/estimate/add/media",
    element: <RootLayout children={<EstimateMediaForm />} />
  },
  {
    path: "/estimate/add/publish",
    element: <RootLayout children={<EstimatePublishForm />} />
  },
  {
    path: "/estimate/add/travel",
    element: <RootLayout children={<EstimateTravelForm />} />
  },

  {
    path: "/job/kanban",
    element: <RootLayout children={<JobKanban />} />
  },
  {
    path: "/job/list",
    element: <RootLayout children={<JobList />} />
  },
  {
    path: "/job/edit/:id/jobDetails",
    element: <RootLayout children={<JobDetailsForm />} />
  },
  {
    path: "/job/edit/:id/invoice",
    element: <RootLayout children={<JobInvoiceForm />} />
  },
  {
    path: "/job/edit/:id/social",
    element: <RootLayout children={<JobSocialForm />} />
  },
  {
    path: "/job/edit/:id/event",
    element: <RootLayout children={<JobEventForm />} />
  },
  {
    path: "/job/edit/:id/media",
    element: <RootLayout children={<JobMediaForm />} />
  },
  {
    path: "/job/edit/:id/publish",
    element: <RootLayout children={<JobPublishForm />} />
  },
  {
    path: "/job/edit/:id/travel",
    element: <RootLayout children={<JobTravelForm />} />
  },
  {
    path: "/client/list",
    element: <RootLayout children={<ClientList />} />
  },
  {
    path: "/client/add",
    element: <RootLayout children={<ClientForm />} />
  },
  {
    path: "/client/edit/:id",
    element: <RootLayout children={<ClientForm />} />
  },
  {
    path: "/settings",
    element: <RootLayout children={<Settings />} />
  },
  {
    path: "/settings/user/add",
    element: <RootLayout children={<UserForm />} />
  },
  {
    path: "/settings/user/edit/:id",
    element: <RootLayout children={<UserForm />} />
  },
  {
    path: "/settings/talent/add",
    element: <RootLayout children={<TalentForm />} />
  },
  {
    path: "/settings/talent/edit/:id",
    element: <RootLayout children={<TalentForm />} />
  }
]);

export default routes;