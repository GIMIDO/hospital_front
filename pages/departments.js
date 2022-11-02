import React, { useState, useEffect } from "react";
import departmentService from "../services/departmentService";


const Departments = () => {

  const [departmentList, setDepartments] = useState([]);
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");


  async function getListOfDepartments() {
    let data = await departmentService.get();
    setDepartments(data.departments);
  };


  const DeleteDepartment = async (id) => {
    let result = await departmentService.delete(id);
    if (result.success != undefined) {
      getListOfDepartments()
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
      getListOfDepartments();

    } else {

      let department = {
        id: id,
        name: name,
        address: address,
      };

      let data = { department: department };

      await departmentService.put(id, data);
      getListOfDepartments();
    }
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
