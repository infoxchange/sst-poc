import prisma from '@/lib/prisma/client';
import {NextResponse} from "next/server";

export async function GET() {
    try {
        const messages = await prisma.message.findMany();
        return NextResponse.json({messages});
    } catch (error) {
        console.error("Error occurred while fetching messages:", error);
        //return nextresponse with 500 error
        return NextResponse.next({
            status: 500,
            statusText: 'An error occurred while fetching messages.'
        });
    } finally {
        await prisma.$disconnect();
    }
}
