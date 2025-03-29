import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, Router, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx'
import SignUp from './pages/SignUp.jsx';
import SignUpCustomer from './pages/SignUpCustomer.jsx';
import SignUpFarmer from './pages/SignUpFarmer.jsx';
import SignUpDeliveryBoy from './pages/SignUpDeliveryBoy.jsx';
import AlertMessage from './components/AlertMessage.jsx';
import HomePageCustomer from './pages/HomePageCustomer.jsx';
import DashboardCustomer from './components/DashboardCustomer.jsx';
import HomePageFarmer from './pages/HomePageFarmer.jsx';
import HomePageDeliveryBoy from './pages/HomePageDeliveryBoy.jsx';
import Success from './components/Success.jsx';
import Cancel from './components/Cancel.jsx';
import TodaysAllProductsFarmer from './components/TodaysAllProductsFarmer.jsx';

const router=createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/logIn' element={<LoginPage/>}/>
      <Route path='/alert' element={<AlertMessage/>}/>
      <Route path='signUp' element={<SignUp/>}/>
      <Route path="/signUpCustomer" element={<SignUpCustomer />} />
      <Route path="/signUpFarmer" element={<SignUpFarmer/>}/>
      <Route path="/signUpDeliveryBoy" element={<SignUpDeliveryBoy/>}/>
      <Route path='/homePageCustomer' element={<HomePageCustomer/>}/>
      <Route path='/DashboardCustomer' element={<DashboardCustomer/>}/>
      <Route path='/homePageFarmer' element={<HomePageFarmer/>}/>
      <Route path='/homePageDeliveryBoy' element={<HomePageDeliveryBoy/>}/>
      <Route path='/success' element={<Success/>}/>
      <Route path='/cancel' element={<Cancel/>}/>
      <Route path='/todaysAllProduct' element={<TodaysAllProductsFarmer/>}/>
    </>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <Provider store={store}>
        <RouterProvider router={router} />
    </Provider> */}
    <RouterProvider router={router} />
  </StrictMode>
)
