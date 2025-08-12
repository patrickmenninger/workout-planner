import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider.jsx';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import { WorkoutProvider } from './context/WorkoutContext.jsx';
import { PlanProvider } from './context/PlanContext.jsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
//   <StrictMode>
    <AuthProvider>
        <QueryClientProvider client={queryClient}>
            <PlanProvider>
                <WorkoutProvider>
                    <App />
                </WorkoutProvider>
            </PlanProvider>
        </QueryClientProvider>
    </AuthProvider>
//   </StrictMode>,
)
