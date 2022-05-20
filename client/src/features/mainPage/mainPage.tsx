import axios, { AxiosResponse } from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import CurrentPath from '../currentPath/currentPath';
import Explorer from '../explorer/explorer';

//import { useAppSelector, useAppDispatch } from '../../app/hooks';

interface mainPageProps { };

const MainPage: FC<mainPageProps> = () => {
    const folderId = useParams().id;
    const [folders, setFolders] = useState([]);
    const [lists, setLists] = useState([]);
    const [loaded, isLoaded] = useState(false);
    useEffect(() => {
        isLoaded(false);
        axios.get(`/api/folder/${folderId ? folderId : 'root'}`).then((response) => {
            setFolders(response.data.folders.map((folder: any) => [folder.name, folder.id]));
            setLists(response.data.lists.map((list: any) => [list.name, list.id]));
            isLoaded(true);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [folderId]);

    const refresh = (value: AxiosResponse<any, any>) => {
        isLoaded(false);
        axios.get(`/api/folder/${folderId ? folderId : 'root'}`).then((response) => {
            setFolders(response.data.folders.map((folder: any) => [folder.name, folder.id]));
            setLists(response.data.lists.map((list: any) => [list.name, list.id]));
            isLoaded(true);
        });
        return value;
    }

    return <>
        <Container>
            <div className="mt-2"><CurrentPath pathTo={folderId ? folderId : 'root'} type='folder' /></div>
            {!loaded && <Spinner animation="border" />}
            {loaded && <Explorer folders={folders} lists={lists} folderId={folderId ? folderId as string : 'root'} callback={refresh} />}
        </Container>
    </>;
}

export default MainPage;