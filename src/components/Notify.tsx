import { clearNotify, selectNotification } from '@redux/slices/cosmeticsSlice'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Notify = () => {
    const notification = useSelector(selectNotification)
    const dispatch = useDispatch()

    useEffect(() => {
        if (notification.message) {
            if (notification.code === 200) {
                toast.success(notification.message)
            } else {
                toast.error(notification.message)
            }
            dispatch(clearNotify())
        }
    }, [notification, dispatch])

    return (
        <ToastContainer
            position={'bottom-left'}
            autoClose={2000}
            limit={5}
            onClick={() => {
                toast.dismiss()
            }}
        />
    )
}

export default Notify
