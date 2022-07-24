import { Typography } from "@mui/material"
import { useContext } from "react"
import { UserContext } from "../../../../context"

export default function Finance() {
  const [state] = useContext(UserContext)

  return (
    <div>
      {state.data?.isAdmin === 'user' && <Typography>hello paid contest</Typography> }
      {state.data?.isAdmin === 'userFree' && <Typography>hello free contest</Typography> }
    </div>
  )
}
