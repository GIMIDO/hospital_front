import customerService from "../services/customerService";
import React, { useState, useEffect } from "react";
import authService from "../services/authService";


const Customers = ({customer}) => {
  
  const [customerList, setCustomers] = useState(customer);
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [page, setPage] = useState(1);


  async function getListOfCustomers(page) {
    let data = await customerService.get(page);
    setCustomers(data.customers);
  };


  const DeleteCustomer = async (id) => {
    let result = await customerService.delete(id);
    if (result.success != undefined) {
      getListOfCustomers(page)
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
      getListOfCustomers(page)

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
      getListOfCustomers(page)
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
      <label htmlFor="email">set page</label>
          <input
            type={"numver"}
            name="page"
            value={page}
            onChange={(e) => {
              setPage(e.target.value);
            }}
          />
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

  let customer = await customerService.get(1, req, res);
  console.log(customer)
  if (customer.isRedirect) {
    return {
       redirect: {
          permanent: true,
          destination: '/'
       }
    }
  }
  else {
    return {
      props: {customer:customer.customers}, 
    }
  }
}