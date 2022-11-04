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
      <div class="container">
        <h1 class="mt-5 mb-3">Login</h1>
        <div id="username" class="input-group input-group mb-1">
          <label class="input-group-text">User`s name: </label>
          <input
            id="userName"
            name="userName"
            value={username}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            class="form-control"
          />
        </div>
        <div id="password" class="input-group input-group mb-1">
          <label class="input-group-text">Password: </label>
          <input
          type='password'
            id="passWord"
            name="passWord"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            class="form-control"
          />
        </div>
        <hr />
        <div>
          <input type={"submit"} value="Log in" id="acceptData" class="btn btn-primary"/>
        </div>
      </div>
    </form>
  );
};

export default Login;
