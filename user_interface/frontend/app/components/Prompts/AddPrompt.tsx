'use client'
import { FC } from 'react'
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "@/store/hooks";
import { addPrompt } from "@/store/redux/pageSlice"
import Modal from '../common/Modal';
import IncotextExampleForm from './PromptForm';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
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
        .required("Description is required")
});

const initialValues = {
    name: "",
    shortDescription: "",
    description: "",
    isEnabled: true,
}

const AddIncontextExample: FC<Props> = (props) => {
    const { open, setOpen, type } = props;
    const dispatch = useAppDispatch();

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values, actions) => {
            setOpen(false)

            const res = await dispatch(addPrompt({ ...values, type }));

            if (res) {
                actions.resetForm();

            } else {
                setOpen(true)
            }
        },
    });

    const onClose = () => {
        setOpen(false);
        formik.resetForm();
    }

    return (
        <Modal open={open} onClose={onClose}>
            <IncotextExampleForm onClose={onClose} formik={formik} type={type} />
        </Modal>
    )
}

export default AddIncontextExample;