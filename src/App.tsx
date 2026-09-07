import { Route, Routes } from 'react-router-dom'
import Home from '@/pages/home/Home'
import ProjectPage from '@/pages/project/ProjectPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects/:slug" element={<ProjectPage />} />
    </Routes>
  )
}

export default App
