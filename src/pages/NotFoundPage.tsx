import React from 'react'

class NotFoundPage extends React.Component {
    render() {
        return (
            <div>
                <h1>Page Not Found</h1>
                <p>The page you are looking for does not exist.</p>
            </div>
        );
    }
}

export { NotFoundPage as default };
