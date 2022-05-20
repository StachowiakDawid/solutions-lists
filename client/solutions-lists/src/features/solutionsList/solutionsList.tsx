import React, { FC, useState, useEffect, useRef } from 'react';
import { Container, Spinner, Card, InputGroup, FormControl, Button } from 'react-bootstrap';
import axios from 'axios';
//import { useAppSelector, useAppDispatch } from '../../app/hooks';
import CurrentPath from '../currentPath/currentPath';
import { useParams } from 'react-router-dom';
import Solution from '../solution/solution';
import { input } from '@testing-library/user-event/dist/types/utils';

interface solutionsListProps { };

const SolutionsList: FC<solutionsListProps> = () => {
    const listId = useParams().id;
    const [exercises, setExercises] = useState<any[]>([]);
    const [solutions, setSolutions] = useState<any[]>([]);
    const [loaded, isLoaded] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listId]);

    const load = () => {
        isLoaded(false);
        axios.get(`/api/list/${listId}`).then((response) => {
            setExercises(response.data[0]);
            setSolutions(response.data[1]);
            isLoaded(true);
        });
    }

    const addExercise = () => {
        isLoaded(false);
        axios.post(`/api/list/${listId}/add-exercise`, {name: inputRef.current?.value}).then(() => load());
        inputRef.current!.value = '';
    };

    return <Container>
        <div className="mt-2"><CurrentPath pathTo={listId} type='list' /></div>
        {!loaded && <Spinner animation="border" />}
        {exercises.map((exercise, index) => {
            return <Solution key={index} content={solutions[index].content} type={solutions[index].type}
                exerciseName={exercise.name} exerciseId={exercise.id} id={solutions[index].id} callback={load}/>
        })}
        <Card className="mb-2">
            <Card.Header>Dodaj zadanie</Card.Header>
            <Card.Body>
                <InputGroup className="mb-3">
                    <FormControl ref={inputRef}
                        placeholder="Nazwa zadania"
                    />
                    <Button variant="success" onClick={addExercise}>
                        Dodaj
                    </Button>
                </InputGroup>
            </Card.Body>
        </Card>
    </Container>
}

export default SolutionsList;