import FrontMessage from "@/components/front-message";
import { SignupForm } from "@/components/auth/signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signup - WWarden",
  description: "Watch your finances",
};

export default function Signup() {
  return (
    <>
      <main className="main-container">
        <div className="grid min-h-screen lg:grid-cols-2">
          <FrontMessage />
          <div className="flex items-center justify-center h-full">
            <div className="w-full max-w-sm px-4 py-2">
              <h1 className="form-title">Create your new account</h1>
              <SignupForm />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
