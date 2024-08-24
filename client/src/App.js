import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import { ContextProvider } from "./ReactContext/Context";
import Signup from "./pages/Signup/Signup";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home/Home";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Mentors from "./pages/Mentors/Mentors";
import Bookings from "./pages/Bookings/Bookings";
import Verify from "./pages/Verify/Verify";

const App = () => {
  return (
    <div className="App">
      <ContextProvider>
        <ToastContainer />
        <Routes>
          <Route element={<ProtectedRoute isAuthRoute={true} />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
          </Route>
          <Route element={<ProtectedRoute isAuthRoute={false} />}>
            <Route path="/" element={<Home />} />
            <Route path="/mentors" element={<Mentors/>} />
            <Route path="/bookings" element={<Bookings/>}/>
            <Route path="/verify" element={<Verify/>} />
          </Route>
        </Routes>
      </ContextProvider>
    </div>
  );
};

export default App;
