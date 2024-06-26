import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import HomePage from "./pages/homePage/homePage";
import DetailPage from "./pages/detailPage/detailPage";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
            <Route path="/detail" element={<DetailPage />} />
        </Routes>
      </Router>
  );
}

export default App;
