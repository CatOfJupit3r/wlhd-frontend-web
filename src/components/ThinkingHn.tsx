import React from 'react';
import {Spinner} from "react-bootstrap";

const ThinkingHn = (props: {
    text: string
}) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '1rem',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <h1 style={{
                margin: 0
            }}>{props.text}</h1>
            <Spinner animation="grow" role="status" />
        </div>
    );
};

export default ThinkingHn;