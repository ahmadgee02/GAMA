'use client'
import { FC } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { useFormik, ErrorMessage, Field, FormikProvider } from "formik";
import * as Yup from "yup";
import ErrMsg from "@/app/components/common/form/ErrMsg";
import { useAppDispatch } from "@/app/store/hooks";
import { addPrompt, registerUser } from "@/app/store/redux/pageSlice"

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
}

// validation schema
const validationSchema = Yup.object({
    name: Yup.string()
        .matches(/^[A-Za-z ]+/, 'Please enter valid name')
        .required("Name is required"),
    description: Yup.string()
        .required("Prompt is required")
});

const initialValues = {
    name: "",
    description: "",
    isEnabled: true
}

const AddPrompt: FC<Props> = (props) => {
    const { open, setOpen } = props;
    const dispatch = useAppDispatch();

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values, actions) => {
            setOpen(false)

            const res = await dispatch(addPrompt(values));

            if (res) {
                actions.resetForm()
            } else {
                setOpen(true)
            }
        },
    });

    const { values, handleChange, handleSubmit } = formik

    return (
        <div>
            <Dialog open={open} onClose={setOpen} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="bg-gray-900 relative transform overflow-hidden rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-3xl sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                        >
                            <FormikProvider value={formik}>
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-12">
                                        <div className="border-b border-white/10 pb-8">
                                            <h2 className="text-base/7 font-semibold text-white">Add Prompt</h2>

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

                                                <div className="sm:col-span-4">
                                                    <label htmlFor="email" className="block text-sm/6 font-medium text-white">
                                                        Description
                                                    </label>
                                                    <div className="mt-2">
                                                        <Field
                                                            id="description"
                                                            name="description"
                                                            as="textarea"
                                                            rows="12"
                                                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                                            onChange={handleChange}
                                                            value={values.description}
                                                        />
                                                        <ErrorMessage name={"email"} component={ErrMsg} />
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="flex grow flex-col">
                                                            <label className="text-sm/6 font-medium" id="availability-label">Enable Prompt</label>
                                                            <span className="text-sm text-gray-600" id="availability-description">Nulla amet tempus sit accumsan. Aliquet turpis sed sit lacinia.</span>
                                                        </span>
                                                        <div className="group relative inline-flex w-11 shrink-0 rounded-full bg-gray-200 p-0.5 inset-ring inset-ring-gray-900/5 outline-offset-2 outline-indigo-600 transition-colors duration-200 ease-in-out has-checked:bg-indigo-600 has-focus-visible:outline-2">
                                                            <span className="size-5 rounded-full bg-white shadow-xs ring-1 ring-gray-900/5 transition-transform duration-200 ease-in-out group-has-checked:translate-x-5"></span>
                                                            <Field
                                                                type="checkbox"
                                                                className="absolute inset-0 appearance-none focus:outline-hidden"
                                                                id="isEnabled"
                                                                name="isEnabled"
                                                                aria-labelledby="availability-label"
                                                                aria-describedby="availability-description"
                                                                onChange={handleChange}
                                                                checked={values.isEnabled}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-end gap-x-6">
                                        <button
                                            onClick={() => setOpen(false)}
                                            type="button"
                                            className="cursor-pointer text-sm/6 font-semibold text-white">
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            className="cursor-pointer rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </FormikProvider>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default AddPrompt;