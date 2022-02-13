import {BrowserRouter, Routes, Route} from 'react-router-dom'
import LoginForm from './components/LoginRoute'

import AdminHome from './components/AdminHome'

import NotFound from './components/NotFound'

import './App.css'

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route exact path="/login" element={<LoginForm />} />
      <Route exact path="/" element={<AdminHome />} />
      <Route path="/not-found" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
)

export default App
