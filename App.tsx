import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import ResourceLibrary from './pages/ResourceLibrary';
import PillarsHub from './pages/PillarsHub';
import About from './pages/About';
import ToolsHub from './pages/ToolsHub';
import Contact from './pages/Contact';
import Portal from './pages/Portal';
import Community from './pages/Community';
import Donate from './pages/Donate';
import Stories from './pages/Stories';
import ProductDetails from './pages/ProductDetails';

// Mock/Placeholder pages for routing
const Placeholder = ({ title }: { title: string }) => (
  <div className="min-h-[60vh] flex items-center justify-center pt-20">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-gray-500">This section is currently under construction for Builders Connect.</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/strategy" element={<PillarsHub />} />
        <Route path="/resources" element={<ResourceLibrary />} />
        <Route path="/community" element={<Community />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/tools" element={<ToolsHub />} />
        <Route path="/tools/quiz" element={<Quiz />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shop/:id" element={<ProductDetails />} />
        <Route path="/portal" element={<Portal />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="*" element={<Placeholder title="404 Not Found" />} />
      </Routes>
    </Layout>
  );
};

export default App;