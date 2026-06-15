import { Outlet } from "react-router";
import NavBar from "../NavBar";
import Footer from "../Footer";
import Chatbot from "../Common/Chatbot";
import ScrollToTopButton from "../Common/ScrollToTopButton";

const PublicLayout = () => {
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
      <Footer />

      <ScrollToTopButton />
      <Chatbot />
    </>
  );
};

export default PublicLayout;
