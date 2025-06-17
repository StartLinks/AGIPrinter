import { useState } from "react";

export interface Note {
    id: string;
    text: string;
    position: { x: number; y: number };
}

export function useNotes(initialNotes: Note[] = []) {
    const [notes, setNotes] = useState<Note[]>(initialNotes);

    // 添加便签
    const addNote = () => {
        const newNote: Note = {
            id: `note-${Date.now()}`,
            text: "新便签",
            position: {
                x: Math.random() * 200 + 100,
                y: Math.random() * 200 + 200,
            },
        };
        setNotes((prev) => [...prev, newNote]);
    };

    // 删除便签
    const removeNote = (noteId: string) => {
        setNotes((prev) => prev.filter((note) => note.id !== noteId));
    };

    // 删除最后一个便签
    const removeLastNote = () => {
        if (notes.length > 0) {
            removeNote(notes[notes.length - 1].id);
        }
    };

    // 更新便签内容
    const updateNote = (noteId: string, text: string) => {
        setNotes((prev) =>
            prev.map((note) => note.id === noteId ? { ...note, text } : note)
        );
    };

    // 更新便签位置
    const updateNotePosition = (
        noteId: string,
        position: { x: number; y: number },
    ) => {
        setNotes((prev) =>
            prev.map((note) =>
                note.id === noteId ? { ...note, position } : note
            )
        );
    };

    return {
        notes,
        addNote,
        removeNote,
        removeLastNote,
        updateNote,
        updateNotePosition,
    };
}
