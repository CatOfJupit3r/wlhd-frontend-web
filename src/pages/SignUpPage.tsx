import SignUp from '../components/Authentication/SignUp/SignUp'

const SignUpPage = () => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
            }}
        >
            <SignUp style={{
                marginTop: '30vh',
            }}/>
            <div style={{
                backgroundColor: 'black',
                flexGrow: 1, /* Takes remaining space */
                height: '100vh',
            }}>
            </div>
        </div>
    )
}

export default SignUpPage
