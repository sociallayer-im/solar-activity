import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'


// package
import RegistGroup from '../pages/RegistGroup'

import Group from '../pages/Group/Group'
import Home from '../pages/Home'
import Profile from '../pages/Profile/Profile'
import EventDetail from '../pages/EventDetail/page'
import Login from '../pages/Login'
import Regist from '../pages/Regist'
import CreateEvent from "../pages/CreateEvent";
import CreateEventSuccess from "../pages/CreateEventSuccess/CreateEventSuccess";
import Calendar from "../pages/Calendar/Calendar";
import CalendarNew from "../pages/CalendarNew/CalendarNew";
import EventCheckIn from "../pages/EventCheckIn/EventCheckIn";
import Search from "../pages/Search";
import PlatformLogin from "../pages/platformLogin/platformLogin";
import LoginPhone from "../pages/LoginPhone";

import Dashboard from "../pages/Dashborad/Dashboard";



// lazy load
// const Home = lazy(() => import('../pages/Home'))
// const Profile = lazy(() => import('../pages/Profile/Profile'))
// const Login = lazy(() => import('../pages/Login'))
// const Regist = lazy(() => import('../pages/Regist'))
// const CreateBadge = lazy(() => import('../pages/CreateBadge'))
// const Group = lazy(() => import('../pages/Group/Group'))
// const RegistGroup = lazy(() => import('../pages/RegistGroup'))
// const Search = lazy(() => import('../pages/Search'))
// const Event = lazy(() => import('../pages/Event'))
const Error = lazy(() => import('../pages/Error'))
const Merge = lazy(() => import('../pages/Merge/Merge'))
// const Issue = lazy(() => import('../pages/Issue'))
// const Invite = lazy(() => import('../pages/Invite'))
// const IssueSuccess = lazy(() => import('../pages/IssueSuccess'))

function AppRouter () {
    return (
        <Suspense>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/:groupname" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/regist" element={<Regist />} />
                <Route path="/:groupname/calendar" element={<CalendarNew />} />
                <Route path="/:groupname/create" element={<CreateEvent />} />
                <Route path="/:groupname/event/edit/:eventId" element={<CreateEvent />} />
                <Route path="/checkin/:eventId" element={<EventCheckIn />} />
                <Route path="/event/:eventId" element={<EventDetail />} />
                <Route path="/search/:keyword" element={<Search />} />
                <Route path="/success/:eventId" element={<CreateEventSuccess />} />
                <Route path="/merge" element={<Merge />} />
                <Route path="/login-phone" element={<LoginPhone />} />

                <Route path="/:groupname/dashboard" element={<Dashboard />} />

                <Route path="/platform/login" element={<PlatformLogin />} />
                <Route path="/error" element={<Error />} />
            </Routes>
        </Suspense>
    )
}

export default AppRouter
