"use client";

import { useState } from "react";
import Backdrop from "./backdrop";
import Header from "./header";
import { Sidebar } from "./sidebar";

export function DashboardLayout({
  title,
  username,
  children,
}: {
  title: string;
  username: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {children}
      <Header toggleSidebar={toggleSidebar} title={title} />
      <Backdrop toggle={toggleSidebar} isOpen={isOpen} />
      <Sidebar username={username} isOpen={isOpen} />
    </>
  );
}
