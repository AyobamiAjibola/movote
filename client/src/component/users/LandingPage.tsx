import { useContext, useEffect } from "react";
import { UserContext } from "../../context";
import SideBar from "./SideBar";
import { useNavigate } from "react-router-dom";

export default function LandingPage () {
    const navigate = useNavigate();

    const [state, setState] = useContext(UserContext)

    const handleLogout = () => {
        setState({data: null, loading: false, error: null});
        localStorage.removeItem("token")
        navigate("/")
    }

    useEffect(() => {
        setTimeout(() => {
            setState({data: null, loading: false, error: null});
            localStorage.removeItem("token")
            navigate("/")
        }, 1000 * 60 * 60 )
    })

    return (
        <div>
            {state.data?.isAdmin && <SideBar logout={handleLogout}/>}
        </div>
    )
}