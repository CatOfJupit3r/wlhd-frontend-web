import SignUp from '@components/Authentication/SignUp';

const SignUpPage = () => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
            }}
        >
            <SignUp className={'mt-[30vh]'} />
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

export default SignUpPage;
