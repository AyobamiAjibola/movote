import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./component/ui/pages/home/Home";
import LandingPage from "./component/users/LandingPage";
import SideBar from "./component/users/SideBar";
import ViewUser from "./component/users/ViewUser";
import { UserContext } from "./context";
import { useContext } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Dashboard} from "./component/users/Dashboard";
import {Finance} from "./component/users/Finance";
import { Collection } from "./component/users/Collection";
import { EditContestants } from "./component/users/other_users/pages/EditContestants";
import Contestants from "./component/ui/interface/Contestants";
import ContestantDetail from "./component/ui/interface/ContestantDetail";
import NotFound from "./component/users/NotFound";


function App() {

  const [state, setState] = useContext(UserContext)

  const handleLogout = () => {
    setState({data: null, loading: false, error: null});
    localStorage.removeItem("token")
}

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/contestants/:id" element={<Contestants/>}/>
        <Route path="/vote/:id" element={<ContestantDetail/>}/>
        <Route path="/land" element={<ProtectedRoute/>}>
          <Route path="/land" element={<LandingPage/>}/>
        </Route>
        <Route element={<ProtectedRoute/>}>
            <Route path="/dashboard" element={<SideBar logout={handleLogout} />}>
              <Route path="/dashboard" element={<Dashboard />}/>
            </Route>
            <Route path="/contest" element={<SideBar logout={handleLogout} />}>
              <Route path="/contest" element={<Collection />}/>
            </Route>
            <Route path="/finance" element={<SideBar logout={handleLogout} />}>
              <Route path="/finance" element={<Finance />}/>
            </Route>
            <Route path="/view" element={<SideBar logout={handleLogout} />}>
              <Route path="/view" element={<ViewUser />}/>
            </Route>
            <Route path="/contest/:id" element={<SideBar logout={handleLogout} />}>
              <Route path="/contest/:id" element={<EditContestants />}/>
            </Route>
        </Route>
        <Route path="/*" element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
