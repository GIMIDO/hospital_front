import customerService from "../services/customerService";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

const Customers = ({ customers }) => {
  // const customerList = customers.customers;

  const [customerList, setCustomers] = useState([]);
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const router = useRouter();
  const forceReload = () => {
    router.reload();
  };

  const getListOfCustomers = async (page) => {
    let data = await await customerService.get(page);

    setCustomers(data.customers);
  };

  const DeleteCustomer = async (id) => {
    let result = await customerService.delete(id);
    if (result.success != undefined) {
      forceReload();
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

      let data = {
        customer: customer,
      };

      await customerService.post(data);
    } else {
      let customer = {
        id: id,
        name: name,
        email: email,
        phone: phone,
        address: address,
      };

      let data = {
        customer: customer,
      };

      await customerService.put(id, data);
    }
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
      <button
        onClick={(_) => {
          getListOfCustomers("1");
        }}
      >
        get customers
      </button>
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
      <button onClick={forceReload}>reload</button>
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
    </div>
  );
};

export default Customers;

// export async function getServerSideProps() {
//   let customers = await customerService.get("1");
//   console.log(customers);

//   if (!customers) {
//     return {
//       // ...
//     };
//   }
//   return {
//     props: { customers },
//   };
// }
