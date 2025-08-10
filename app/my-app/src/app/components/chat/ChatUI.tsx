import { useState, FC, useEffect } from 'react';
import ChatBox from './ChatBox';
import WebSocketHook from "@/app/hooks/WebSocketHook"
import { selectPrompt, selectIncontextExample, selectMessagesHistory, selectDescription, selectLoading, selectAgent, selectMode, selectAgentLoaded } from '../../store/redux/chatSlice';
import { useAppSelector } from "@/app/store/hooks";
import GameRuleEditModal from './GameRuleEditModal';
import AgentMessage from './AgentMessage';
import SaveAgentModal from './SaveAgentModal';
import AgentActions from './AgentActions';

const ChatScreen: FC = () => {
    const loading = useAppSelector(selectLoading);
    const prompt = useAppSelector(selectPrompt);
    const example = useAppSelector(selectIncontextExample);
    const description = useAppSelector(selectDescription);
    const messages = useAppSelector(selectMessagesHistory);
    const agent = useAppSelector(selectAgent);
    const mode = useAppSelector(selectMode);
    // const messagesEndRef = useRef(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSaveAgentOpen, setIsSaveAgentOpen] = useState(false);

    const {
        authenticateConneection,
        sendPrompt,
        sendIncontextExample,
        sendDescription,
        sendEditCode,
        sendUserMove,
        saveAgentHistory,
        saveAgentName,
        loadAgent,
        setAgentMode
    } = WebSocketHook()

    useEffect(() => {
        if (prompt && example) {
            authenticateConneection();
            sendPrompt(prompt, mode);
            sendIncontextExample(example);
            setAgentMode(mode)
        }
    }, [])

    // useEffect(() => {
    //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    // }, [messages]);



    const saveAgent = (name: string) => {
        saveAgentName(name);
        saveAgentHistory(messages);
    }

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                {messages.map((msg, index) => (
                    <AgentMessage message={msg} key={index} />
                ))}
                {loading && (
                    <div className=" flex justify-center items-center">
                        <div className="my-8 animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
                    </div>
                )}
                {/* <div ref={messagesEndRef} /> */}
            </div>
            {(!description && !agent) &&
                <div className="sticky bottom-0 p-4">
                    <ChatBox
                        sendDescription={sendDescription}
                        prompt={prompt}
                        example={example}
                        mode={mode}
                    />
                </div>
            }
            <AgentActions
                sendUserMove={sendUserMove}
                setIsEditMode={setIsEditMode}
                setIsSaveAgentOpen={setIsSaveAgentOpen}
                loadAgent={loadAgent}
            />

            <GameRuleEditModal
                isOpen={isEditMode}
                onCancel={() => setIsEditMode(false)}
                value={agent?.gameRules}
                onSave={sendEditCode}
            />

            <SaveAgentModal
                initName={agent?.name}
                isOpen={isSaveAgentOpen}
                setOpen={setIsSaveAgentOpen}
                saveAgent={saveAgent}
            />
        </div>
    );
}

export default ChatScreen;