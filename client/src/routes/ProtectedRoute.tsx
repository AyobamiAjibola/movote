import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { UserContext } from "../context";
import Loader from "./Loader";

export default function ProtectedRoute() {
    const [state] = useContext(UserContext)

    if(state.loading) return <Loader />

    return state.data ? <Outlet /> : <Navigate to="/"/>
}
