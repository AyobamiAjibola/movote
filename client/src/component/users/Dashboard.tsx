import { useContext } from "react";
import { UserContext } from "../../context";
import AdminDashboard from "./admin/pages/AdminDashboard";
import UserDashboard from "./other_users/pages/UserDashboard";


export function Dashboard () {

    const [state] = useContext(UserContext);

    return(
        <>
            {state.data?.isAdmin === 'admin' ? <AdminDashboard /> : <UserDashboard />}
        </>
    )
}