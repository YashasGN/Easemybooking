import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { Outlet, useLocation } from "react-router-dom";

export default function Home() {
  const location = useLocation();
  const hideHeaderRoutes = ["/login", "/register"];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname.toLowerCase());

  return (
    <>
      {!shouldHideHeader && <Header />}
      <Outlet />
      <Footer />
    </>
  );
}
