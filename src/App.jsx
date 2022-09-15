import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import { NotFound } from "./pages/404 page/NotFound";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CreateQuiz } from "./Components/CreateQuiz/CreateQuiz";
import { PlayQuiz } from "./pages/PlayQuiz/PlayQuiz";
import { EditQuiz } from "./Components/editQuiz/EditQuiz";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route exact path="login" element={<Login />} />
        <Route exact path="register" element={<SignUp />} />
        <Route exact path="edit_quiz/:id" element={<EditQuiz />} />
        <Route exact path="create" element={<CreateQuiz />} />
        <Route exact path="playquiz/:id" element={<PlayQuiz />} />
        <Route exact path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
