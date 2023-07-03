"use client";

import {useRouter} from "next/navigation";
import {useState} from 'react';

export default function MessageCreateForm() {
    const [errors, setErrors] = useState({title: '', content: ''});
    const [form, setForm] = useState({title: '', content: '',});
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onChange = (value: any, prop: string) => {
        setForm({
            ...form,
            [prop]: value,
        });
        setErrors({
            ...errors,
            [prop]: '',
        });
    };

    const onSubmit = async (e: any) => {
        e.preventDefault();
        const {title, content} = form;
        if (!title) {
            setErrors({...errors, title: 'Please enter a title.'});
            return;
        }
        if (!content) {
            setErrors({...errors, content: 'Please enter a message.'});
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('/api/messages/create', {
                method: 'POST',
                body: JSON.stringify(form),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                console.error('Create Message Error: ', response.body);
                setErrors({...errors, content: 'Failed to create message. Please try again later.'});
            }
            setForm({title: '', content: ''});
            setErrors({title: '', content: ''});
            await router.push('/');
        } catch (error) {
            console.error(error);
            setErrors({...errors, content: 'Failed to create message. Please try again later.'});
        } finally {
            setLoading(false);
        }
    };

    return (<>
        <form onSubmit={onSubmit}>
            <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title</label>
                <input
                    type="text"
                    name="title"
                    placeholder="Message Title"
                    onChange={(e) => onChange(e.target.value, 'title')}
                    value={form.title}
                    className={`border p-2 w-full ${errors.title ? 'border-red-500' : 'border-gray-400'}`}
                />
                {errors.title && (<p className="text-red-500 text-sm mt-2">{errors.title}</p>)}
            </div>
            <div className="mb-4">
                <label htmlFor="content" className="block text-gray-700 font-bold mb-2">Content</label>
                <textarea
                    name="content"
                    placeholder="Message Content"
                    onChange={(e) => onChange(e.target.value, 'content')}
                    value={form.content}
                    className={`border p-2 h-80 w-full ${errors.content ? 'border-red-500' : 'border-gray-400'}`}
                />
                {errors.content && (<p className="text-red-500 text-sm mt-2">{errors.content}</p>)}
            </div>
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Submit'}
            </button>
        </form>
    </>);
}