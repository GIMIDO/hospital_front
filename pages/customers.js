import React, { useState, useEffect } from "react";

import customerService from "../services/customerService";
import authService from "../services/authService";

import { w3cwebsocket as W3CWebSocket } from "websocket";


const Customers = ({ customer }) => {

  const [customerList, setCustomers] = useState(customer);
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [page, setPage] = useState(1);
  const [isNotLastPage, setIsNotLastPage] = useState(true);

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
  }

  const DeleteCustomer = async (id) => {
    let result = await customerService.delete(id);
    if (result.success != undefined) {
      client.send(
        JSON.stringify({ message: "UpdateCustomer" })
      );
    }
  };

  const SaveData = async (e) => {
    e.preventDefault();

    if (id == 0) {

      let customer = {
        name: name,
        email: email,
        phone: phone,
        address: address,
      };
      let data = { customer: customer };

      await customerService.post(data);

    } else {
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
    <div>
      <form onSubmit={SaveData}>
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
          <button id="submit" type={"submit"}>
            Save
          </button>
          <button id="reset" onClick={reset}>
            Reset
          </button>
        </div>
      </form>

      <h2>Customers:</h2>
      <p>
        {customerList.map((user) => (
          <li key={user.id}>
            <p>{user.id}</p>
            <p>{user.name}</p>
            <p>{user.email}</p>
            <p>{user.phone}</p>
            <p>{user.address}</p>

            <button
              onClick={(_) => {
                ChangeCustomer(user);
              }}
            >
              Change customer
            </button>

            <button
              onClick={(_) => {
                DeleteCustomer(user.id);
              }}
            >
              Delete customer
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
  if (customer.isRedirect) {
    return {
      redirect: {
        permanent: true,
        destination: "/",
      },
    };
  } else {
    return {
      props: {
        customer: customer.customers,
        isNotLastPage: customer.isNotLastPage
      },
    };
  }
}
