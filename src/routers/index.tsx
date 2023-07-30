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
// const Issue = lazy(() => import('../pages/Issue'))
// const Invite = lazy(() => import('../pages/Invite'))
// const IssueSuccess = lazy(() => import('../pages/IssueSuccess'))


function AppRouter () {
    return (
        <Suspense>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/regist" element={<Regist />} />
                <Route path="/event/create" element={<CreateEvent />} />
                <Route path="/event/edit/:eventId" element={<CreateEvent />} />
                <Route path="/event/:eventId" element={<EventDetail />} />
                <Route path="/success/:eventId" element={<CreateEventSuccess />} />
                <Route path="*" element={<Error />} />
            </Routes>
        </Suspense>
    )
}

export default AppRouter
