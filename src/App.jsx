
import React, { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './layouts/RootLayouts'
import Login from './authpages/Login'
import DashboardLayout from './layouts/DashboaredLayout'
import AdminDashboared from './AdminPage/AdminDashbored'
import AssignShift from './AdminPage/AssignShift'
import AllShifts from './AdminPage/AllShifts'
import SettingsPage from './sharedComponents/SettingPage'
import WorkerDashboardLayout from './layouts/WorkersDashboardLayout'
import MyShift from './WorkersPage/myShiftPage'
import ColleaguesShift from './WorkersPage/ColleaquesShifts'
import { useDispatch } from 'react-redux'
import { loggedInUserData } from './redux-store/features/loggedInUserData/loggedInUserThunkData'
import { PrivateRoute, PublicRoute } from './helpers/routeProtect'
import ResetPassword from './authpages/ResetPassword'
import EditShiftPage from './AdminPage/EditShiftPage'
import AdminHistoryPage from './AdminPage/AdminHistoryPage'
import NotificationPage from './WorkersPage/NotificationPage'
import InviteWorker from './AdminPage/InviteWorker'
import VerifyEmail from './WorkersPage/VerifyEmail'
import CompleteRegistration from './authpages/CompleteRegistration'
import ForgotPassword from './authpages/forgotPassword'


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        )
      },

      {
        path: 'complete-registration',
        element:(
          <PublicRoute>
             <CompleteRegistration />
          </PublicRoute>
        )
      },
      {
        path: 'forgot-password',
        element: (
          <PublicRoute>
            <ForgotPassword/>
          </PublicRoute>
        )
      },
      {
        path: 'reset-password/:token',
        element: (
          <PublicRoute>
            <ResetPassword/>
          </PublicRoute>
        )
      },
      {
            path: "verify",
            element: <VerifyEmail/>
          },
      {
        path: "adminDash",
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <DashboardLayout />
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: <AdminDashboared />
          },
          {
            path: "invite",
            element: <InviteWorker />
          },
          {
            path: "shift",
            element: <AssignShift />
          },
          {
            path: "allshifts",
            element: <AllShifts />
          },
          {
            path: "history",
            element: <AdminHistoryPage/>
          },
          {
            path: "settings",
            element: <SettingsPage />
          },
          {
            path: "edit/:shift_id",
            element: <EditShiftPage />
          },
          {
            path: "myShift",
            element: <MyShift />
          }
        ]
      },

      {
        path: "workersDash",
        element: (
          <PrivateRoute allowedRoles={["admin", "worker"]}>
             <WorkerDashboardLayout/>
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: <MyShift/>
          },
          {
            path: "colshifts",
            element: <ColleaguesShift/>
          },
          {
            path: "history",
            element: <ColleaguesShift/>
          },
          {
            path: "setting",
            element: <SettingsPage/>
          },
          {
            path: "notice",
            element: <NotificationPage/>
          }
        ]
      }
    ]
  }
])

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
   const userData = dispatch(loggedInUserData()).unwrap()
  }, [dispatch])
  return (
    <RouterProvider router={router} />
  )
}

export default App