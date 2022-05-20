import React, { FC, useState, useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import axios from 'axios';
//import { useAppSelector, useAppDispatch } from '../../app/hooks';
import CurrentPath from '../currentPath/currentPath';
import { useParams } from 'react-router-dom';
import Solution from '../solution/solution';

interface solutionsListProps { };

const SolutionsList: FC<solutionsListProps> = () => {
    const listId = useParams().id;
    const [exercises, setExercises] = useState<any[]>([]);
    const [solutions, setSolutions] = useState<any[]>([]);
    const [loaded, isLoaded] = useState(false);

    useEffect(() => {
        isLoaded(false);
        axios.get(`/api/list/${listId}`).then((response) => {
            setExercises(response.data[0]);
            setSolutions(response.data[1]);
            isLoaded(true);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listId]);
    return <Container>
        <div className="mt-2"><CurrentPath pathTo={listId} type='list' /></div>
        {!loaded && <Spinner animation="border" />}
        {exercises.map((exercise, index) => {
            return <Solution key={index} content={solutions[index].content} type={solutions[index].type} 
            exerciseName={exercise.name} exerciseId={exercise.id} id={solutions[index].id}/>
        })}
    </Container>
}

export default SolutionsList;