import React, { useState, useEffect } from "react";

import authService from "../services/authService";
import departmentService from "../services/departmentService";

import { w3cwebsocket as W3CWebSocket } from "websocket";


const Departments = ({department}) => {
  
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
  };


  const DeleteDepartment = async (id) => {
    let result = await departmentService.delete(id);
    if (result.success != undefined) {
      client.send(
        JSON.stringify({
          message: "UpdateDepartment",
        })
      );
    }
  };


  const SaveData = async (e) => {
    e.preventDefault();

    if (id == 0) {

      let department = {
        name: name,
        address: address,
      };
      let data = { department: department, };

      await departmentService.post(data);

    } else {

      let department = {
        id: id,
        name: name,
        address: address,
      };

      let data = { department: department };

      await departmentService.put(id, data);
    }

    client.send(
      JSON.stringify({ message: "UpdateDepartment" })
    );
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
    <div>
      <form id="departmentForm" onSubmit={SaveData}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type={"text"}
            name="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <input
            type={"text"}
            name="address"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
          />
        </div>
        <div>
          <button id="submit" type={"submit"}>
            Save
          </button>
          <button id="reset" onClick={reset}>
            Reset
          </button>
        </div>
      </form>

      <h2>Departments:</h2>
      <p>
        {departmentList.map((department) => (
          <li key={department.id}>
            <p>{department.id}</p>
            <p>{department.name}</p>
            <p>{department.address}</p>

            <button
              onClick={(_) => {
                ChangeDepartment(department);
              }}
            >
              Change department
            </button>

            <button
              onClick={(_) => {
                DeleteDepartment(department.id);
              }}
            >
              Delete department
            </button>
          </li>
        ))}
      </p>
    </div>
  );
};

export default Departments;


export async function getServerSideProps({req, res}) {
  let role = await authService.getRole(req, res)

  if (role === undefined) {
    return {
      redirect: {
         permanent: true,
         destination: '/'
      }
   }
  }

  let department = await departmentService.get(req, res);
  if (department.isRedirect) {
    return {
       redirect: {
          permanent: true,
          destination: '/'
       }
    }
  }
  else {
    return {
      props: {department:department.departments}, 
    }
  }
}
