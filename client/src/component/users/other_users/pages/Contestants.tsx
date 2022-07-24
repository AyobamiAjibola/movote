import axios from "axios"
import { useContext, useState } from "react"
import { SnackContext, UserContext } from "../../../../context"
import Contestants_MulCat from "../multiple_category/Contestants_MulCat"
import Contestants_SingCat from "../single_category/Contestants_SingCat"

interface Things{
  isLoading: boolean,
  errMsg: string
  }

export function Contestants() {
  const [values] = useContext(UserContext);
  const [state, setState] = useContext(SnackContext);
  const [msgLoad, setMsgLoad] = useState<Things>({
    errMsg: '',
    isLoading: false
  });

  const activateAll = async () => {
    try {
      setMsgLoad({...msgLoad, isLoading: true})
      await axios.put(`http://localhost:8000/contestant/change_status_active`)
      setMsgLoad({...msgLoad, isLoading: false})
      setState({...state, updateList: true})
      } catch (error) {
        setMsgLoad({...msgLoad, isLoading: false})
    }
  }

  const deActivateAll = async () => {
    try {
      setMsgLoad({...msgLoad, isLoading: true})
      await axios.put(`http://localhost:8000/contestant/change_status_deactive`)
      setMsgLoad({...msgLoad, isLoading: false})
      setState({...state, updateList: true})
      } catch (error) {
        setMsgLoad({...msgLoad, isLoading: false})
    }
  }

  const activate = async (id: string) => {
    try {
      await axios.put(`http://localhost:8000/contestant/status_activate/${id}`)
      setState({...state, updateList: true})
      } catch (error) {
    }
  }

  return (
    <>
      {values.data?.isAdmin === 'user' &&
        <Contestants_SingCat
          activateAll={activateAll}
          deActivateAll={deActivateAll}
          activate={activate}
          msgLoad={msgLoad}
        />}
      {values.data?.isAdmin === 'userFree' &&
        <Contestants_SingCat
          activateAll={activateAll}
          deActivateAll={deActivateAll}
          activate={activate}
          msgLoad={msgLoad}
        />}
      {values.data?.isAdmin === 'userMul' &&
        <Contestants_MulCat
          activateAll={activateAll}
          deActivateAll={deActivateAll}
          activate={activate}
          msgLoad={msgLoad}
        />}
    </>
  )
}