import SignIn from '@components/Authentication/SignIn';

const SignInPage = () => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
            }}
        >
            <SignIn className={'mt-[25vh]'} />
            <div
                style={{
                    backgroundColor: 'black',
                    flexGrow: 1 /* Takes remaining space */,
                    height: '100vh',
                }}
            />
        </div>
    );
};

export default SignInPage;
