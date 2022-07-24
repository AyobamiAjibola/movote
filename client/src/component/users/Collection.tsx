import { useContext } from "react";
import { UserContext } from "../../context";
import Contest from "./admin/pages/Contest";
import { Contestants } from "./other_users/pages/Contestants";


export function Collection () {

    const [state] = useContext(UserContext);

    return(
        <>
            {state.data?.isAdmin === 'admin' && <Contest />}
            {state.data?.isAdmin === 'user' && <Contestants />}
            {state.data?.isAdmin === 'userFree' && <Contestants />}
            {state.data?.isAdmin === 'userMul' && <Contestants />}
        </>
    )
}