import React, { useState, useEffect } from "react";

import appointmentService from "../services/appointmentService";
import authService from "../services/authService";

import { w3cwebsocket as W3CWebSocket } from "websocket";


const Appointments = ({appointment, customerIdsM, employeeIdsM}) => {

  const [appointmentList, setAppointments] = useState(appointment);
  const [employeeIds, setEmployeeIds] = useState(employeeIdsM);
  const [customerIds, setCustomerIds] = useState(customerIdsM);
  const [id, setId] = useState(0);
  const [date, setDate] = useState(new Date());
  const [start, setstart] = useState(new Date().toLocaleTimeString());
  const [end, setend] = useState(new Date().toLocaleTimeString());
  const [employee, setEmployee] = useState(0);
  const [customer, setCustomer] = useState(0);

  const [page, setPage] = useState(1);
  const [isNotLastPage, setIsNotLastPage] = useState(true);

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
  };


  const DeleteAppointment = async (id) => {
    let result = await appointmentService.delete(id);
    if (result.success != undefined) {
      client.send(
        JSON.stringify({ message: "UpdateAppointment" })
      );
    }
  };


  const SaveData = async (e) => {
    e.preventDefault();

    if (id == 0) {

      let appointment = {
        date: date,
        start: start,
        end: end,
        employee: employee,
        customer: customer,
      };

      let data = { appointment: appointment };

      await appointmentService.post(data);

    } else {
      
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

    client.send(
      JSON.stringify({ message: "UpdateAppointment" })
    );
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
    <div>
      <form
        id="appointmentForm"
        onSubmit={SaveData}
      >
                <div>
                  <label htmlFor="date">Date:</label>
                  <input
                    type={"date"}
                    name="date"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="start">Start of appointment:</label>
                  <input
                    type={"time"}
                    name="start"
                    value={start}
                    onChange={(e) => {
                      setstart(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="end">End of appointment:</label>
                  <input
                    type={"time"}
                    name="end"
                    value={end}
                    onChange={(e) => {
                      setend(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="customer">Customer id:</label>
                  <select
                    name="customer"
                    onChange={(e) => {
                      setCustomer(e.target.value);
                    }}
                    value={customer}
                  >
                    {customerIds.map((element) => (
                      <option key={element} value={element}>
                        {element}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="employeeSet">Employee Id:</label>
                  <select
                    name="employeeSet"
                    onChange={(e) => {
                      setEmployee(e.target.value);
                    }}
                    value={employee}
                  >
                    {employeeIds.map((element) => (
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


      <h2>Appointments:</h2>
      <p>
        {appointmentList.map((appointment) => (
          <li key={appointment.id}>
            <p>{appointment.date}</p>
            <p>{appointment.start}</p>
            <p>{appointment.end}</p>
            <p>{appointment.employee}</p>
            <p>{appointment.customer}</p>
          
      <button
              onClick={(_) => {
                ChangeAppointment(appointment);
              }}
            >
              Change appointment
            </button>

            <button
              onClick={(_) => {
                DeleteAppointment(appointment.id);
              }}
            >
              Delete appointment
            </button>
            </li>
        ))}
            </p>
            <div>
        <button
          onClick={(_) => {
            setPage(page + 1);
          }}
          style={{ display: isNotLastPage ? "initial" : "none" }}
        >
          Next
        </button>
        <button
          onClick={(_) => {
            setPage(page - 1);
          }}
          style={{ display: page > 1 ? "initial" : "none" }}
        >
          Previous
        </button>
      </div>
    </div>
  );
};

export default Appointments;


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

  let appointment = await appointmentService.get(1, req, res);
  if (appointment.isRedirect) {
    return {
       redirect: {
          permanent: true,
          destination: '/'
       }
    }
  }
  else {
    return {
      props: {
        appointment: appointment.appointments,
        customerIdsM: appointment.customerIds,
        employeeIdsM: appointment.employeeIds,
        isNotLastPage: appointment.isNotLastPage
      }, 
    }
  }
}