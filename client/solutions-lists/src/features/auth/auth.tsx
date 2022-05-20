import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface loginProps {
    callback?: boolean;
    logout?: boolean;
};

const Login: FC<loginProps> = (props) => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    useEffect(() => {
        if (props.callback) {
            axios.get(`/api/auth/callback${window.location.search}`).then((response) => {
                localStorage.setItem('accessToken', response.data.token);
                localStorage.setItem('userRole', response.data.role);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                navigate('/');
            });
        } else if (props.logout) {
            axios.get(`/api/auth/logout`).then((response) => {
                setMessage(response.data);
            });
        } else {
            axios.get(`/api/auth/redirect`).then((response) => {
                window.location = response.data;
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <><div className="d-flex justify-content-center align-items-center" style={{ height: window.innerHeight }}>{message}{!props.logout && <Spinner animation="border" />}</div></>
}

export default Login;