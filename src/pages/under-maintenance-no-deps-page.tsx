const UnderMaintenanceNoDepsPage = () => {
    /**
     * This component is a fallback page for when the app is unable to reach the server.
     * It provides a simple message and a button to reload the page.
     */
    return (
        <div
            style={{
                margin: 0,
                marginTop: '10vh',
                display: 'flex',
                height: '100vh',
                width: '100%',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '30rem' }}>
                <h3 style={{ wordBreak: 'break-word' }}>
                    It seems your browser is unable to reach our servers. Please try again later.
                </h3>
                <button
                    type="button"
                    style={{
                        height: '48px',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        padding: '0 24px',
                        textAlign: 'left',
                        alignItems: 'baseline',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                    }}
                    onClick={() => {
                        window.location.reload();
                    }}
                >
                    <span style={{ marginRight: '16px', display: 'inline-block', transform: 'rotate(90deg)' }}>
                        &#8635;
                    </span>{' '}
                    Try Again :(
                </button>
                <p style={{ maxWidth: '30rem', opacity: 0.6 }}>
                    If you believe this shouldn’t have happened or the issue persists, please contact me at{' '}
                    <a
                        href="https://github.com/CatOfJupit3r"
                        style={{ fontWeight: 'bold', color: 'blue', textDecoration: 'none' }}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub
                    </a>
                    . I’m grateful for your patience and support! It means a lot to me.
                </p>
            </div>
        </div>
    );
};

export default UnderMaintenanceNoDepsPage;
