import React, { useState } from 'react';

const Practice = () => {
    const [count, setCount] = useState(0);

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState([]);

    // store input values
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // validate ONLY on button click
    const handleSubmit = () => {
        let newErrors = [];

        if (form.name.trim() === '') {
            newErrors.push('Please enter your name');
        }

        if (!form.email.includes('@')) {
            newErrors.push('Please enter a valid email');
        }

        if (form.password.length < 6) {
            newErrors.push('Password must be at least 6 characters');
        }

        setErrors(newErrors);
    };

    return (
        <div className='mt-8'>

            {/* COUNTER */}
            <div className='flex-cols gap-8 justify-center bg-yellow-800'>
                <h2 className='text-center mb-8'>
                    Count: <span>{count}</span>
                </h2>

                <div className='flex gap-8 justify-center'>
                    <button onClick={() => setCount(count - 1)}>Decrease</button>
                    <button onClick={() => setCount(count + 1)}>Increase</button>
                    <button onClick={() => setCount(0)}>Reset</button>
                </div>
            </div>

            {/* FORM */}
            <div className='mt-16 flex-cols'>
                <h2 className='text-center'>Form Validation</h2>

                {/* ERRORS */}
                {errors.length > 0 &&
                    errors.map((err, i) => (
                        <p key={i} className='text-red-900 text-center'>
                            {err}
                        </p>
                    ))
                }

                <div className='mx-8 space-y-2 flex flex-col items-center mt-8'>

                    <input
                        name='name'
                        placeholder='enter your name'
                        onChange={handleChange}
                        className='border p-1 text-center'
                    />

                    <input
                        name='email'
                        placeholder='enter your email'
                        onChange={handleChange}
                        className='border p-1 text-center'
                    />

                    <input
                        name='password'
                        placeholder='enter your password'
                        onChange={handleChange}
                        className='border p-1 text-center'
                    />

                    <button
                        className='bg-emerald-400 px-3 py-2 rounded-lg active:scale-95'
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>

                </div>
            </div>
        </div>
    );
};

export default Practice;