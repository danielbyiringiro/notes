'use client'
import React from "react"
import {EditorContent, useEditor} from "@tiptap/react"
import {StarterKit} from "@tiptap/starter-kit"
import {Button} from "@/components/ui/button"
import TipTapMenuBar from "@/components/TipTapMenuBar"
import {useDebounce} from "@/lib/useDebounce"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { NoteType } from "@/lib/db/schema"
import Text from "@tiptap/extension-text"
import {useCompletion} from "ai/react"

type Props = {note: NoteType}

export default ({note}: Props) =>
{
    const [editorState, setEditorState] = React.useState(note.editorState || "")
    const saveNote = useMutation({
        mutationFn: async () => {
            const response = await axios.post('/api/saveNote', {
                noteId: note.id,
                editorState,
        });
        return response.data;
    }})

    const editor = useEditor({
        autofocus: true,
        extensions: [StarterKit],
        content: editorState,
        onUpdate: ({editor}) =>
        {
            setEditorState(editor.getHTML())
        }
    })
    const debouncedEditorState = useDebounce(editorState, 500)
    React.useEffect(() =>
    {
        if (debouncedEditorState === '') return;
        saveNote.mutate(undefined, {
            onSuccess: data =>
            {
                console.log('Saved', data);
            },
            onError: error =>
            {
                console.error('Failed to save', error);
            }
        });
    }, [debouncedEditorState])

    return (
        <>
            <div className="flex justify-start">
                {editor && <TipTapMenuBar editor={editor}/> }
                <Button disabled variant={"outline"}>
                    {saveNote.isPending ? 'Saving...' : 'Saved'}
                </Button>
            </div>
            <div className="prose prose-sm w-full mt-4">
                <EditorContent editor={editor} />
            </div>
            <div className="h-4"></div>
        </>
    )
}