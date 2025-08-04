'use client';

import { FC, useEffect } from 'react'
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { editIncontextExample, selectIncontextExamples } from "@/app/store/redux/pageSlice";
import Modal from '../common/Modal';
import IncotextExampleForm from './IncotextExampleForm';

interface Props {
    open: boolean;
    setOpen: (open: string) => void;
    incontextExampleId: string;
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
    type: Yup.string()
        .required("Type is required")
});

const initialValues = {
    name: "",
    shortDescription: "",
    description: "",
    isEnabled: true,
    type: ""
}

const EditIncontextExample: FC<Props> = (props) => {
    const { open, setOpen, incontextExampleId } = props;
    const dispatch = useAppDispatch();
    const incontextExamples = useAppSelector(selectIncontextExamples);

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values, actions) => {
            setOpen(null!)

            const res = await dispatch(editIncontextExample(values, incontextExampleId));

            if (res) {
                actions.resetForm()
            } else {
                setOpen(incontextExampleId)
            }
        },
    });

    const { setFieldValue } = formik

    useEffect(() => {
        const incontextExample = incontextExamples.find(incontextExample => incontextExample._id === incontextExampleId);


        if (incontextExample) {
            setFieldValue("name", incontextExample.name);
            setFieldValue("shortDescription", incontextExample.shortDescription);
            setFieldValue("type", incontextExample.type);
            setFieldValue("description", incontextExample.description);
            setFieldValue("isEnabled", incontextExample.isEnabled);
        }
    }, [incontextExampleId])

    const onClose = () => {
        setOpen(null!);
        formik.resetForm();
    }

    return (
        <Modal open={open} onClose={onClose}>
            <IncotextExampleForm onClose={onClose} formik={formik} />
        </Modal>
    )
}

export default EditIncontextExample;