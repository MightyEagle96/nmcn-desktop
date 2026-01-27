import { ServerProvider } from "./context/ServerContext";
import CandidateLoginPage from "./pages/CandidateLoginPage";
import ExamConcluded from "./pages/ExamConcluded";
import ExamPage from "./pages/ExamPage";
import InstructionsPage from "./pages/InstructionsPage";
import ServerConnectPage from "./pages/ServerConnectPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";

function App() {
  const routes = [
    {
      path: "/",
      element: <ServerConnectPage />,
    },
    { path: "/login", element: <CandidateLoginPage /> },
    { path: "/instructions", element: <InstructionsPage /> },
    { path: "/exam", element: <ExamPage /> },
    { path: "/concluded", element: <ExamConcluded /> },
  ];
  return (
    <ServerProvider>
      <Router>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Router>
      <ToastContainer />
    </ServerProvider>
  );
}

export default App;
