import { ExtraDataType, Message } from "@/types";
import { FC, useState } from "react";
import { Collapse } from 'react-collapse';
import CodeEditor from "./CodeEditor";

interface Props {
    message: Message;
}

const AgentMessage: FC<Props> = (props) => {
    const { message } = props;
    const [collapsed, setCollaped] = useState<boolean>(false)

    return (
        <>
            <div
                // key={index}
                className={`max-w-2xl ${message.role === "user"
                    ? "self-end ml-auto"
                    : "self-start"
                    }`}
            >
                <div className='ml-2'>{message.heading}</div>
                <div className="chat rounded-xl whitespace-pre-wrap">
                    {message.type === ExtraDataType.Code ? (
                        <div className="chat-code rounded-xl whitespace-pre-wrap">
                            <CodeEditor readOnly value={message.text as string} />
                        </div>
                    ) : (
                        <div className=' px-4 py-3'>
                            {message.text}
                        </div>
                    )}
                    {!!message.data?.length &&
                        <div
                            onClick={() => setCollaped(!collapsed)}
                            className='mt-4 px-4 pb-3 cursor-pointer text-indigo-500'
                        >
                            {collapsed ? "Hide" : "Show more"}
                        </div>
                    }
                </div>

                <Collapse checkTimeout={1000} isOpened={collapsed}>

                    {message.data?.map(msg => (
                        <div key={msg.heading} className='mt-4'>
                            <div className='ml-2'>{msg.heading}</div>

                            {msg.type === ExtraDataType.Code ? (
                                <div className="chat-code rounded-xl whitespace-pre-wrap">
                                    <CodeEditor readOnly value={msg.text as string} />
                                </div>
                            ) : (
                                <div className='chat bg-gray-900 px-4 py-3 rounded-xl whitespace-pre-wrap'>
                                    {msg.text}
                                </div>
                            )}

                        </div>
                    ))}

                </Collapse>
            </div>
        </>
    );
}

export default AgentMessage;