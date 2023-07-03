import {Message} from "@/lib/types";

type Props = {
    messages: Message[];
};

export default function MessageList(props: Props): JSX.Element {
    let {messages} = props;
    const renderMessages = () => {
        if (messages.length === 0) {
            return (
                <li className="py-4 text-center text-gray-500">
                    There are currently no messages available to display.
                </li>
            );
        } else {
            return messages.map((message) => (
                <li
                    key={message.id}
                    className="p-4 bg-white shadow-sm rounded-sm mb-4"
                >
                    <div className="flex justify-between items-start">
                        <h2 className="text-xl font-bold">{message.title}</h2>
                        <div className="text-xs text-gray-500">
                            {message.user && (<p>{message.user.email}</p>)}
                            <p>{new Date(message.createdAt).toLocaleString()}</p>
                        </div>
                    </div>
                    <p className="mt-2 text-gray-700 whitespace-pre-wrap">{message.content}</p>
                </li>
            ));
        }
    };

    return (
        <>
            <h1 className="text-3xl font-bold mb-4">Messages</h1>
            <ul>{renderMessages()}</ul>
        </>
    );
}