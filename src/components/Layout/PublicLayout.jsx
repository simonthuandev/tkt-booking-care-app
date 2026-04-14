import { Outlet } from "react-router";
import NavBar from "../NavBar";
import Footer from "../Footer";

const PublicLayout = () => {
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;