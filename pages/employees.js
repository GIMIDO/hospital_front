import employeeService from "../services/employeeService";
import React, { useState, useEffect } from "react";
import authService from "../services/authService";


const Employees = ({employee}) => {

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


  async function getListOfEmployees() {
    let data = await employeeService.get();
    console.log(data)
    setEmployees(data.employees);
    setIds(data.ids);
    setDepartment(data.ids[0]);
  }


  const DeleteEmployee = async (id) => {
    await employeeService.delete(id);
    if (result.success != undefined) {
      getListOfEmployees();
    }
  };


  const SaveData = async (e) => {
    e.preventDefault();

    if (id == 0) {

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
      getListOfEmployees();

    } else {

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
      getListOfEmployees()
    }
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
    <div>
      <form id="employeeForm" onSubmit={SaveData}>
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
          <label htmlFor="email">Email:</label>
          <input
            type={"email"}
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="phone">Phone:</label>
          <input
            type={"text"}
            name="phone"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
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
          <label htmlFor="password">Password:</label>
          <input
            type={"password"}
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="roleSet">Role:</label>
          <select
            name="roleSet"
            onChange={(e) => {
              setEmployeeRole(e.target.value);
            }}
            value={employeeRole}
          >
            <option>Admin</option>
            <option>Doctor</option>
            <option>Reception</option>
          </select>
        </div>
        <div>
          <label htmlFor="departmentSet">Department Id:</label>
          <select
            name="departmentSet"
            onChange={(e) => {
              setDepartment(e.target.value);
            }}
            value={department}
          >
            {ids.map((element) => (
              <option key={element} value={element}>
                {element}
              </option>
            ))}
          </select>
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

      <h2>Employees:</h2>
      <p>
        {employeeList.map((employee) => (
          <li key={employee.id}>
            <p>{employee.id}</p>
            <p>{employee.name}</p>
            <p>{employee.email}</p>
            <p>{employee.phone}</p>
            <p>{employee.address}</p>
            <p>{employee.role}</p>
            <p>{employee.password}</p>
            <p>{employee.department}</p>

            <button
              onClick={(_) => {
                ChangeEmployee(employee);
              }}
            >
              Change customer
            </button>

            <button
              onClick={(_) => {
                DeleteEmployee(employee.id);
              }}
            >
              Delete customer
            </button>
          </li>
        ))}
      </p>
    </div>
  );
};

export default Employees;


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

  let employee = await employeeService.get(req, res);
  if (employee.isRedirect) {
    return {
       redirect: {
          permanent: true,
          destination: '/'
       }
    }
  }
  else {
    return {
      props: {employee:employee.employees}, 
    }
  }
}