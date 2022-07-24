import { useContext } from "react"
import { UserContext } from "../../../../context"
import EditContestants_MulCat from "../multiple_category/EditContestants_MulCat"
import EditContestants_SingCat from "../single_category/EditContestants_SingCat"

export function EditContestants () {

    const [state] = useContext(UserContext)

    return (
        <>
            {state.data?.isAdmin === 'user' && <EditContestants_SingCat />}
            {state.data?.isAdmin === 'userFree' && <EditContestants_SingCat />}
            {state.data?.isAdmin === 'userMul' && <EditContestants_MulCat />}
        </>
    )
}