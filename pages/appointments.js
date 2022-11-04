import React, { useState, useEffect } from "react";

import appointmentService from "../services/appointmentService";
import authService from "../services/authService";

import { w3cwebsocket as W3CWebSocket } from "websocket";

import Layout from "../components/Layout";

const Appointments = ({
  appointment,
  isNotLastPage_,
  customerIds_,
  employeeIds_,
  username,
  role,
}) => {
  const [appointmentList, setAppointments] = useState(appointment);
  const [employeeIds, setEmployeeIds] = useState(employeeIds_);
  const [customerIds, setCustomerIds] = useState(customerIds_);
  const [id, setId] = useState(0);
  const [date, setDate] = useState(new Date());
  const [start, setstart] = useState(new Date().toLocaleTimeString());
  const [end, setend] = useState(new Date().toLocaleTimeString());
  const [employee, setEmployee] = useState(0);
  const [customer, setCustomer] = useState(0);

  const [page, setPage] = useState(1);
  const [isNotLastPage, setIsNotLastPage] = useState(isNotLastPage_);

  const client = new W3CWebSocket("ws://localhost:3001/ws");
  const [wsUpdate, setWsUpdate] = useState(0);

  useEffect(() => {
    async function getAppointments() {
      await getListOfAppointments();
    }
    getAppointments();

    setClient();
  }, []);

  useEffect(() => {
    async function getAppointments() {
      await getListOfAppointments();
    }
    getAppointments();
  }, [page, wsUpdate]);

  const setClient = () => {
    client.onopen = () => {
      console.log("Open");
    };

    client.onmessage = (message) => {
      if (message.data.toString() == "UpdateAppointment") {
        setPage(1);
        setWsUpdate(Date.now());
      }
    };
  };

  async function getListOfAppointments() {
    let data = await appointmentService.get(page);

    setAppointments(data.appointments);
    setEmployeeIds(data.employeeIds);
    setCustomerIds(data.customerIds);
    setEmployee(data.employeeIds[0]);
    setCustomer(data.customerIds[0]);
  }

  const DeleteAppointment = async (id) => {
    let isConfirm = confirm("Сonfirm deletion (" + id + ")");
    if (isConfirm) {
      let result = await appointmentService.delete(id);
      if (result.success != undefined) {
        client.send(JSON.stringify({ message: "UpdateAppointment" }));
      }
    }
  };

  const SaveData = async (e) => {
    e.preventDefault();

    if (id == 0) {
      let isConfirm = confirm("Сonfirm creation");
      if (isConfirm) {
        let appointment = {
          date: date,
          start: start,
          end: end,
          employee: employee,
          customer: customer,
        };

        let data = { appointment: appointment };

        await appointmentService.post(data);
      }

    } else {
      let isConfirm = confirm("Сonfirm the change (" + id + ")");
      if (isConfirm) {
        let appointment = {
          id: id,
          date: date,
          start: start,
          end: end,
          employee: employee,
          customer: customer,
        };

        let data = { appointment: appointment };

        await appointmentService.put(id, data);
      }
    }

    client.send(JSON.stringify({ message: "UpdateAppointment" }));
  };

  const ChangeAppointment = (appointment) => {
    setId(appointment.id);
    setDate(appointment.date);
    setstart(appointment.start);
    setend(appointment.end);
    setEmployee(appointment.employee);
    setCustomer(appointment.customer);
  };

  const reset = () => {
    setId(0);
    setDate(new Date());
    setstart(new Date().toLocaleTimeString());
    setend(new Date().toLocaleTimeString());
    setEmployee(employeeIds[0]);
    setCustomer(customerIds[0]);
  };

  return (
    <Layout username={username}>
      <div>
        <div class="w-50">
          <form
            id="appointmentForm"
            onSubmit={SaveData}
            style={{ display: role === "Doctor" ? "none" : "initial" }}
          >
            <p>Create/Change form:</p>
            <div class="input-group input-group-sm mb-1">
              <label htmlFor="date" class="input-group-text">
                Date:
              </label>
              <input
                type={"date"}
                name="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
                class="form-control"
              />
            </div>
            <div class="input-group input-group-sm mb-1">
              <label htmlFor="start" class="input-group-text">
                Start of appointment:
              </label>
              <input
                type={"time"}
                name="start"
                value={start}
                onChange={(e) => {
                  setstart(e.target.value);
                }}
                class="form-control"
              />
            </div>
            <div class="input-group input-group-sm mb-1">
              <label htmlFor="end" class="input-group-text">
                End of appointment:
              </label>
              <input
                type={"time"}
                name="end"
                value={end}
                onChange={(e) => {
                  setend(e.target.value);
                }}
                class="form-control"
              />
            </div>
            <div class="input-group input-group-sm mb-1">
              <label htmlFor="customer" class="input-group-text">
                Customer id:
              </label>
              <select
                name="customer"
                onChange={(e) => {
                  setCustomer(e.target.value);
                }}
                value={customer}
                class="form-select"
              >
                {customerIds.map((element) => (
                  <option key={element} value={element}>
                    {element}
                  </option>
                ))}
              </select>
            </div>
            <div class="input-group input-group-sm mb-1">
              <label htmlFor="employeeSet" class="input-group-text">
                Employee Id:
              </label>
              <select
                name="employeeSet"
                onChange={(e) => {
                  setEmployee(e.target.value);
                }}
                value={employee}
                class="form-select"
              >
                {employeeIds.map((element) => (
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

        <p class="mt-3 fw-bold fs-3">Appointments:</p>
        <table class="table table-bordered table-striped text-center">
          <thead>
            <tr>
              <th>Id</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Employee</th>
              <th>Customer</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {appointmentList.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.id}</td>
                <td>{appointment.date}</td>
                <td>{appointment.start}</td>
                <td>{appointment.end}</td>
                <td>{appointment.employee}</td>
                <td>{appointment.customer}</td>
                <td>
                <button
                  onClick={(_) => {
                    ChangeAppointment(appointment);
                  }}
                  style={{ display: role === "Doctor" ? "none" : "initial" }}
                  class="btn btn-warning btn-sm"
                >
                  Change
                </button>

                <button
                  onClick={(_) => {
                    DeleteAppointment(appointment.id);
                  }}
                  style={{ display: role === "Doctor" ? "none" : "initial" }}
                  class="btn btn-danger btn-sm"
                >
                  Delete
                </button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <button
            onClick={(_) => {
              setPage(page + 1);
            }}
            style={{ display: isNotLastPage ? "initial" : "none" }}
            class="btn btn-primary btn-sm"
          >
            Next
          </button>
          <button
            onClick={(_) => {
              setPage(page - 1);
            }}
            style={{ display: page > 1 ? "initial" : "none" }}
            class="btn btn-primary btn-sm"
          >
            Previous
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Appointments;

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

  let appointment = await appointmentService.get(1, req, res);

  return {
    props: {
      username: role.name,
      role: role.role,

      appointment: appointment.appointments,
      customerIds_: appointment.customerIds,
      employeeIds_: appointment.employeeIds,

      isNotLastPage_: appointment.isNotLastPage,
    },
  };
}
