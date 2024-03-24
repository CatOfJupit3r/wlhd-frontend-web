import queryString from 'query-string'
import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { setName } from '../redux/slices/gameSlice'

const LoginPage = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const parsedQuery = queryString.parse(location.search)

    const { nickname } = parsedQuery as { nickname: string }

    const redirect = useCallback(() => {
        if (nickname === undefined) {
            navigate('..')
        } else {
            dispatch(setName({ user_name: nickname }))
            navigate('../game')
        }
    }, [nickname, dispatch, navigate])

    useEffect(() => {
        redirect()
    }, [redirect])

    return <></>
}

export default LoginPage
