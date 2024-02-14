import React from 'react';
import NicknameEnter from '../components/NicknameEnter';


class HomePage extends React.Component {
    render() {
        return (
            <div>
                <h1>Welcome to the Home Page</h1>
                <NicknameEnter />
            </div>
        );
    }
}

export default HomePage;
