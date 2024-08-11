import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {generateImage, generateImagePrompt} from "@/lib/openai";
import { $notes } from "@/lib/db/schema";
import { db } from "@/lib/db";

export async function POST(req: Request)
{
    const { userId } = auth()
    if (!userId)
    {
        return new NextResponse('unathorized', { status: 401 })
    }
    const body = await req.json();
    const {name} = body;

    const image_description = await generateImagePrompt(name);
    console.log(image_description);

    if(!image_description)
    {
        return new NextResponse('Failed to generate image description', { status: 500 });
    }
    const imageUrl = await generateImage(image_description);
    if (!imageUrl)
    {
        return new NextResponse('Failed to generate image', { status: 500 });
    }
    const notes_id = await db.insert($notes).values({
        name,
        imageUrl,
        userId
    }).returning({
        insertedId:$notes.id
    });
    return NextResponse.json({
        note_id: notes_id[0].insertedId
    })
}