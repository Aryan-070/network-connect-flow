import React, { useEffect, useRef, useState, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Added Card components
import { ScrollArea } from '@/components/ui/scroll-area'; // Added ScrollArea
import { Mic, Pause, Play, MicOff } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface AudioRecorderProps {
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  userId: string; // Added userId prop
}

// Utility: downsample Float32Array to Int16 PCM at 16kHz
function downsampleBuffer(buffer: Float32Array, inSampleRate: number, outSampleRate: number): Int16Array {
  if (outSampleRate === inSampleRate) {
    return Int16Array.from(buffer.map(n => Math.max(-1, Math.min(1, n)) * 0x7FFF));
  }
  const sampleRatio = inSampleRate / outSampleRate;
  const newLength = Math.round(buffer.length / sampleRatio);
  const result = new Int16Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;
  while (offsetResult < newLength) {
    const idx = Math.floor(offsetBuffer);
    // Ensure buffer[idx] exists before accessing
    result[offsetResult] = Math.max(-1, Math.min(1, buffer[idx] || 0)) * 0x7FFF;
    offsetResult++;
    offsetBuffer += sampleRatio;
  }
  return result;
}

export default function AudioRecorder({ isRecording, setIsRecording, userId }: AudioRecorderProps) {
  const socketRef = useRef<Socket | null>(null);
  const mediaRef = useRef<{
    audioCtx: AudioContext;
    source: MediaStreamAudioSourceNode;
    processor: ScriptProcessorNode;
    stream: MediaStream;
  } | null>(null);
  const transcriptionsRef = useRef<HTMLDivElement>(null); // Ref for scrolling

  const [isPaused, setIsPaused] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [transcriptions, setTranscriptions] = useState<string[]>([]); // State to store transcriptions

  // --- Wait for WebSocket Connection ---
  const waitForSocketConnection = () => {
    return new Promise<void>((resolve, reject) => {
      if (socketRef.current?.connected) {
        resolve();
      } else {
        const timeout = setTimeout(() => {
          reject(new Error('WebSocket connection timed out.'));
        }, 5000); // 5-second timeout

        socketRef.current?.on('connect', () => {
          clearTimeout(timeout);
          resolve();
        });
      }
    });
  };

  // --- Stop Recording Logic ---
  const stopRecording = useCallback(() => {
    if (!mediaRef.current) return; // Check mediaRef directly
    console.log('Stopping recording...');
    const { audioCtx, source, processor, stream } = mediaRef.current;
    try {
      processor.disconnect();
      source.disconnect();
      audioCtx.close();
    } catch (error) {
      console.error('Error disconnecting audio nodes:', error);
    }
    stream.getTracks().forEach((t) => t.stop());
    mediaRef.current = null; // Clear mediaRef
    setIsRecording(false); // Update state passed from parent
    setIsPaused(false); // Reset pause state
    toast({ title: 'Recording stopped' });
  }, [setIsRecording]); // Dependency on setIsRecording

  // --- Socket Effect ---
  useEffect(() => {
    console.log('Attempting to connect WebSocket...');
    const newSocket = io('http://127.0.0.1:5000', {
      query: { user_id: userId },
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('connect_error', (err) => {
      console.error('WebSocket connection error:', err.message);
    });

    newSocket.on('disconnect', (reason) => {
      console.warn('WebSocket disconnected:', reason);
      setIsConnected(false);
    });

    // Listen for transcription results from the backend
    newSocket.on('transcription_result', (resultData) => {
      console.log('Received transcription result:', resultData);
      const { start, end, transcript } = resultData;
      setTranscriptions((prev) => [
        ...prev,
        `${start} → ${end}: ${transcript}`,
      ]);
    });

    socketRef.current = newSocket;

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  // --- Scroll to bottom when transcriptions update ---
  useEffect(() => {
    if (transcriptionsRef.current) {
      transcriptionsRef.current.scrollTop = transcriptionsRef.current.scrollHeight;
    }
  }, [transcriptions]);

  // --- Start Recording Logic ---
  const startRecording = async () => {
    console.log('Attempting to start recording...');
    if (isRecording) {
      console.log('Recording is already in progress.');
      return;
    }

    try {
      await waitForSocketConnection();
      console.log('WebSocket is connected. Proceeding to start recording...');
    } catch (err) {
      console.error(err.message);
      toast({ title: 'Error', description: 'WebSocket connection failed.', variant: 'destructive' });
      return;
    }

    // Request microphone permissions
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted.');

      const audioCtx = new (window.AudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);

      processor.onaudioprocess = (e) => {
        if (isPaused) return;

        const floatData = e.inputBuffer.getChannelData(0);
        const pcmData = downsampleBuffer(floatData, audioCtx.sampleRate, 16000);

        if (socketRef.current?.connected) {
          console.log('Sending audio data:', pcmData);
          socketRef.current.emit('audio_chunk', pcmData.buffer);
        } else {
          console.warn('Socket is not connected. Audio data not sent.');
        }
      };

      source.connect(processor);
      processor.connect(audioCtx.destination);

      mediaRef.current = { audioCtx, source, processor, stream }; // Set mediaRef
      setIsRecording(true);
      toast({ title: 'Recording started' });
    } catch (err) {
      console.error('Microphone access denied or error occurred:', err);
      toast({
        title: 'Microphone Error',
        description: 'Please allow microphone access in your browser settings.',
        variant: 'destructive',
      });
    }
  };

  // --- Pause/Resume Recording Logic ---
  const pauseRecording = () => {
    if (!isRecording || !mediaRef.current) return;
    setIsPaused((prev) => {
      const newState = !prev;
      toast({ title: newState ? 'Recording paused' : 'Recording resumed' });
      return newState;
    });
  };

  // --- JSX Rendering ---
  return (
    <div className="space-y-4">
      {/* Recording Controls */}
      <div className="flex space-x-2 items-center">
        {!isRecording ? (
          <Button onClick={startRecording} className="flex gap-2">
            <Mic size={16} />
            Start Recording
          </Button>
        ) : (
          <>
            <Button
              onClick={pauseRecording}
              className="flex gap-2"
              disabled={!isRecording || !mediaRef.current}
            >
              {isPaused ? <Play size={16} /> : <Pause size={16} />}
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button
              onClick={stopRecording}
              variant="destructive"
              className="flex gap-2"
              disabled={!isRecording || !mediaRef.current}
            >
              <MicOff size={16} />
              Stop
            </Button>
          </>
        )}
        <span className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {/* Transcription Display Area */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Live Transcription</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48 w-full rounded-md border p-4">
            <div ref={transcriptionsRef} className="space-y-2 text-sm">
              {transcriptions.length === 0 && isRecording && (
                <p className="text-muted-foreground">Listening...</p>
              )}
              {transcriptions.length === 0 && !isRecording && (
                <p className="text-muted-foreground">Start recording to see transcriptions.</p>
              )}
              {transcriptions.map((text, index) => (
                <p key={index}>{text}</p>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}