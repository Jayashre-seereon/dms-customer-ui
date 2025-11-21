import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./pages/Dashboard";
import ProfileSettings from "./pages/ProfileSettings";
import Layout from "./pages/Layout";
import SaleContract from"./pages/SaleContract";
import SaleOrder from "./pages/SaleOrder"
import SalReturn from "./pages/SaleReturn"
import DeliveryStatus from "./pages/DelivereyStatus"
import Reports from "./pages/Reports"
import Transactions from "./pages/Transactions"
import RiseDispute from "./pages/RiseDispute"
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sale-contract" element={<SaleContract />} />
            <Route path="/sale-order"element={<SaleOrder/>}/> 
            <Route path="/sale-return" element={<SalReturn />} />
            <Route path="/deliverey-status" element={<DeliveryStatus/>} />
            <Route path="/rise-dispute" element={<RiseDispute/>}/>
            <Route path="/profile-settings"element={<ProfileSettings/>}/>  
            <Route path="/reports" element={<Reports />} />
            <Route path="/transactions"element={<Transactions/>}/>
            
             </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
