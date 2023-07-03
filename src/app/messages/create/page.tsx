import {MessageCreateForm} from "@/lib/components";

export default async function CreateMessagePage() {
    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Create Message</h1>
            <MessageCreateForm/>
        </>
    );
}
