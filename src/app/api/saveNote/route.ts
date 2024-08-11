import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { $notes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request)
{
    try
    {
        const body = await req.json();
        let {noteId, editorState} = body;
        if (!noteId || !editorState)
        {
            return new NextResponse("Invalid request", { status: 400 });
        }
        
        noteId = parseInt(noteId);
        const notes = await db
                            .select()
                            .from($notes)
                            .where(eq($notes.id, noteId));
        if (notes.length != 1)
        {
            return new NextResponse("Note not found", { status: 404 });
        }

        const note = notes[0];
        if (note.editorState !== editorState)
        {
            await db.update($notes)
                    .set({editorState})
                    .where(eq($notes.id, noteId));
        }
        return NextResponse.json({success: true}, { status: 200 });
    }
    catch (error)
    {
        console.error(error);
        return NextResponse.json({success: false}, { status: 500 });
    }
}