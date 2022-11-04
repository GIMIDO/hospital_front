import React, { useState, useEffect } from "react";

import customerService from "../services/customerService";
import authService from "../services/authService";

import { w3cwebsocket as W3CWebSocket } from "websocket";

import Layout from "../components/Layout";

// import styles from "../styles/Page.module.css";

const Customers = ({ customer, isNotLastPage_, username, role }) => {
  const [customerList, setCustomers] = useState(customer);
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [page, setPage] = useState(1);
  const [isNotLastPage, setIsNotLastPage] = useState(isNotLastPage_);

  const client = new W3CWebSocket("ws://localhost:3001/ws");
  const [wsUpdate, setWsUpdate] = useState(0);

  useEffect(() => {
    async function getCustomers() {
      await getListOfCustomers();
    }
    getCustomers();

    setClient();
  }, []);

  useEffect(() => {
    async function getCustomers() {
      await getListOfCustomers();
    }
    getCustomers();
  }, [page, wsUpdate]);

  const setClient = () => {
    client.onopen = () => {
      console.log("Open");
    };

    client.onmessage = (message) => {
      if (message.data.toString() == "UpdateCustomer") {
        setPage(1);
        setWsUpdate(Date.now());
      }
    };
  };

  async function getListOfCustomers() {
    let data = await customerService.get(page);
    setCustomers(data.customers);
    setIsNotLastPage(data.isNotLastPage);
  }

  const DeleteCustomer = async (id) => {
    let isConfirm = confirm("Сonfirm deletion (" + id + ")");
    if (isConfirm) {
      let result = await customerService.delete(id);
      if (result.success != undefined) {
        client.send(JSON.stringify({ message: "UpdateCustomer" }));
      }
    }
  };

  const SaveData = async (e) => {
    e.preventDefault();

    if (id == 0) {
      let isConfirm = confirm("Сonfirm creation");
      if (isConfirm) {
        let customer = {
          name: name,
          email: email,
          phone: phone,
          address: address,
        };
        let data = { customer: customer };
        await customerService.post(data);
      }
    } else {
      let isConfirm = confirm("Сonfirm the change (" + id + ")");
      if (isConfirm) {
        let customer = {
          id: id,
          name: name,
          email: email,
          phone: phone,
          address: address,
        };
        let data = { customer: customer };

        await customerService.put(id, data);
      }
    }

    client.send(
      JSON.stringify({
        message: "UpdateCustomer",
      })
    );
  };

  const ChangeCustomer = (customer) => {
    setId(customer.id);
    setName(customer.name);
    setEmail(customer.email);
    setPhone(customer.phone);
    setAddress(customer.address);
  };

  const reset = () => {
    setId(0);
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
  };

  return (
    <Layout username={username}>
      <div>
        <div class="w-50">
          <form
            onSubmit={SaveData}
            style={{ display: role === "Doctor" ? "none" : "initial" }}
          >
            <p>Create/Change form:</p>
            <div class="input-group input-group-sm mb-1">
              <label htmlFor="name" class="input-group-text">
                Name:
              </label>
              <input minLength={1} maxLength={50}
                class="form-control"
                type={"text"}
                name="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div class="input-group input-group-sm mb-1">
              <label htmlFor="email" class="input-group-text">
                Email:
              </label>
              <input
                class="form-control"
                type={"email"}
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div class="input-group input-group-sm mb-1">
              <label htmlFor="phone" class="input-group-text">
                Phone:
              </label>
              <input minLength={1} maxLength={15}
                class="form-control"
                type={"text"}
                name="phone"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
              />
            </div>
            <div class="input-group input-group-sm mb-3">
              <label htmlFor="address" class="input-group-text">
                Address:
              </label>
              <input minLength={1} maxLength={200}
                class="form-control"
                type={"text"}
                name="address"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
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
        <p class="mt-3 fw-bold fs-3">Customers:</p>
        <table class="table table-bordered table-striped text-center">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {customerList.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.address}</td>
                <td>
                  <button
                    onClick={(_) => {
                      ChangeCustomer(user);
                    }}
                    style={{ display: role === "Doctor" ? "none" : "initial" }}
                    class="btn btn-warning btn-sm"
                  >
                    Change
                  </button>

                  <button
                    onClick={(_) => {
                      DeleteCustomer(user.id);
                    }}
                    style={{ display: role === "Doctor" ? "none" : "initial" }}
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

      <div>
        <button
          onClick={(_) => {
            setPage(page - 1);
          }}
          style={{ display: page > 1 ? "initial" : "none" }}
          class="btn btn-primary btn-sm"
        >
          Previous
        </button>
        <button
          onClick={(_) => {
            setPage(page + 1);
          }}
          style={{ display: isNotLastPage ? "initial" : "none" }}
          class="btn btn-primary btn-sm"
        >
          Next
        </button>
      </div>
    </Layout>
  );
};

export default Customers;

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

  let customer = await customerService.get(1, req, res);

  return {
    props: {
      username: role.name,
      role: role.role,

      customer: customer.customers,

      isNotLastPage_: customer.isNotLastPage,
    },
  };
}
