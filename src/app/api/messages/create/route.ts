import prisma from '@/lib/prisma/client';
import {NextResponse} from "next/server";
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
    console.log("test cake")
    // only allow application/json content-type
    if (request.headers.get('content-type') !== 'application/json') {
        return NextResponse.json(null, {status: 400, statusText: 'Bad Request: Content-Type must be application/json'});
    }

    try {
        // parse the request body as JSON
        const {title, content} = await request.json();

        // validate the request body
        if (title && content) {
            // create a new message
            const message = await prisma.message.create({
                data: {
                    title: title,
                    content: content,
                },
            });

            revalidatePath("/")

            // return the newly created message
            return NextResponse.json({message}, {status: 201, statusText: 'Message created.'});
        } else {
            return NextResponse.json(null, {status: 400, statusText: 'Bad Request: Required fields not provided. Message not created.'});
        }
    } catch (error) {
        console.error("Error occurred while creating message:", error);
        return NextResponse.json(null, {status: 500, statusText: 'An error occurred while creating the message.'});
    }
}
