import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import ListPage from './pages/ListPage';
import CreatePage from './pages/CreatePage';
import EditPage from './pages/EditPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="orders" element={<ListPage />} />
          <Route path="orders/new" element={<CreatePage />} />
          <Route path="orders/:id/edit" element={<EditPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
