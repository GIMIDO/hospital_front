import React, { useState, useEffect } from "react";

import employeeService from "../services/employeeService";
import authService from "../services/authService";

import { w3cwebsocket as W3CWebSocket } from "websocket";

import Layout from "../components/Layout";

const Employees = ({ employee, username, role }) => {
  const [employeeList, setEmployees] = useState(employee);
  const [ids, setIds] = useState([]);
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [employeeRole, setEmployeeRole] = useState("Doctor");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState(0);

  const client = new W3CWebSocket("ws://localhost:3001/ws");
  const [wsUpdate, setWsUpdate] = useState(0);

  useEffect(() => {
    async function getEmployees() {
      await getListOfEmployees();
    }
    getEmployees();

    setClient();
  }, []);

  useEffect(() => {
    async function getEmployees() {
      await getListOfEmployees();
    }
    getEmployees();
  }, [wsUpdate]);

  const setClient = () => {
    client.onopen = () => {
      console.log("Open");
    };

    client.onmessage = (message) => {
      if (message.data.toString() == "UpdateEmployee") {
        setWsUpdate(Date.now());
      }
    };
  };

  async function getListOfEmployees() {
    let data = await employeeService.get();
    console.log(data);
    setEmployees(data.employees);
    setIds(data.ids);
    setDepartment(data.ids[0]);
  }

  const DeleteEmployee = async (id) => {
    let isConfirm = confirm("Сonfirm deletion (" + id + ")");
    if (isConfirm) {
      let result = await employeeService.delete(id);
      if (result.success != undefined) {
        client.send(JSON.stringify({ message: "UpdateEmployee" }));
      }
    }
  };

  const SaveData = async (e) => {
    e.preventDefault();

    if (id == 0) {
      let isConfirm = confirm("Сonfirm creation");
      if (isConfirm) {
        let employee = {
          name: name,
          email: email,
          phone: phone,
          address: address,
          role: employeeRole,
          password: password,
          department: department,
        };

        let data = { employee: employee };

        await employeeService.post(data);
      }
    } else {
      let isConfirm = confirm("Сonfirm the change (" + id + ")");
      if (isConfirm) {
        let employee = {
          id: id,
          name: name,
          email: email,
          phone: phone,
          address: address,
          role: employeeRole,
          password: password,
          department: department,
        };

        let data = { employee: employee };

        await employeeService.put(id, data);
      }
    }

    client.send(JSON.stringify({ message: "UpdateEmployee" }));
  };

  const ChangeEmployee = (employee) => {
    setId(employee.id);
    setName(employee.name);
    setAddress(employee.address);
    setEmail(employee.email);
    setPhone(employee.phone);
    setEmployeeRole(employee.role);
    setPassword(employee.password);
    setDepartment(employee.department);
  };

  const reset = () => {
    setId(0);
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setEmployeeRole("Doctor");
    setPassword("");
    setDepartment(ids[0]);
  };

  return (
    <Layout username={username}>
      <div>
        <div class="w-50">
          <form
            id="employeeForm"
            onSubmit={SaveData}
            style={{ display: role !== "Admin" ? "none" : "initial" }}
          >
            <p>Create/Change form:</p>
            <div class="input-group input-group-sm mb-1">
              <label htmlFor="name" class="input-group-text">
                Name:
              </label>
              <input minLength={1} maxLength={50}
                type={"text"}
                name="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                class="form-control"
              />
            </div>
            <div class="input-group input-group-sm mb-1">
              <label htmlFor="email" class="input-group-text">
                Email:
              </label>
              <input
                type={"email"}
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                class="form-control"
              />
            </div>
            <div class="input-group input-group-sm mb-1">
              <label htmlFor="phone" class="input-group-text">
                Phone:
              </label>
              <input minLength={1} maxLength={15}
                type={"text"}
                name="phone"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
                class="form-control"
              />
            </div>
            <div class="input-group input-group-sm mb-1">
              <label htmlFor="address" class="input-group-text">
                Address:
              </label>
              <input
                type={"text"}
                name="address"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
                class="form-control"
              />
            </div>
            <div class="input-group input-group-sm mb-1">
              <label htmlFor="password" class="input-group-text">
                Password:
              </label>{" "}
              <input minLength={4}
                type={"password"}
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                class="form-control"
              />
            </div>
            <div class="input-group input-group-sm mb-1">
              <label htmlFor="roleSet" class="input-group-text">
                Role:
              </label>
              <select
                name="roleSet"
                onChange={(e) => {
                  setEmployeeRole(e.target.value);
                }}
                value={employeeRole}
                class="form-select"
              >
                <option>Admin</option>
                <option>Doctor</option>
                <option>Reception</option>
              </select>
            </div>
            <div class="input-group input-group-sm mb-1">
              <label htmlFor="departmentSet" class=" input-group-text">
                Department Id:
              </label>
              <select
                name="departmentSet"
                onChange={(e) => {
                  setDepartment(e.target.value);
                }}
                value={department}
                class="form-select"
              >
                {ids.map((element) => (
                  <option key={element} value={element}>
                    {element}
                  </option>
                ))}
              </select>
            </div>

            <div class="btn-group">
              <button
                id="submit"
                type={"submit"}
                class="btn btn-success btn-sm"
              >
                Save
              </button>
              <button id="reset" onClick={reset} class="btn btn-warning btn-sm">
                Reset
              </button>
            </div>
          </form>
        </div>
        <p class="mt-3 fw-bold  fs-3">Employees:</p>
        <table class="table table-bordered table-striped text-center">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Role</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {employeeList.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>
                  {employee.name}
                  <p style={{ display: role !== "Admin" ? "none" : "initial" }}>
                    ({employee.password})
                  </p>
                </td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                <td>{employee.address}</td>
                <td>{employee.role}</td>
                <td>{employee.department}</td>
                <td>
                  <button
                    onClick={(_) => {
                      ChangeEmployee(employee);
                    }}
                    style={{ display: role !== "Admin" ? "none" : "initial" }}
                    class="btn btn-warning btn-sm"
                  >
                    Change
                  </button>

                  <button
                    onClick={(_) => {
                      DeleteEmployee(employee.id);
                    }}
                    style={{ display: role !== "Admin" ? "none" : "initial" }}
                    class="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Employees;

export async function getServerSideProps({ req, res }) {
  let role = await authService.getRole(req, res);

  if (role === undefined) {
    return {
      redirect: {
        permanent: true,
        destination: "/",
      },
    };
  }

  let employee = await employeeService.get(req, res);
  return {
    props: {
      username: role.name,
      role: role.role,

      employee: employee.employees,
    },
  };
}
