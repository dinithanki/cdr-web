import { Routes,Route } from "react-router-dom"

const App = () => {
  return (
  
  <div>
    <Routes>

        <Route path="/" element={authUser ? <HomePage /> :<Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />

      </Routes>
  </div>  )
}

export default App