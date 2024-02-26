import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {useDispatch, useSelector} from "react-redux";
import {clearError, selectErrorMessage} from "../../redux/slices/errorSlice";
import {useEffect} from "react";

const Error = () => {
    const errorMessage = useSelector(selectErrorMessage)
    const dispatch = useDispatch()

    useEffect(() => {
        if (errorMessage){
            toast.error(errorMessage.message)
            dispatch(clearError())
        }
    }, [errorMessage, dispatch]);

    return (
        <ToastContainer position={"top-right"} autoClose={2000} limit={5}/>
    );
};

export default Error;