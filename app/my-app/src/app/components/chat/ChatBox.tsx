'use client'

import { FC } from 'react'
import { Prompt } from '@/app/types';
import { useFormik, FormikProvider } from 'formik';
import * as Yup from "yup";
import { useAppDispatch } from "@/app/store/hooks";
import { setDescription, setMessageHistory } from '../../store/redux/chatSlice';

interface Props {
    prompt: Prompt;
    sendDescription: (description: string) => void;
}

const initialValues = {
    description: "",
}

// validation schema
const validationSchema = Yup.object({
    description: Yup.string()
        .required("Prompt is required")
});

const ChatBox: FC<Props> = (props) => {
    const { prompt, sendDescription } = props;
    const dispatch = useAppDispatch();

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values, actions) => {
            const { description } = values;
            if (!description) {
                return;
            }

            sendDescription(description);

            dispatch(setDescription(description));
            actions.resetForm()
        },
    });

    const { values, handleChange, handleSubmit } = formik;

    return (
        <FormikProvider value={formik}>
            <form onSubmit={handleSubmit} className="relative">
                <div className="chatbox rounded-4xl p-4">
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        placeholder="Write a description..."
                        className="block w-full resize-none px-3 py-1.5 text-base placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                        onChange={handleChange}
                        value={"Two employees are working on a joint project and must decide whether to share all their innovative ideas or keep some to themselves for credit. If both share openly, the project flourishes and they achieve great results, earning joint recognition. If one shares while the other withholds, the sharer contributes more but feels exploited, while the withholder benefits more and gains more recognition. If neither shares openly, the project suffers, and they both receive mediocre evaluations."}
                    />

                    {/* Spacer element to match the height of the toolbar */}
                    <div aria-hidden="true">
                        <div className="h-px" />
                        <div className="py-2">
                            <div className="py-px">
                                <div className="h-9" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute inset-x-px bottom-0 p-4">
                    <div className="flex flex-nowrap space-x-2 px-2 py-2 sm:px-3">
                    </div>
                    <div className="flex items-center text-indigo-600 justify-between space-x-3 px-2 py-2 sm:px-3">
                        <div className="flex">
                            {prompt?.name}
                        </div>
                        <div className="shrink-0">
                            <button
                                type="submit"
                                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Chat
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </FormikProvider>
    )
}

export default ChatBox;