import React, { useState } from "react";
import authService from "../services/authService";

const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e) => {
    e.preventDefault();
    var loginData = {
      username,
      password,
    };

    var token = await authService.login(loginData);
    if (token === null) {
      alert("No such user");
    } else {
      authService.setCookie("Token", token.response);
      window.location.assign("http://localhost:3000/customers");
    }
  };

  return (
    <form onSubmit={login}>
      <div>
        <h2>Login form</h2>
        <div id="username">
          <label>User`s name: </label>
          <br />
          <input
            id="userName"
            name="userName"
            value={username}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          />
        </div>
        <div id="password">
          <label>Password: </label>
          <br />
          <input
            id="passWord"
            name="passWord"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <hr />
        <div>
          <input type={"submit"} value="Log in" id="acceptData" />
        </div>
      </div>
    </form>
  );
};

export default Login;
