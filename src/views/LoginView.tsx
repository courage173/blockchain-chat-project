import { ReactElement, useState } from "react";
import "@rainbow-me/rainbowkit/styles.css";

import LogInIcon from "../icons/login-svg-icon";
import { Input } from "../components/Input";
import Button from "../components/Button";
import { isValidEmail } from "../util/util";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { useAPI } from "../hooks/useApi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingSVG from "../icons/Loading-svg-icon";

export default function LoginView(): ReactElement {
  const { setNewUser } = useAuth();

  const [email, setEmail] = useState("courageosemwengie@gmail.com");
  const [password, setPassword] = useState("12345678");

  const navigate = useNavigate();

  const callAPI = useAPI();
  const { mutate, isLoading } = useMutation({
    mutationFn: () =>
      callAPI(`/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      setNewUser(data);
      navigate("/dashboard");
    },
    onError: (error: { message: string }) => {
      toast.error(`Error when signing in: ${error?.message}`);
    },
  });

  const shouldSubmit = isValidEmail(email) && password.trim().length >= 6;

  return (
    // <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12">
    <div className="p-8 gap-5 lg:w-[95%] w-100 mx-auto flex items-center space-x-4 content-center h-screen justify-center">
      <div className=" sm:rounded-lg m-auto lg:max-h-1000 shadow md:shadow-blue-500 md:p-6 md:p-0 w-full md:w-[unset]">
        <div className="px-2 py-5 sm:p-6 text-center">
          <h1 className="font-semibold mb-5 text-4xl md:text-7xl text-blue-500 flex justify-center gap-3">
            <span className="text-5xl md:text-7xl">
              <LogInIcon />
            </span>
            <span>Login</span>
          </h1>
          <div className="text-left">
            <label className="text-sm text-[#fff]">Email</label>
            <Input
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-[350px]  "
              error={email && !isValidEmail(email) ? "Invalid email" : ""}
            />
          </div>
          <div className="text-left mt-[20px]">
            <label className="text-sm text-[#fff]">Password</label>
            <Input
              className="w-[300px]"
              type="password"
              name="password"
              value={password}
              error={
                password && password.trim().length < 6
                  ? "Password must be at least 6 characters!"
                  : ""
              }
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            disabled={!shouldSubmit}
            type="button"
            className="mt-[20px] w-full text-center flex items-center justify-center h-[50px] md:h-[40px]"
            onClick={() => mutate()}
          >
            {isLoading ? <LoadingSVG /> : <span>Login</span>}
          </Button>

          <div className="mt-2 max-w-xl text-sm">
            <p className="text-center text-base md:text-xs">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-500">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
