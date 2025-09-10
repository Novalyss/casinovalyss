import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './styles/global.css';
import Toaster from "./components/Toaster.jsx";

createRoot(document.getElementById('root')).render(
  <Toaster>
    <App />
  </Toaster>
)
  
  
