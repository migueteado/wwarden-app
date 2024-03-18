import FrontMessage from "@/components/FrontMessage";
import { SigninForm } from "@/components/SigninForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - ToDoApp",
  description: "Free your memory and get things done.",
};

export default function Signin() {
  return (
    <>
      <main className="main-container">
        <div className="grid min-h-screen lg:grid-cols-2">
          <FrontMessage />
          <div className="flex items-center justify-center h-full">
            <div className="w-full max-w-sm px-4 py-2">
              <h1 className="form-title">Sign in to your account</h1>
              <SigninForm />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
