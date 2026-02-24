import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import '@fortawesome/fontawesome-free/css/all.min.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
const CLIENT_ID ="65908178579-4tog5vpgsloddhr1t1f4a3gshtocclva.apps.googleusercontent.com";
createRoot(document.getElementById('root')).render(
  <StrictMode>
            <GoogleOAuthProvider clientId={CLIENT_ID}> 
                <App />
          </GoogleOAuthProvider>
  </StrictMode>,
)
