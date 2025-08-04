'use client'
import ProtectedRouteLayout from "@/app/components/common/ProtectedRouteLayout"
import ChatUI from "@/app/components/chat/ChatUI";
import SelectMode from "./components/ModeSelection/SelectMode";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { selectLoading, getAllIncontextExamples, getAllPrompts } from "@/app/store/redux/pageSlice"
import { FC, useEffect, useState } from "react";
import Loading from "@/app/components/common/Loading";

const Dashboard: FC = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectLoading);
  const [startChat, setStartChat] = useState(false);

  useEffect(() => {
    dispatch(getAllIncontextExamples());
    dispatch(getAllPrompts());
  }, [])

  return (
    <ProtectedRouteLayout>
      {loading ?
        <Loading loading={loading} />
        :
        startChat ?
          <ChatUI />
          :
          <SelectMode setStartChat={setStartChat} />
      }
    </ProtectedRouteLayout>
  );
}

export default Dashboard;