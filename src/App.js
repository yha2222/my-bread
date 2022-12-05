import React from "react";

import logo from "./logo.svg";
import "./App.css";

import Login from "./pages/Login";
import Join from "./pages/Join";
import Main from "./pages/Main";
import Write from "./pages/Write";
import Article from "./pages/Article";
import MyPage from "./pages/MyPage";

import { Routes, Route } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;

export const StoreContext = React.createContext({});

function App() {
  const [loginUser, setLoginUser] = React.useState({});

  const 자동로그인 = async () => {
    await axios({
      url: "http://localhost:4000/autoLogin",
      method: "POST",
    }).then((response) => {
      setLoginUser(response.data);
    });
  };

  React.useEffect(() => {
    자동로그인();
  }, []);

  return (
    <StoreContext.Provider
      value={{
        loginUser: loginUser,
      }}
    >
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route exact path="/join" element={<Join />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/write" element={<Write />} />
        <Route exact path="/article" element={<Article />} />
        <Route exact path="/myPage" element={<MyPage />} />
      </Routes>
    </StoreContext.Provider>
  );
}

export default App;
