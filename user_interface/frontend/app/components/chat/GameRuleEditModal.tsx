import { FC, useEffect, useState } from 'react';
import CodeEditor from './CodeEditor';
import Modal from '../common/Modal';
import { useAppDispatch } from "@/store/hooks";
import { updateAgentGameRules } from '../../store/redux/chatSlice';

interface Props {
    isOpen: boolean
    value: string;
    onCancel: () => void;
    onSave: (code: string) => void;
}

const GameRuleEditModal: FC<Props> = (props) => {
    const dispatch = useAppDispatch();
    const { isOpen, value, onCancel, onSave } = props;
    const [code, setCode] = useState<string | undefined>(undefined);

    const handleSave = () => {
        if (code) {
            onSave(code);
            dispatch(updateAgentGameRules(code))
            onCancel();
        }
    };

    useEffect(() => {
        setCode(value)
    }, [value])

    return (
        <Modal open={isOpen} onClose={() => onCancel()}>
            Proglog Code Editor
            <div style={{
                height: `600px`
            }}>
                {isOpen && <CodeEditor value={value} onChange={setCode} />}
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    onClick={onCancel}
                    type="button"
                    className="cursor-pointer text-sm/6 font-semibold text-white">
                    Cancel
                </button>

                <button
                    onClick={handleSave}
                    type="submit"
                    disabled={!code}
                    className="cursor-pointer rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                    Save
                </button>
            </div>
        </Modal>
    );
};

export default GameRuleEditModal;
