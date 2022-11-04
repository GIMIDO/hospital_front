import React, { useState, useEffect } from "react";

import authService from "../services/authService";
import departmentService from "../services/departmentService";

import { w3cwebsocket as W3CWebSocket } from "websocket";

import Layout from "../components/Layout";

const Departments = ({ department, username, role }) => {
  const [departmentList, setDepartments] = useState(department);
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const client = new W3CWebSocket("ws://localhost:3001/ws");
  const [wsUpdate, setWsUpdate] = useState(0);

  useEffect(() => {
    async function getDepartments() {
      await getListOfDepartments();
    }
    getDepartments();

    setClient();
  }, []);

  useEffect(() => {
    async function getDepartments() {
      await getListOfDepartments();
    }
    getDepartments();
  }, [wsUpdate]);

  const setClient = () => {
    client.onopen = () => {
      console.log("Open");
    };

    client.onmessage = (message) => {
      if (message.data.toString() == "UpdateDepartment") {
        setWsUpdate(Date.now());
      }
    };
  };

  async function getListOfDepartments() {
    let data = await departmentService.get();
    setDepartments(data.departments);
  }

  const DeleteDepartment = async (id) => {
    let isConfirm = confirm("Сonfirm deletion (" + id + ")");
    if (isConfirm) {
      let result = await departmentService.delete(id);
      if (result.success != undefined) {
        client.send(
          JSON.stringify({
            message: "UpdateDepartment",
          })
        );
      }
    }
  };

  const SaveData = async (e) => {
    e.preventDefault();

    if (id == 0) {
      let isConfirm = confirm("Сonfirm creation");

      if (isConfirm) {
        let department = {
          name: name,
          address: address,
        };
        let data = { department: department };

        await departmentService.post(data);
      }
    } else {
      let isConfirm = confirm("Сonfirm the change (" + id + ")");

      if (isConfirm) {
        let department = {
          id: id,
          name: name,
          address: address,
        };

        let data = { department: department };

        await departmentService.put(id, data);
      }
    }
    client.send(JSON.stringify({ message: "UpdateDepartment" }));
  };

  const ChangeDepartment = (department) => {
    setId(department.id);
    setName(department.name);
    setAddress(department.address);
  };

  const reset = () => {
    setId(0);
    setName("");
    setAddress("");
  };

  return (
    <Layout username={username}>
      <div>
        <div class="w-50">
          <form
            id="departmentForm"
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
              <label htmlFor="address" class="input-group-text">
                Address:
              </label>
              <input minLength={1} maxLength={200}
                type={"text"}
                name="address"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
                class="form-control"
              />
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
        <p class="mt-3 fw-bold fs-3">Departments:</p>
        <table class="table table-bordered table-striped text-center">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departmentList.map((department) => (
              <tr key={department.id}>
                <td>{department.id}</td>
                <td>{department.name}</td>
                <td>{department.address}</td>
                <td>
                  <button
                    onClick={(_) => {
                      ChangeDepartment(department);
                    }}
                    style={{ display: role !== "Admin" ? "none" : "initial" }}
                    class="btn btn-warning btn-sm"
                  >
                    Change
                  </button>

                  <button
                    onClick={(_) => {
                      DeleteDepartment(department.id);
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

export default Departments;

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

  let department = await departmentService.get(req, res);

  return {
    props: {
      username: role.name,
      role: role.role,

      department: department.departments,
    },
  };
}
