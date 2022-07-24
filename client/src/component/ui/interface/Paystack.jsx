import { Button } from "@mui/material";
import PaystackPop from '@paystack/inline-js';
import axios from "axios";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SnackContext } from "../../../context";


export default function Paystack ({values, data}) {

    const { id } = useParams();
    const navigate = useNavigate();
    const costOfVotes = values * 100;
    const [state, setState] = useContext(SnackContext)

    const updateVote = async (e) => {
        e.preventDefault();
        try {
            let vote = values;
            const paystack = new PaystackPop()
            paystack.newTransaction({
                key: 'pk_test_9645fa44dec73d5b8609d817a8b31a30e42b3da3',
                amount: costOfVotes * 100,
                email: 'admin@gmail.com',
                firstname: data?.username,
                lastname: data?.fname,
                onSuccess(transaction){
                    if(transaction.status === 'success'){
                        axios.put(`http://localhost:8000/contestant/vote/${id}`, {
                            vote
                        }).then((res) => {
                            if(res.statusText === 'OK'){
                                setState({...state, updateList: true, voteSuccess: true})
                                navigate(-1)
                            }
                          }).catch((err) => console.log(err.message))
                    } else {
                        console.log("fail")
                    }
                },
                onCancel(){
                    setState({...state, delContest: true})
                }
            });
        } catch (err) {
            console.log(err.message);
        }
    }

    return (
        <>
            <Button
                disabled={data?.status === 'pending'}
                variant="contained"
                onClick={e => updateVote(e)}
                sx={{
                  width: "40%",
                  color: "white",
                  backgroundColor: "#433461",
                  boxShadow: 4,
                  '&:hover': {backgroundColor: "white", color: "#433461", fontWeight: 800},
                  mt: 5
                }}
              >
                Send Vote
              </Button>
        </>
    )
}