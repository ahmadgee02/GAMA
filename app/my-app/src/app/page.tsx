'use client'
import ProtectedRouteLayout from "@/app/components/common/ProtectedRouteLayout"
import ChatUI from "@/app/components/chat/ChatUI";
import SelectPrompt from "./components/chat/SelectPrompt";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { selectLoading, getAllPrompts } from "@/app/store/redux/pageSlice"
import { FC, useEffect, useState } from "react";
import Loading from "@/app/components/common/Loading";
import { selectPrompt } from "@/app/store/redux/chatSlice";

const Dashboard: FC = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectLoading);
  const prompt = useAppSelector(selectPrompt);

  useEffect(() => {
    dispatch(getAllPrompts());
  }, [])

  return (
    <ProtectedRouteLayout>
      {loading ?
        <Loading loading={loading} />
        :
        <>
          {prompt ?
            <ChatUI />
            :
            <SelectPrompt />
          }
        </>
      }
    </ProtectedRouteLayout>
  );
}

export default Dashboard;