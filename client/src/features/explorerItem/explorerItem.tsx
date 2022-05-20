import axios, {AxiosResponse} from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { FormControl, ListGroup, Button, FormGroup, ButtonGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
//import { useAppSelector, useAppDispatch } from '../../app/hooks';

interface explorerItemProps {
    type: string;
    name: string;
    id?: string;
    callback: (value: AxiosResponse<any, any>) => AxiosResponse<any, any> | PromiseLike<AxiosResponse<any, any>>;
    folderId: string;
};

const ExplorerItem: FC<explorerItemProps> = (props) => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [inputValue, setInputValue] = useState(props.name);
    const [icon, setIcon] = useState('');

    useEffect(() => {
        if (props.type === 'list') {
            setIcon('bi-file-earmark-text')
        } else if (props.type === 'folder') {
            setIcon('bi-folder-fill');
        } else if (props.type === 'add-folder') {
            setIcon('bi-folder-plus');
        } else if (props.type === 'add-list') {
            setIcon('bi-plus-square');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    }

    const startEditMode = () => {
        setEditMode(true);
        setShowMenu(false);
    }

    const approveChanges = () => {
        if ((props.type === 'list' || props.type === 'folder')) {
            if (inputValue !== props.name) {
                axios.put(`/api/${props.type}/${props.id}`, { name: inputValue }).then(props.callback);
            } else {
                cancelChangingName();
            }
        } else if (props.type === 'add-folder') {
            axios.post(`/api/folder/${props.folderId}/add/folder`, { name: inputValue }).then(props.callback);
        } else if (props.type === 'add-list') {
            axios.post(`/api/folder/${props.folderId}/add/list`, { name: inputValue }).then(props.callback);
        }
    }

    const cancelChangingName = () => {
        setInputValue(props.name);
        setEditMode(false);
    }

    const removeItem = () => {
        setShowMenu(false);
        axios.delete(`/api/${props.type}/${props.id}/`).then(props.callback);
    }

    const handleItemClick = () => {
        if (props.type === 'folder' || props.type === 'list') {
            if (!showMenu) {
                navigate(`/${props.type}/${props.id}`);
            } else {
                setShowMenu(false);
            }
        } else if (props.type === 'add-folder' || props.type === 'add-list') {
            startEditMode();
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }

    return (
        <div className="text-center me-2 mb-2 border rounded position-relative" style={{ width: '150px' }} onClick={handleItemClick}>
            {localStorage.getItem('userRole') === 'admin' && <div className="d-flex justify-content-end">
                <i className={`bi bi-three-dots-vertical ${props.type === 'folder' || props.type === 'list' ? '' : 'd-none'}`}
                    onClick={(e: React.MouseEvent<HTMLElement>) => { toggleMenu(); e.stopPropagation(); }}>
                </i>
            </div>}
            {localStorage.getItem('userRole') === 'admin' &&
                <div style={{ height: '24px' }} className={`${props.type === 'add-folder' || props.type === 'add-list' ? '' : 'd-none'}`}></div>}
            <ListGroup className={`position-absolute w-100 ${showMenu ? '' : 'd-none'}`}
                onClick={(e: React.MouseEvent<HTMLElement>) => e.stopPropagation()}>
                <ListGroup.Item className="d-flex justify-content-between" action onClick={startEditMode}>Zmień nazwę <i className="bi bi-pencil"></i></ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between" action onClick={removeItem}>Usuń <i className="bi bi-trash"></i></ListGroup.Item>
            </ListGroup>
            <i className={`bi ${icon} me-2 ms-2`} style={{ fontSize: '100px' }}></i>
            <p>{!editMode && props.name}</p>
            {editMode && <FormGroup onClick={(e: React.MouseEvent<HTMLElement>) => e.stopPropagation()} className="ms-1 me-1">
                <FormControl
                    placeholder="Nazwa pliku"
                    defaultValue={inputValue}
                    onChange={handleInputChange}
                />
                <ButtonGroup className="m-2">
                    <Button variant="outline-secondary" onClick={cancelChangingName}><i className="bi bi-x-circle"></i></Button>
                    <Button variant="outline-secondary" onClick={approveChanges}><i className="bi bi-check2"></i></Button>
                </ButtonGroup>
            </FormGroup>}
        </div>
    )
}

export default ExplorerItem;