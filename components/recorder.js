"use client"
import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { transcribeWithWhisper } from '@/lib/actions/whisper';
import { ReloadIcon } from "@radix-ui/react-icons"
import { Badge } from './ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Card, CardContent, CardHeader } from './ui/card';

export default function AudioRecorder() {
    const [recording, setRecording] = useState(false);
    const [loading, setLoading] = useState(false);
    const [failed, setFailed] = useState(false);
    const [failedMessage, setFailedMessage] = useState(null);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);
    const stream = useRef(null);

    async function uploadToWhisper(formData) {
        setLoading(true);
        const file = formData.get('audio');
        const arrayBuffer = await file.arrayBuffer();
        const audio = new Uint8Array(arrayBuffer);
        const failed = await transcribeWithWhisper(audio);
        if (failed) {
            setFailed(true);
            setLoading(false);
            setFailedMessage(failed.message);
            return;
        }
        setLoading(false);
    }

    const handleToggleRecording = async () => {
        if (!recording) {
            stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream.current);
            mediaRecorder.current.start();

            mediaRecorder.current.addEventListener("dataavailable", event => {
                audioChunks.current.push(event.data);
            });

            setRecording(true);
        } else {
            mediaRecorder.current.stop();
            mediaRecorder.current.addEventListener("stop", () => {
                const audioBlob = new Blob(audioChunks.current);
                const file = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });
                const formData = new FormData();
                formData.append('audio', file);
                uploadToWhisper(formData);
                audioChunks.current = [];
                stream.current.getTracks().forEach(track => track.stop());
            });

            setRecording(false);
        }
    };

    return (
        <>
        {failed && (
            <Card className="px-4 py-4">
                <CardHeader>Failed to take voice note</CardHeader>
                <CardContent>
                    <p>{failedMessage}</p>
                </CardContent>
                <Button onClick={() => setFailed(false)}>Try Again</Button>
            </Card>
        )}
        {!failed && (<Button onClick={handleToggleRecording}>
            {!recording && !loading && ('Record New Deal Note')}
            {recording && !loading && ('Stop Recording Note')}
            {loading && (<><ReloadIcon className="h-6 w-6 animate-spin" /> Updating...</>)}
        </Button>
        )}
        {recording && (
            <Badge className="bg-red-100 text-red-800">
                <ReloadIcon className="h-6 w-6 animate-spin" /> Recording...
            </Badge>
        )}
        </>
    );
}