import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import HomePage from './pages/HomePage.jsx';
import NewReportPage from './pages/NewReportPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface-page)]">
      <NavBar />
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/new" element={<NewReportPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/dashboard/:id" element={<DashboardPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
