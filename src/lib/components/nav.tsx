import Link from 'next/link';

export default function Nav(): JSX.Element {
    return (
        <nav className="bg-gray-800 py-4">
            <div className="max-w-3xl mx-auto">
                <ul className="flex items-start min-w-full">
                    <li className="mr-5">
                        <Link className="bg-gray-500 text-white py-2 px-4 mr-5 rounded hover:bg-gray-600 inline-block" href="/">Messages</Link>
                    </li>
                    <li className="ml-auto">
                        <Link className="bg-blue-500 text-white py-2 px-4 ml-5 rounded hover:bg-blue-600 inline-block" href="/messages/create">Post Message</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}