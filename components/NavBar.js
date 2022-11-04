import Link from "next/link";

import styles from "../styles/NavBar.module.css";

const NavMenu = ({username}) => {
  return (
    <header>
      <nav>
        <div className={styles.navDiv}>
          <div class='btn-group'>
            <button class="btn btn-outline-secondary" disabled>Current user: {username}</button>
            <Link href='/' class="btn btn-danger">Log out</Link>
          </div>
          <div class='btn-group ms-3'>
            <Link href='/appointments' class="btn btn-outline-primary">Appointments</Link>
            <Link href='/customers' class="btn btn-outline-primary">Customers</Link>
            <Link href='/employees' class="btn btn-outline-primary">Employees</Link>
            <Link href='/departments' class="btn btn-outline-primary">Departments</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default NavMenu;
