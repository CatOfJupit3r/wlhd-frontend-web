import SignIn from '@components/Authentication/SignIn/SignIn'

const SignInPage = () => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
            }}
        >
            <SignIn style={{
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

export default SignInPage
