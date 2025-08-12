'use client'
import ProtectedRouteLayout from "@/components/common/ProtectedRouteLayout"
import ChatUI from "@/components/chat/ChatUI";
import SelectMode from "@/components/ModeSelection/SelectMode";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectLoading, getAllIncontextExamples, getAllPrompts } from "@/store/redux/pageSlice"
import { FC, useEffect, useState } from "react";
import Loading from "@/components/common/Loading";

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