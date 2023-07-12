import prisma from "@/lib/prisma/client";
import {Message} from "@/lib/types";
import {MessageList} from "@/lib/components";

const getMessages: () => Promise<Message[]> = async () => {
    try {
        return await prisma.message.findMany({
            include: {
                user: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    } catch (e) {
        console.error(e);
    }
    return [];
}

export const revalidate = 0

export default async function Page() {
    const messages = await getMessages();

    return (
        <>
            <MessageList messages={messages}/>
        </>
    )
}
