import Link from "next/link";

const Customers = ({customers}) => {
    const customersList = customers.customers
    return (
        <div>
            <div>
                <Link href="/">Home</Link>
                <Link href="/customers">Customers</Link>
                <Link href="/departments">Departments</Link>
                <Link href="/employees">Employees</Link>
            </div>
            <h1>Customers:</h1>
            <p>
                {customersList.map(user =>
                    <li key={user.id}>
                        <p>{user.name}</p>
                        <p>{user.email}</p>
                        <p>{user.phone}</p>
                        <p>{user.address}</p>
                    </li>)}
            </p>
        </div>
    )
}

export default Customers

export async function getStaticProps(context) {
    const response = await fetch(`http://127.0.0.1:8000/api/v1/customer/`)
    const customers = await response.json()
    console.log(customers)
    return {
      props: {customers}, // will be passed to the page component as props
    }
  }