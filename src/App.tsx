import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Segment from "./pages/segment";
import { PUBLIC_ROUTES } from './constants/routes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path={PUBLIC_ROUTES.HOME_PAGE} element={<Segment />} />
        <Route path={PUBLIC_ROUTES.NOT_FOUND} element={<Navigate to={PUBLIC_ROUTES.HOME_PAGE} />} />
      </Routes>
    </Router>
  );
}

export default App;
