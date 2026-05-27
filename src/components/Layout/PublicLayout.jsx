import { Outlet } from "react-router";
import NavBar from "../NavBar";
import Footer from "../Footer";
import Chatbot from "../Common/Chatbot";

const PublicLayout = () => {
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
      <Footer />

      <Chatbot />
    </>
  );
};

export default PublicLayout;