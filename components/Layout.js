import Header from "./Header";
import Footer from "./Footer";
import NavBar from "./NavBar";

import styles from "../styles/Layout.module.css";

const Layout = ({children, username}) => {
    return (
    <div className={styles.mainDiv}>
        <div className={styles.headerBlock}>
            <Header />
            <NavBar username={username} />
        </div>
        <hr />
            {children}
        <hr />
        <Footer />
    </div>
    )
}

export default Layout