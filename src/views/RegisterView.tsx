import { ReactElement, useState } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { Input } from "../components/Input";
import Button from "../components/Button";
import { isValidEmail } from "../util/util";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { useAPI } from "../hooks/useApi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingSVG from "../icons/Loading-svg-icon";

export default function RegisterView(): ReactElement {
  const { setNewUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const navigate = useNavigate();

  const callAPI = useAPI();
  const { mutate, isLoading } = useMutation({
    mutationFn: () =>
      callAPI(`/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, firstName, lastName, password }),
      }),
    onSuccess: (data) => {
      toast.success(`Successfully registered! sign in to continue`);
      localStorage.setItem("token", data.token);
      setNewUser(data);
      navigate("/dashboard");
    },
    onError: (error: { message: string }) => {
      toast.error(`Error when signing in: ${error?.message}`);
    },
  });

  const shouldSubmit =
    isValidEmail(email) &&
    password.trim().length >= 8 &&
    firstName.trim().length >= 3 &&
    lastName.trim().length >= 3;

  return (
    // <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12">
    <div className="p-8 gap-5 lg:w-[95%] w-100 mx-auto flex items-center space-x-4 content-center h-screen justify-center">
      <div className="sm:rounded-lg m-auto lg:max-h-1000 shadow md:shadow-blue-500 md:p-6 md:p-0 w-full md:w-[unset]">
        <div className="px-2 py-5 sm:p-12 text-center">
          <h1 className="font-semibold mb-5 text-4xl md:text-4xl text-blue-500 flex justify-center gap-3">
            <span>Register</span>
          </h1>
          <div className="text-left mb-[20px]">
            <label className="text-sm text-[#fff]">First Name</label>
            <Input
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-[350px]"
              error={
                firstName && firstName.length < 3
                  ? "Firstname must be at least 3 characters"
                  : ""
              }
            />
          </div>
          <div className="text-left mb-[20px]">
            <label className="text-sm text-[#fff]">Last Name</label>
            <Input
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-[300px]"
              error={
                lastName && lastName.length < 3
                  ? "lastName must be at least 3 characters"
                  : ""
              }
            />
          </div>
          <div className="text-left mb-[20px]">
            <label className="text-sm text-[#fff]">Email</label>
            <Input
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-[300px]"
              error={email && !isValidEmail(email) ? "Invalid email" : ""}
            />
          </div>
          <div className="text-left mb-[20px]">
            <label className="text-sm text-[#fff]">Password</label>
            <Input
              className="w-[300px]"
              type="password"
              name="password"
              value={password}
              error={
                password && password.trim().length < 8
                  ? "Password must be at least 8 characters!"
                  : ""
              }
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            disabled={!shouldSubmit || isLoading}
            type="button"
            className="mt-[20px] w-full text-center h-[50px] md:h-[40px] flex items-center justify-center"
            onClick={() => mutate()}
          >
            {isLoading ? <LoadingSVG /> : <span>Sign up</span>}
          </Button>

          <div className="mt-2 max-w-xl text-sm ">
            <p className="text-center text-base md:text-xs">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
