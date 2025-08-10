"use client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectLoading,
  login,
  setUser,
  logout,
  selectUser
} from "@/store/redux/authSlice";
import { FC, useEffect } from 'react'
import type { loginData } from "../types";
import { useForm, SubmitHandler } from "react-hook-form"
import Loading from "../components/common/Loading";
import { useRouter } from 'next/navigation';
import { local_storage_web_key } from "@/utils/constants";
import { isExpired, decodeToken } from "react-jwt";
import { User } from "@/types";

const LoginPage: FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectLoading);
  const user = useAppSelector(selectUser);
  const { register, handleSubmit } = useForm<loginData>()

  const onSubmit: SubmitHandler<loginData> = (data) => {
    console.log("data ===>", data);
    dispatch(login(data, router));
  }

  useEffect(() => {
    // getting JWT token from local storage
    const token = localStorage.getItem(local_storage_web_key);

    if (token) {
      const myDecodedToken = decodeToken(token) as User;
      const isMyTokenExpired = isExpired(token);

      if (isMyTokenExpired) {
        dispatch(logout(router))
      }

      dispatch(setUser(myDecodedToken));
    }
  }, []);

  useEffect(() => {
    if (user) {
      console.log("I am running")
      router.push("/")
    }
  }, [user])

  if (loading) {
    return <Loading loading={loading} />
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-white">
                email
              </label>
              <div className="mt-2">
                <input
                  type="string"
                  {...register("email", { required: true, maxLength: 50 })}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-white">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  {...register("password", { required: true })}
                  autoComplete="current-password"
                  className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <input
                name="Sign in"
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
              </input>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default LoginPage;