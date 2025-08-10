import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

import {AuthenticatedRoute} from "./routes/AuthenticatedRoute";

import MainLayout from "./layouts/MainLayout";
import WorkoutsPage from "./pages/WorkoutsPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PlanPage from "./pages/PlanPage";
import ExercisePage from "./pages/ExercisePage";
import ProfilePage from "./pages/ProfilePage";

import "./index.css"

function App() {

  return (
    <BrowserRouter>
        <Routes>
            <Route element={<AuthenticatedRoute><MainLayout/></AuthenticatedRoute>}>
                <Route path="/" element={<HomePage />}/>
                <Route path="/workouts" element={<WorkoutsPage />}/>
                <Route path="/plans/:id" element={<PlanPage />}/>
                <Route path="/profile" element={<ProfilePage />} />
            </Route>
            <Route path="/exercises/:id" element={<AuthenticatedRoute><ExercisePage /></AuthenticatedRoute>}/>
            <Route path="/login" element={<LoginPage />}/>
        </Routes>
    </BrowserRouter>
  )
}

export default App
