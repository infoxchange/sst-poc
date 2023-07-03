import prisma from "@/lib/prisma/client";
import {Message} from "@/lib/types";
import {MessageList} from "@/lib/components";

const getMessages: () => Promise<Message[]> = async () => {
    return await prisma.message.findMany({
        include: {
            user: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}

export default async function Page() {
    const messages = await getMessages();

    return (
        <>
            <MessageList messages={messages}/>
        </>
    )
}
