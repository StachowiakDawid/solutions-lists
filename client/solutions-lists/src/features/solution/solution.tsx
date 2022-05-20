import React, { FC, useEffect, useState } from 'react';
import { Card, Dropdown, DropdownButton, Form, FormGroup, Button, InputGroup } from 'react-bootstrap';
import { MathJax } from 'better-react-mathjax';
import axios from 'axios';
//import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { useNavigate } from 'react-router-dom';

interface solutionProps {
    type: string;
    content: string;
    exerciseName: string;
    exerciseId: string;
};

const Solution: FC<solutionProps> = (props) => {
    const navigate = useNavigate();
    const [type, setType] = useState(props.type);
    const [content, setContent] = useState(props.content);
    const [solutions, setSolutions] = useState<any[]>([]);

    useEffect(() => {
        axios.get(`/api/exercise/${props.exerciseId}/all-solutions`).then((response) => setSolutions(response.data));
    }, []);

    return <Card className="mb-2">
        <div className="card-header d-flex flex-wrap justify-content-between align-items-center">
            {props.exerciseName} Lorem ipsum dolor sit amet
            <DropdownButton variant="outline-secondary" id="1" title="Dodaj rozwiązanie" className="ms-auto">
                <Dropdown.Item onClick={() => { navigate(`/upload/${props.exerciseId}`) }}>Prześlj obraz</Dropdown.Item>
                <Dropdown.Item onClick={() => { navigate(`/canvas-editor/${props.exerciseId}`) }}>Narysuj na kanwie</Dropdown.Item>
                <Dropdown.Item onClick={() => { navigate(`/tex-editor/${props.exerciseId}`) }}>Zapisz w TeXu</Dropdown.Item>
                {type === 'tex' && <Dropdown.Item onClick={() => { navigate(`/tex-editor/${props.exerciseId}/edit`) }}>Edytuj istniejące</Dropdown.Item>}
            </DropdownButton>
        </div>
        <Card.Body className={type === 'img' ? 'text-center' : ''}>
            <FormGroup className="mb-3">
                <InputGroup>
                    <Form.Select>
                        {solutions.map((solution, index) => {
                            return <option key={index}>{solution.user_id}</option>
                        })}
                    </Form.Select>
                    <Button>Zatwierdź</Button>
                </InputGroup>
            </FormGroup>
            {type === 'none' && <Card.Text>Brak rozwiązań.</Card.Text>}
            {type === 'tex' && <Card.Text><MathJax>{content}</MathJax></Card.Text>}
            {type === 'img' && <Card.Text><img src={`http://localhost/storage/${content}`} style={{ maxWidth: '100%' }} alt="" /></Card.Text>}
        </Card.Body>
    </Card>
}

export default Solution;