import axios from 'axios';
import React, { FC, useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

interface uploadProps { };

const Upload: FC<uploadProps> = () => {
    const [selectedFile, setSelectedFile] = useState<File>();
    const exerciseId = useParams().id;
    const navigate = useNavigate();

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmission = () => {
        const formData = new FormData();
        formData.append('File', (selectedFile as Blob));
        formData.append('type', 'img');
        axios.post(`/api/exercise/${exerciseId}/solution`, formData).then((result) => {
            navigate(-1);
        });
    };

    return (
        <Container>
            <Form>
                <Form.Group>
                    <Form.Control className='mt-2' type="file" name="file" onChange={changeHandler} />
                </Form.Group>
                <Form.Group className='mt-2'>
                    <Button onClick={handleSubmission} disabled={selectedFile === undefined}>Wyślij</Button>
                    <Button onClick={() => {navigate(-1)}} className="ms-2">Anuluj</Button>
                </Form.Group>
            </Form>
        </Container>

    );
}

export default Upload;