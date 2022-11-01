import Link from "next/link";

const NavMenu = () => {
  return (
    <header>
      <nav>
        <div>
          <Link href='/appointments'>Appointments</Link>
          <Link href='/customers'>Customers</Link>
          <Link href='/employees'>Employees</Link>
          <Link href='/departments'>Departments</Link>
        </div>
      </nav>
    </header>
  );
}

export default NavMenu;
