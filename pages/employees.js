import Link from "next/link";

const Employees = ({employee}) => {
  const employeeList = employee.employees
  return (
    <div>
      <div>
        <Link href="/">Home</Link>
        <Link href="/customers">Customers</Link>
        <Link href="/departments">Departments</Link>
        <Link href="/employees">Employees</Link>
      </div>
      <h2>Employees</h2>
      <p>
                {employeeList.map(user =>
                    <li key={user.id}>
                        <p>{user.name}</p>
                        <p>{user.email}</p>
                        <p>{user.phone}</p>
                        <p>{user.address}</p>
                        <p>{user.department}</p>
                        <p>{user.role}</p>
                    </li>)}
            </p>
    </div>
  );
};

export default Employees;

export async function getStaticProps(context) {
  const response = await fetch(`http://127.0.0.1:8000/api/v1/employee/`)
  const employee = await response.json()
  console.log(employee)
  return {
    props: {employee}, // will be passed to the page component as props
  }
}