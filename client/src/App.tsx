import React from 'react';
import MainPageComponent from './features/mainPage/mainPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SolutionsList from './features/solutionsList/solutionsList';
import TexEditor from './features/texEditor/texEditor';
import CanvasEditor from './features/canvasEditor/canvasEditor';
import Auth from './features/auth/auth';
import Upload from './features/upload/upload';

function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainPageComponent />} />
      <Route path="/folder/:id" element={<MainPageComponent />} />
      <Route path="/list/:id" element={<SolutionsList />} />
      <Route path="/tex-editor/:id/" element={<TexEditor />} />
      <Route path="/tex-editor/:id/:edit" element={<TexEditor />} />
      <Route path="/canvas-editor/:id" element={<CanvasEditor />} />
      <Route path="/upload/:id" element={<Upload />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/callback" element={<Auth callback={true} />} />
      <Route path="/logout" element={<Auth logout={true} />} />
    </Routes>
  </BrowserRouter>;
}

export default App;
