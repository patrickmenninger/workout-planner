import {BrowserRouter, Routes, Route} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import WorkoutsPage from "./pages/WorkoutsPage";
import HomePage from "./pages/HomePage";

function App() {

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<MainLayout/>}>
                <Route path="/" element={<HomePage />}/>
                <Route path="/workouts" element={<WorkoutsPage />}/>
            </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App
