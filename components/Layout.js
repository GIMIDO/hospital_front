import Header from "./Header";
import Footer from "./Footer";
import NavBar from "./NavBar";

const Layout = ({children, username}) => {
    return (
    <>
        <Header />
        <NavBar username={username} />
            {children}
        <Footer />
    </>
    )
}

export default Layout