import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Container from "./components/Container";
import Home from "./pages/home";
import SignIn from "./pages/login";
import SignUp from "./pages/signup";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loader from "./components/loader";
import ResetPass from "./pages/resetPass";
import NewPass from "./pages/newPass";
import CreatePost from "./createPost/createPost";
import Profile from "./components/Profile";
import Message from "./chat/index";
import PeopleProfile from "./components/peopleProfile";
import Explore from "./components/Explore";
import Settings from "./pages/Settings";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/auth/Admin";
import Emailveri from "./pages/emailveri";


const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.user.user);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {

    if (!user.user) {
      if (location.pathname !== '/auth/newPassword' && location.pathname !== '/auth/signup') {
        navigate('/auth/signin');
      }
    }

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <Loader />;
  }




  return (
    <Container>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/resetpassword" element={<ResetPass />} />
        <Route path="auth/emailveri" element={<Emailveri />} />
        <Route path="/auth/newPassword" element={<NewPass />} />
        <Route path="/createPost" element={<CreatePost />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Message" element={<Message />} />
        <Route path="/peopleProfile/:id" element={<PeopleProfile />} />
        <Route path="/Explore" element={<Explore />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/AdminLogin" element={<AdminLogin />} />
        <Route path="/Admin" element={<Admin />} />
      </Routes>
    </Container>
  );
};

export default App;
