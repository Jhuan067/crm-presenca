import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Funcionarios from "./pages/Funcionarios";
import Presencas from "./pages/Presencas";
import Alertas from "./pages/Alertas";
import AppPage from "./pages/App";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/funcionarios" element={<Funcionarios />} />
        <Route path="/presenca" element={<Presencas />} />
        <Route path="/alertas" element={<Alertas />} />
        <Route path="/app" element={<AppPage />} />
      </Routes>
    </BrowserRouter>
  );
}
