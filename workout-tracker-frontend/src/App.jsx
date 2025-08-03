import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

import {AuthenticatedRoute} from "./routes/AuthenticatedRoute";

import MainLayout from "./layouts/MainLayout";
import WorkoutsPage from "./pages/WorkoutsPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

function App() {

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<AuthenticatedRoute><MainLayout/></AuthenticatedRoute>}>
                <Route path="/" element={<HomePage />}/>
                <Route path="/workouts" element={<WorkoutsPage />}/>
            </Route>
            <Route path="/login" element={<LoginPage />}/>
        </Routes>
    </BrowserRouter>
  )
}

export default App
