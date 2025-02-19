// TODO: posthog analytics for tracking hits, views, etc.

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Projects from "./pages/Projects";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="min-h-screen px-8 py-8 max-w-2xl mx-auto flex flex-col justify-between">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
