import { useState, FC, useEffect } from 'react';
import ChatBox from './ChatBox';
import WebSocketHook from "@/app/hooks/WebSocketHook"
import { selectPrompt, selectDescription, setDescription, selectMessagesHistory } from '../../store/redux/chatSlice';
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";

const ChatScreen = () => {
    const prompt = useAppSelector(selectPrompt);
    const messages = useAppSelector(selectMessagesHistory);

    // const [messages, setMessages] = useState([
    //     { id: 1, heading: "", text: 'Hello! How can I help you today?', role: "system" },
    //     { id: 2, heading: "", text: 'What is the weather like in London?', role: "user" },
    // ]);

    // const messagesEndRef = useRef(null);
    const {
        connectionStatus,
        handleClickSendMessage,
        authenticateConneection,
        sendPrompt,
        sendDescription
    } = WebSocketHook()

    useEffect(() => {
        if (prompt) {
            authenticateConneection();
            sendPrompt(prompt._id);
        }
    }, [prompt])

    // useEffect(() => {
    //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    // }, [messages]);

    console.log({ connectionStatus, handleClickSendMessage })

    return (
        <div className="flex flex-col h-screen">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`max-w-2xl ${msg.role === "user"
                            ? "self-end ml-auto"
                            : "self-start"
                            }`}
                    >
                        <div className='ml-2'>{msg.heading}</div>
                        <div className='chat bg-gray-900 px-4 py-3 rounded-xl  whitespace-pre-wrap'>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {/* <div ref={messagesEndRef} /> */}
            </div>

            {/* Input Area */}
            <div className="sticky bottom-0 p-4">
                <ChatBox
                    sendDescription={sendDescription}
                    prompt={prompt}
                />
            </div>
        </div>
    );
}

export default ChatScreen;