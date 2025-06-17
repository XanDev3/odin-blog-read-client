import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider.jsx'
import { CommentsProvider } from './context/CommentsProvider.jsx'
import App from './App.jsx'
import './index.css'
import './prism.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
        <CommentsProvider>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </CommentsProvider>
        </AuthProvider>
      </BrowserRouter>
  </React.StrictMode>
)