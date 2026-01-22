import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { QuizContainer } from './components/Quiz/QuizContainer';
import { LocationPage } from './components/ElectorateLookup/LocationPage';
import { ResultsPage } from './components/Results/ResultsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="quiz" element={<QuizContainer />} />
          <Route path="location" element={<LocationPage />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="methodology" element={<MethodologyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
