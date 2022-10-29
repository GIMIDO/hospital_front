import Link from "next/link";

const Departments = ({departments}) => {
  const departmentsList = departments.departments
  return (
    <div>
      <div>
        <Link href="/">Home</Link>
        <Link href="/customers">Customers</Link>
        <Link href="/departments">Departments</Link>
        <Link href="/employees">Employees</Link>
      </div>
      <h2>Departments</h2>
      <p>
        {departmentsList.map((user) => (
          <li key={user.id}>
            <p>{user.name}</p>
            <p>{user.address}</p>
          </li>
        ))}
      </p>
    </div>
  );
};

export default Departments;

export async function getStaticProps(context) {
  const response = await fetch(`http://127.0.0.1:8000/api/v1/department/`);
  const departments = await response.json();
  console.log(departments);
  return {
    props: { departments }, // will be passed to the page component as props
  };
}
