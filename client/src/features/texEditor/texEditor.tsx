import { MathJax } from 'better-react-mathjax';
import React, { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Container, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
//import { useAppSelector, useAppDispatch } from '../../app/hooks';

interface texEditorProps { };

const TexEditor: FC<texEditorProps> = (props) => {
    const navigate = useNavigate();
    const [content, setContent] = useState('');
    const exerciseId = useParams().id;
    const edit = useParams().edit === 'edit';
    const [loaded, isLoaded] = useState(!edit);
    useEffect(() => {
        if (edit) {
            axios.get(`/api/exercise/${exerciseId}/solution/`).then((response) => {
                setContent(response.data.content);
                isLoaded(true);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContent(e.target.value);
    }

    const handleClick = () => {
        axios.post(`/api/exercise/${exerciseId}/solution/`, {
            content: content,
            type: 'tex',
        }).then(() => {
            navigate(-1);
        });
    }

    return <Container>
        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Wpisz rozwiązanie:</Form.Label>
            {!loaded ? <div><Spinner animation="border" /></div> : <Form.Control as="textarea" rows={3} onChange={handleChange} defaultValue={content}></Form.Control>}
            <Button className="mt-2" variant="outline-primary" onClick={handleClick}>
                Zapisz <i className="bi bi-upload"></i>
            </Button>
            <Button onClick={() => { navigate(-1) }} className="ms-2 mt-2" variant="outline-primary">Anuluj</Button>
        </Form.Group>
        <MathJax>{content}</MathJax>
    </Container>
}

export default TexEditor;