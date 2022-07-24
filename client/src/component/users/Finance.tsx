import { useContext } from "react";
import { UserContext } from "../../context";
import FinanceAdmin from "./admin/pages/FinanceAdmin";
import FinanceUser from "./other_users/pages/FinanceUser";


export function Finance () {

    const [state] = useContext(UserContext);

    return(
        <>
            {state.data?.isAdmin === 'admin' && <FinanceAdmin />}
            {state.data?.isAdmin === 'user' && <FinanceUser />}
            {state.data?.isAdmin === 'userFree' && <FinanceUser />}
            {state.data?.isAdmin === 'userMul' && <FinanceUser />}
        </>
    )
}