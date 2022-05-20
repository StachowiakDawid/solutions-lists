import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { Card, Dropdown, DropdownButton, Form, FormGroup, Button, InputGroup, Spinner, FormControl } from 'react-bootstrap';
import { MathJax } from 'better-react-mathjax';
import axios from 'axios';
//import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { useNavigate } from 'react-router-dom';

interface solutionProps {
    type: string;
    content: string;
    id?: number;
    exerciseName: string;
    exerciseId: string;
    callback: Function;
};

const Solution: FC<solutionProps> = (props) => {
    const navigate = useNavigate();
    const [type, setType] = useState(props.type);
    const [selected, setSelected] = useState(props.id);
    const [solutionId, setSolutionId] = useState(props.id ? props.id : -1);
    const [isLoaded, setIsLoaded] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [inputValue, setInputValue] = useState(props.exerciseName);
    const [content, setContent] = useState(props.content);
    const [exerciseName, setExerciseName] = useState(props.exerciseName);
    const [solutions, setSolutions] = useState<any[]>([]);

    useEffect(() => {
        if (localStorage.getItem('userRole') === 'admin') {
            axios.get(`/api/exercise/${props.exerciseId}/all-solutions`).then((response) => setSolutions(response.data));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelected(parseInt(e.target.value));
        setIsLoaded(false);
        axios.get(`/api/solution/${e.target.value}`).then((response) => {
            setType(response.data.type);
            setContent(response.data.content);
            setIsLoaded(true);
        });
    }

    const changeName = () => {
        setEditMode(false);
        const params: any = {};
        params.name = inputValue;
        params.solution_id = solutionId === -1 ? null : solutionId;
        axios.put(`/api/exercise/${props.exerciseId}`, params).then(() => setExerciseName(inputValue));
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }

    const changeSolution = () => {
        if (selected !== solutionId && selected) {
            axios.put(`/api/exercise/${props.exerciseId}`, { solution_id: selected }).then(() => {
                axios.get(`/api/exercise/${props.exerciseId}/all-solutions`).then((response) => {
                    setSolutionId(selected);
                    setSolutions(response.data)
                });
            });
        } else {
            axios.put(`/api/exercise/${props.exerciseId}`, { solution_id: null }).then(() => {
                axios.get(`/api/exercise/${props.exerciseId}/all-solutions`).then((response) => {
                    setSolutions(response.data)
                });
                axios.get(`/api/exercise/${props.exerciseId}/solution`).then((response) => {
                    setType(response.data.type);
                    setContent(response.data.content);
                    if (response.data.type === 'none') {
                        setSolutionId(-1);
                    }
                })
            });
        }
    }

    const removeExercise = () => {
        axios.delete(`/api/exercise/${props.exerciseId}`).then(() => props.callback());
    }

    return <Card className="mb-2">
        <div className="card-header d-flex flex-wrap justify-content-between align-items-center">
            {!editMode && exerciseName}
            {editMode && <InputGroup onClick={(e: React.MouseEvent<HTMLElement>) => e.stopPropagation()} className="mt-1 mb-1 w-50">
                <FormControl
                    placeholder="Nazwa zadania"
                    defaultValue={exerciseName}
                    onChange={handleInputChange}
                />
                <Button variant="outline-secondary" onClick={changeName}><i className="bi bi-check2"></i></Button>
            </InputGroup>}
            <div className={`d-flex ms-auto ${localStorage.getItem('userRole') === 'admin' && 'mt-1 mb-1'}`}>
                {localStorage.getItem('userRole') === 'admin' &&
                    <>
                        <Button variant="outline-secondary me-1" onClick={removeExercise}>Usuń zadanie</Button>
                        <Button variant="outline-secondary me-1" onClick={() => { setEditMode(!editMode) }}>{editMode ? 'Anuluj' : 'Zmień nazwę'}</Button>
                    </>}
                <DropdownButton variant="outline-secondary" id="1" title="Dodaj rozwiązanie">
                    <Dropdown.Item onClick={() => { navigate(`/upload/${props.exerciseId}`) }}>Prześlj obraz</Dropdown.Item>
                    <Dropdown.Item onClick={() => { navigate(`/canvas-editor/${props.exerciseId}`) }}>Narysuj na kanwie</Dropdown.Item>
                    <Dropdown.Item onClick={() => { navigate(`/tex-editor/${props.exerciseId}`) }}>Zapisz w TeXu</Dropdown.Item>
                    {type === 'tex' && <Dropdown.Item onClick={() => { navigate(`/tex-editor/${props.exerciseId}/edit`) }}>Edytuj istniejące</Dropdown.Item>}
                </DropdownButton>
            </div>
        </div>
        <Card.Body className={type === 'img' || !isLoaded ? 'text-center' : ''}>
            {solutions[0] && localStorage.getItem('userRole') === 'admin' && <FormGroup className="mb-3">
                <InputGroup>
                    <Form.Select onChange={(e) => { handleSelectChange(e) }}>
                        {type === 'none' && <option>-</option>}
                        {solutions.map((solution) => (
                            <option key={solution.id} value={solution.id} selected={solution.id === solutionId}>{solution.user_id}</option>
                        ))}
                    </Form.Select>
                    <Button onClick={changeSolution}>{selected === solutionId ? 'Cofnij zatwierdzenie' : 'Zatwierdź'}</Button>
                </InputGroup>
            </FormGroup>}
            <div className={isLoaded ? '' : 'd-none'}>
                {type === 'none' && <Card.Text>{!solutions[0] ? 'Brak rozwiązań' : 'Brak zatwierdzonego rozwiązania.'}</Card.Text>}
                {type === 'tex' && <Card.Text><MathJax>{content}</MathJax></Card.Text>}
                {type === 'img' && <Card.Text><img src={`http://localhost:8000/storage/${content}`} style={{ maxWidth: '100%' }} alt="" /></Card.Text>}
            </div>
            {!isLoaded && <Spinner animation="border" />}
        </Card.Body>
    </Card>
}

export default Solution;