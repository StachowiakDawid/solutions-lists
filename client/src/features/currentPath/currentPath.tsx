import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
//import { useAppSelector, useAppDispatch } from '../../app/hooks';

interface currentPathProps {
    pathTo?: string;
    type: string;
};

const CurrentPath: FC<currentPathProps> = (props) => {
    const [folders, setFolders] = useState<any[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        setIsLoaded(false);
        axios.get(`/api/path/${props.type}/${props.pathTo}`).then((response: any) => {
            setIsLoaded(true);
            setFolders(response.data.map((folder: any) => ({ name: folder.name, id: folder.id })));
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.pathTo]);
    return <Breadcrumb className={`${isLoaded ? '' : 'invisible'}`} style={{minHeight: '24px'}}>
        {folders.map((folder, index) => (
            <Breadcrumb.Item active={index === folders.length - 1} key={folder.id} onClick={() => navigate(`/folder/${folder.id}`)}>
                {folder.name === 'root' ? 'Strona główna' : folder.name}
            </Breadcrumb.Item>
        ))}
    </Breadcrumb>
}

export default CurrentPath;