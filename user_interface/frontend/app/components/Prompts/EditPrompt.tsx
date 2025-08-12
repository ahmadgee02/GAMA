'use client';

import { FC, useEffect } from 'react'
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { editPrompt, selectPromptById } from "@/store/redux/pageSlice";
import Modal from '../common/Modal';
import PromptForm from './PromptForm';

interface Props {
    open: boolean;
    setOpen: (open: string) => void;
    promptId: string;
    type: string;
}

// validation schema
const validationSchema = Yup.object({
    name: Yup.string()
        .matches(/^[A-Za-z ]+/, 'Please enter valid name')
        .required("Name is required"),
    shortDescription: Yup.string()
        .required("Short description is required"),
    description: Yup.string()
        .required("Description is required"),
});

const initialValues = {
    name: "",
    shortDescription: "",
    description: "",
    isEnabled: true,
}

const EditIncontextExample: FC<Props> = (props) => {
    const { open, setOpen, promptId, type } = props;
    const dispatch = useAppDispatch();
    const prompt = useAppSelector(selectPromptById(promptId));

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values, actions) => {
            setOpen(null!)

            const res = await dispatch(editPrompt({...values, type }, promptId));

            if (res) {
                actions.resetForm()
            } else {
                setOpen(promptId)
            }
        },
    });

    const { setFieldValue } = formik

    useEffect(() => {

        if (prompt) {
            setFieldValue("name", prompt.name);
            setFieldValue("shortDescription", prompt.shortDescription);
            setFieldValue("description", prompt.description);
            setFieldValue("isEnabled", prompt.isEnabled);
        }
    }, [promptId])

    const onClose = () => {
        setOpen(null!);
        formik.resetForm();
    }

    return (
        <Modal open={open} onClose={onClose}>
            <PromptForm onClose={onClose} formik={formik} type={type} />
        </Modal>
    )
}

export default EditIncontextExample;