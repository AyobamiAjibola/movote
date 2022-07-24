import { useContext } from "react"
import { UserContext } from "../../../../context"
import Finance_MulCat from "../multiple_category/Finance_MulCat"
import Finance_SingCat from "../single_category/Finance_SingCat"

export default function FinanceUser() {
  const [state] = useContext(UserContext)

  return (
    <div>
      {state.data?.isAdmin === 'user' && <Finance_SingCat /> }
      {state.data?.isAdmin === 'userFree' && <Finance_SingCat /> }
      {state.data?.isAdmin === 'userMul' && <Finance_MulCat /> }
    </div>
  )
}
