import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {useDispatch, useSelector} from "react-redux";
import {clearNotify, selectNotificationCode, selectNotificationMessage} from "../redux/slices/notifySlice";
import {useEffect} from "react";

const Notify = () => {
    const notificationMessage = useSelector(selectNotificationMessage)
    const notificationCode = useSelector(selectNotificationCode)
    const dispatch = useDispatch()

    useEffect(() => {
        if (notificationMessage){
            if (notificationCode === 200){
                toast.success(notificationMessage)
            } else {
                toast.error(notificationMessage)
            }
            dispatch(clearNotify())
        }
    }, [notificationMessage, notificationCode, dispatch]);

    return (
        <ToastContainer position={"top-right"} autoClose={2000} limit={5} onClick={()=> {
            toast.dismiss()
        }}/>
    );
};

export default Notify;