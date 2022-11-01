import appointmentsService from "../services/appointmentsService";

const Appointments = ({ appointments }) => {
  const appointmentList = appointments.appointments;
  return (
    <div>
      <h1>Appointments:</h1>
      <p>
        {appointmentList.map((user) => (
          <li key={user.id}>
            <p>{user.date}</p>
            <p>{user.start}</p>
            <p>{user.end}</p>
            <p>{user.employee}</p>
            <p>{user.customer}</p>
            <p>{user.role}</p>
          </li>
        ))}
      </p>
    </div>
  );
};

export default Appointments;

export async function getServerSideProps() {
  let appointments = await appointmentsService.get("1");

  if (!appointments) {
    return {
      
    }
  }
  return {
    props: { appointments },
  };
}
