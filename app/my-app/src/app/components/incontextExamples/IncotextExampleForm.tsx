'use client'
import { FC } from 'react'
import { useFormik, ErrorMessage, Field, FormikProvider } from "formik";
import ErrMsg from "@/app/components/common/form/ErrMsg";
import { IncontextType } from '@/app/types';

interface Props {
    formik: ReturnType<typeof useFormik<any>>;
    onClose: () => void;
}

const IncotextExampleForm: FC<Props> = (props) => {
    const { formik, onClose } = props;

    const { values, handleChange, handleSubmit } = formik

    const incontextTypes = [
        IncontextType.Game,
        IncontextType.Stratergy,
        IncontextType.GameStratergy
    ]

    return (
        <FormikProvider value={formik}>
            <form onSubmit={handleSubmit}>
                <div className="space-y-12">
                    <div className="border-b border-white/10 pb-8">
                        <h2 className="text-base/7 font-semibold text-white">Add Example</h2>

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
                                    Type
                                </label>
                                <div className="mt-2">
                                    <Field
                                        id="type"
                                        name="type"
                                        as="select"
                                        className="block w-full rounded-md bg-gray-900 bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                        onChange={handleChange}
                                        value={values.type}
                                    >
                                        <option value="" className=" bg-gray-900"></option>
                                        {incontextTypes.map(type => 
                                            <option key={type} value={type} className="bg-gray-900">{type}</option>
                                        )}
                                    </Field>

                                    <ErrorMessage name={"type"} component={ErrMsg} />
                                </div>
                            </div>

                            <div className="sm:col-span-4">
                                <label htmlFor="email" className="block text-sm/6 font-medium text-white">
                                    Short Description
                                </label>
                                <div className="mt-2">
                                    <Field
                                        id="shortDescription"
                                        name="shortDescription"
                                        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                        onChange={handleChange}
                                        value={values.shortDescription}
                                    />
                                    <ErrorMessage name={"shortDescription"} component={ErrMsg} />
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
                                    <ErrorMessage name={"description"} component={ErrMsg} />
                                </div>
                            </div>

                            <div className="sm:col-span-4">
                                <div className="flex items-center justify-between">
                                    <span className="flex grow flex-col">
                                        <label className="text-sm/6 font-medium" id="availability-label">Enable Example</label>
                                        <span className="text-sm text-gray-600" id="availability-description">A disabled example will not show on dashboard screen.</span>
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
                        onClick={onClose}
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
    )
}

export default IncotextExampleForm;