import { FC, useEffect } from 'react';
import Modal from '../common/Modal';
import { useFormik, ErrorMessage, Field, FormikProvider } from "formik";
import * as Yup from "yup";
import ErrMsg from '../common/form/ErrMsg';

// validation schema
const validationSchema = Yup.object({
    name: Yup.string()
        .matches(/^[A-Za-z ]+/, 'Please enter valid name')
});

interface Props {
    initName: string;
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    saveAgent: (name: string) => void;
}

const SaveAgentModal: FC<Props> = (props) => {
    const { initName, isOpen, setOpen, saveAgent } = props;

    const formik = useFormik({
        initialValues: {
            name: initName
        },
        validationSchema,
        onSubmit: async (values) => {
            setOpen(false);

            saveAgent(values.name);
        },

    });

    const { values, handleChange, handleSubmit, setFieldValue, isValid } = formik;

    useEffect(() => {
        setFieldValue("name", initName)
    }, [initName])

    const onClose = () => {
        setOpen(false);
        formik.resetForm();
    }


    return (
        <Modal open={isOpen} onClose={onClose}>
            Save Agent
            <FormikProvider value={formik}>
                <form onSubmit={handleSubmit}>
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 ">
                        <div className="sm:col-span-4">
                            <label htmlFor="name" className="block text-sm/6 font-medium text-white">
                                Name
                            </label>
                            <div className="mt-2">
                                <Field
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="off"
                                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                    onChange={handleChange}
                                    value={values.name}
                                />
                                <ErrorMessage name={"name"} component={ErrMsg} />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button
                            onClick={onClose}
                            type="button"
                            className="cursor-pointer text-sm/6 font-semibold text-white">
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={!isValid}
                            className="cursor-pointer rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </FormikProvider>

        </Modal>
    );
};

export default SaveAgentModal;
