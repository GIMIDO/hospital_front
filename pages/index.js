import Link from "next/link";

const Index = ({appointments}) => {
  const appointmentList = appointments.appointments
  return (
    <div>
      <div>
        <Link href="/">Home</Link>
        <Link href="/customers">Customers</Link>
        <Link href="/departments">Departments</Link>
        <Link href="/employees">Employees</Link>
      </div>
      <h1>Appointments (Home)</h1>
      <p>
                {appointmentList.map(user =>
                    <li key={user.id}>
                        <p>{user.date}</p>
                        <p>{user.start}</p>
                        <p>{user.end}</p>
                        <p>{user.employee}</p>
                        <p>{user.customer}</p>
                        <p>{user.role}</p>
                    </li>)}
            </p>
    </div>
  );
};

export default Index;

export async function getStaticProps(context) {
  const response = await fetch(`http://127.0.0.1:8000/api/v1/appointment/`)
  const appointments = await response.json()
  console.log(appointments)
  return {
    props: {appointments}, // will be passed to the page component as props
  }
}