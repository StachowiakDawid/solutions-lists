import axios from 'axios';
import React, { FC, useState, useRef } from 'react';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';
import CanvasDraw from "react-canvas-draw";
import { useParams, useNavigate } from 'react-router-dom';
import './canvasEditor.scss';
//import { useAppSelector, useAppDispatch } from '../../app/hooks';

interface canvasEditorProps {
    canvasWidth?: number;
    canvasHeight?: number;
    canvasBg?: string;
    brushColor?: string;
};

const CanvasEditor: FC<canvasEditorProps> = (props) => {
    const [canvasWidth, setCanvasWidth] = useState(props.canvasWidth);
    const [canvasHeight, setCanvasHeight] = useState(props.canvasHeight);
    const [canvasBg, setCanvasBg] = useState(props.canvasBg);
    const [brushColor, setBrushColor] = useState(props.brushColor);
    const exerciseId = useParams().id;
    const navigate = useNavigate();
    const canvasRef = useRef<any>(null);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "canvasWidth") {
            setCanvasWidth(e.target.validity.valid ? parseInt(e.target.value) : canvasWidth);
        } else if (e.target.name === "canvasHeight") {
            setCanvasHeight(e.target.validity.valid ? parseInt(e.target.value) : canvasHeight);
        } else if (e.target.name === "canvasBg") {
            setCanvasBg(e.target.value);
        }
        else if (e.target.name === "brushColor") {
            setBrushColor(e.target.value);
        }
    }

    const handleClick = () => {
        axios.post(`/api/exercise/${exerciseId}/solution/`, {
            content: canvasRef.current?.getDataURL().split(',')[1],
            type: 'canvas',
        }).then(() => {
            navigate(-1);
        });
    }

    return <Container fluid>
        <Form.Group className="mt-3">
            <Container>
                <Row>
                    <Col md={5} xs={6}>
                        <Form.Label>Szerokość kanwy:</Form.Label>
                        <Form.Control type="number" defaultValue={canvasWidth} min={1} max={window.innerWidth} className="mb-2" name="canvasWidth"
                            onChange={handleChange}></Form.Control>
                    </Col>
                    <Col md={5} xs={6}>
                        <Form.Label>Wysokość kanwy:</Form.Label>
                        <Form.Control type="number" defaultValue={canvasHeight} min={1} className="mb-2" name="canvasHeight" onChange={handleChange}></Form.Control>
                    </Col>
                    <Col md={2} xs={6}>
                        <Form.Label>Kolor pędzla:</Form.Label>
                        <Form.Control type="color" className="mb-2" name="brushColor" defaultValue={brushColor} onChange={handleChange}></Form.Control>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <Button onClick={() => { canvasRef.current?.undo() }} className="me-2" variant="outline-primary">
                            Cofnij <i className="bi bi-arrow-counterclockwise"></i></Button>
                        <Button onClick={() => { canvasRef.current?.eraseAll(); }} className="me-2" variant="outline-primary">
                            Wyczyść <i className="bi bi-x-circle"></i></Button>
                        <Button onClick={handleClick} className="me-2" variant="outline-primary">
                            Zapisz  <i className="bi bi-upload"></i></Button>
                        <Button onClick={() => { navigate(-1) }} className="me-2" variant="outline-primary">Anuluj</Button>
                    </Col>
                </Row>
            </Container>
        </Form.Group>
        <div className="d-flex justify-content-center mt-2" style={{ overflow: 'scroll' }}>
            <CanvasDraw ref={canvasRef} brushRadius={2} lazyRadius={2} canvasWidth={canvasWidth} canvasHeight={canvasHeight}
                enablePanAndZoom={false} imgSrc={canvasBg} brushColor={brushColor} />
        </div>
    </Container>
}

CanvasEditor.defaultProps = {
    canvasWidth: 400,
    canvasHeight: 400,
    canvasBg: '',
    brushColor: '#000000',
}

export default CanvasEditor;