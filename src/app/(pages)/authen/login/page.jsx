"use client";

import React from "react";

import { useRouter } from "next/navigation";

import Link from "next/link";
import Input from "@/app/components/ui/Inputs/Input";
import { useForm } from "react-hook-form";
import { IoMailOutline } from "react-icons/io5";
import { TbLockPassword } from "react-icons/tb";
import Button2 from "@/app/components/ui/Buttons/Button2";
import { FcGoogle } from "react-icons/fc";
import Logo from "@/app/components/Logo";
import { signIn } from "next-auth/react";
import { Alert, Collapse } from "@mui/material";

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(""); // Clear previous errors
    try {
      const result = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      router.push("/");
    } catch (error) {
      setError("An error occurred during login");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      setError("Failed to login with Google");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      <div className="container mx-auto flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
          <Logo outsideStyle="justify-center !m-0" insideStyle="!m-0" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center">
            Welcome Back!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Login to your account and start exploring seasonal decorations.
          </p>

          <Collapse in={!!error}>
            <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2 }}>
              {error}
            </Alert>
          </Collapse>

          <form className="flex flex-col space-y-8">
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="Your email"
                errors={errors}
                register={register}
                required
                icon={<IoMailOutline />}
              />
            </div>

            <div className="relative">
              <Input
                id="password"
                type="password"
                placeholder="Password"
                errors={errors}
                register={register}
                required
                icon={<TbLockPassword />}
              />
            </div>

            <Button2
              type="submit"
              onClick={handleSubmit(onSubmit)}
              label="Continue with email"
              loading={isLoading}
              disabled={isLoading || isGoogleLoading}
              btnClass="w-full mt-3 mb-1"
              labelClass="justify-center p-3"
            />
          </form>

          <div className="relative">
            <div className="w-full h-px dark:bg-neutral-900 bg-white"></div>
            <div className="w-full h-px bg-neutral-200 dark:bg-neutral-800"></div>
            <div className="absolute inset-0 h-5 w-5 m-auto rounded-xl dark:bg-neutral-800 bg-white shadow-input dark:shadow-[0px_-1px_0px_0px_var(--neutral-700)] flex items-center justify-center">
              <span className="h-3 w-3 text-[10px] font-bold text-neutral-400 dark:text-neutral-300 !m-0 !p-0 leading-[10px] ml-[4px] inline-block">
                or
              </span>
            </div>
          </div>

          <Button2
            type="button"
            onClick={handleGoogleSignIn}
            loading={isGoogleLoading}
            disabled={isLoading || isGoogleLoading}
            label="Continue with"
            btnClass="w-full m-0"
            labelClass="justify-center p-3"
            icon={<FcGoogle size={20} />}
          />

          <p className="text-gray-600 dark:text-gray-300 text-center">
            Don't have an account ?
            <Link
              href="/authen/signup"
              className="text-red hover:underline ml-2"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
