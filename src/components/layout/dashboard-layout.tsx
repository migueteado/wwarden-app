"use client";

import { useState } from "react";
import Backdrop from "./backdrop";
import Header from "./header";
import { Sidebar } from "./sidebar";
import { View } from "@/lib/auth";

export function DashboardLayout({
  title,
  views,
  children,
}: {
  title: string;
  views: View[];
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="lg:ml-[300px] mt-14">
        <div className="w-full max-w-[1280px] mx-auto px-2 pt-4 lg:pt-12">
          {children}
        </div>
      </div>
      <Header toggleSidebar={toggleSidebar} title={title} />
      <Backdrop toggle={toggleSidebar} isOpen={isOpen} />
      <Sidebar views={views} isOpen={isOpen} />
    </>
  );
}
