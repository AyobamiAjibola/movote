import { useContext } from "react"
import { UserContext } from "../../../../context"
import AddContestants_MulCat from "../multiple_category/AddContestants_MulCat";
import AddContestants_SingCat from "../single_category/AddContestants_SingCat";

export default function AddContestants() {

    const [state] = useContext(UserContext);

  return (
    <>
      {state.data?.isAdmin === 'user' && <AddContestants_SingCat/>}
      {state.data?.isAdmin ==='userFree' && <AddContestants_SingCat/>}
      {state.data?.isAdmin === 'userMul' && <AddContestants_MulCat/>}
    </>
  )
}
