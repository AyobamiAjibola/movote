import { createContext, useEffect, useState } from "react";
import axios from "axios";

interface User {
    data: {
        id: string;
        isAdmin: string;
    } | null;
    error: string | null;
    loading: boolean;
}

interface Snack {
  addContest: boolean;
  delContest: boolean;
  editContest: boolean;
  editPicture: boolean;
  growTransition: boolean;
  transition: boolean;
  updateList: boolean;
  editProfile: boolean;
  change: boolean;
  voteSuccess: boolean;
}

const UserContext = createContext<
    [User, React.Dispatch<React.SetStateAction<User>>]
>([
    {data: null,
    loading: true,
    error: null},
    () => {}

])

const SnackContext = createContext<
    [Snack, React.Dispatch<React.SetStateAction<Snack>>]
>([
    {addContest: false,
    delContest: false,
    editContest: false,
    editPicture: false,
    growTransition: false,
    transition: false,
    updateList: false,
    editProfile: false,
    change: false,
    voteSuccess: false},
    () => {}

])

const UserProvider = ({children}: any) => {

  const [user, setUser] = useState<User>({
    data: null,
    loading: true,
    error: null,
   });

   const [state, setState] = useState<Snack>({
    addContest: false,
    delContest: false,
    editContest: false,
    editPicture: false,
    growTransition: false,
    transition: false,
    updateList: false,
    editProfile: false,
    change: false,
    voteSuccess: false,
   });

   const token = localStorage.getItem("token");

   if(token) {
     axios.defaults.headers.common["token"] = `${token}`;
   }

   const fetchUser = async () => {
     const { data: response } = await axios.get("http://localhost:8000/auth/verify");

     if(response.data && response.data.user) {
       setUser({
         data: {
           id: response.data.user.id,
           isAdmin: response.data.user.isAdmin
         },
         loading: false,
         error: null
       });
     } else if (response.data && response.data.errors.length) {
        setUser({
          data: null,
          loading: false,
          error: response.errors[0].msg,
        });
     }
   };

   useEffect(()=> {
    if (token) {
      fetchUser();
    } else {
      setUser({
        data: null,
        loading: false,
        error: null,
      });
    }
   }, [token])

   return (
     <UserContext.Provider value={[user, setUser]}>
      <SnackContext.Provider value={[state, setState]}>
        {children}
      </SnackContext.Provider>
     </UserContext.Provider>
   )
};

export { UserContext, UserProvider, SnackContext }

