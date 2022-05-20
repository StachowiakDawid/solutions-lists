import React, { FC } from 'react';
import ExplorerItem from '../explorerItem/explorerItem'
//import { useAppSelector, useAppDispatch } from '../../app/hooks';

interface explorerProps {
    folders: Array<Array<string>>;
    lists: Array<Array<string>[2]>;
    folderId: string;
    callback: Function;
};

const Explorer: FC<explorerProps> = (props) => {
    return (
        <>
            <div className="mb-3">{(props.folders.length === 0 && props.lists.length === 0) && 'Ten folder jest pusty.'}</div>
            <div className="d-flex flex-wrap">
                {props.folders.map((folder, index) => (
                    <ExplorerItem key={index} type="folder" name={folder[0]} id={folder[1]} callback={props.callback} folderId={props.folderId} />
                ))}
                {props.lists.map((list, index) => (
                    <ExplorerItem key={index} type="list" name={list[0]} id={list[1]} callback={props.callback} folderId={props.folderId} />
                ))}
                {localStorage.getItem('userRole') === 'admin' && <><ExplorerItem type="add-folder" name="Nowy folder" callback={props.callback} folderId={props.folderId}/>
                <ExplorerItem type="add-list" name="Nowa lista" callback={props.callback} folderId={props.folderId}/></>}
            </div>
        </>
    )
}

export default Explorer;