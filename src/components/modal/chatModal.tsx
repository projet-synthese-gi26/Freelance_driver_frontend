
import React, {ChangeEvent, useRef, useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { VideoCameraIcon, XMarkIcon, DocumentIcon, MicrophoneIcon, PaperAirplaneIcon, StopIcon } from '@heroicons/react/24/solid';
import InputEmoji from 'react-input-emoji';

interface ChatMessagesProps {
    messages: Message[];
}

interface ChatInputProps {
    text: string;
    setText: (text: string) => void;
    handleSendMessage: () => void;
    handleFileUpload: (event: ChangeEvent<HTMLInputElement>) => void;
    handleVoiceRecord: () => void;
    handleVideoCapture: () => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    isRecording: boolean;
    isVideoRecording: boolean;
}

interface ChatBoxProps {
    isChat: boolean;
    handleChatClick: () => void;
    driverName: string|undefined;
    profilePicture: string;
    className:string;
    driverId: string| undefined;
}

interface Message {
    text?: string;
    sender: 'user' | 'driver';
    file?: {
        name: string;
        url: string;
    };
    audio?: string;
    video?: string;
}


const ChatBox: React.FC<ChatBoxProps> = ({ isChat, handleChatClick, driverName, profilePicture,className, driverId }) => {

    const [text, setText] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [isVideoRecording, setIsVideoRecording] = useState<boolean>(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    const handleSendMessage = () => {
        if (text.trim()) {
            setMessages([...messages, { text, sender: 'user' }]);
            setText("");
            // Here, you can add logic to send the message to the backend
        }
    };

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            setMessages([...messages, { file: { name: file.name, url: fileURL }, sender: 'user' }]);
            console.log("File uploaded:", file.name);
        }
    };

    const handleVoiceRecord = async () => {
        if (!isRecording) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorderRef.current = new MediaRecorder(stream);
                const chunks: BlobPart[] = [];

                mediaRecorderRef.current.ondataavailable = (event) => {
                    if (event.data.size > 0) chunks.push(event.data);
                };

                mediaRecorderRef.current.onstop = () => {
                    const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
                    if (audioRef.current) {
                        audioRef.current.src = URL.createObjectURL(blob);
                        setMessages([...messages, { audio: audioRef.current.src, sender: 'user' }]);
                    }
                };

                mediaRecorderRef.current.start();
                setIsRecording(true);
            } catch (err) {
                console.error("Error accessing microphone:", err);
            }
        } else {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
        }
    };

    const handleVideoCapture = async () => {
        if (!isVideoRecording) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                mediaRecorderRef.current = new MediaRecorder(stream);
                const chunks: BlobPart[] = [];

                mediaRecorderRef.current.ondataavailable = (event) => {
                    if (event.data.size > 0) chunks.push(event.data);
                };

                mediaRecorderRef.current.onstop = () => {
                    const blob = new Blob(chunks, { type: 'video/webm' });
                    const videoURL = URL.createObjectURL(blob);
                    setMessages([...messages, { video: videoURL, sender: 'user' }]);
                };

                mediaRecorderRef.current.start();
                setIsVideoRecording(true);
            } catch (err) {
                console.error("Error accessing camera:", err);
            }
        } else {
            mediaRecorderRef.current?.stop();
            if (videoRef.current && videoRef.current.srcObject instanceof MediaStream) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
            setIsVideoRecording(false);
        }
    };




    return (
       <>
            <div
                id="chatBox"
                className={className}
            >
                <div className="flex items-center gap-4 mb-4 p-2">
                    <div className="w-10 h-10 relative z-[1] rounded-full shrink-0">
                        <Image
                            width={30}
                            height={30}
                            src={profilePicture}
                            alt="image"
                            className="w-full h-full object-fit-cover overflow-hidden rounded-full"
                        />
                        <span
                            className="inline-block w-4 h-4 rounded-full bg-[#37D27A] absolute end-0 bottom-0 z-[1]"></span>
                    </div>
                    <h5 className="mb-2 flex-grow clr-neutral-500 text-sl font-medium">
                        {driverName}
                    </h5>
                    <Link
                        href="#"
                        className="link inline-block shrink-0 text-[var(--neutral-700)] hover:text-primary"
                    >
                        {/* <VideoCameraIcon
                            className="w-8 h-8 text-[var(--neutral-700)] hover:text-primary hover:fill-primary transition-colors duration-300 ease-in-out"/> */}
                    </Link>
                    <button
                        onClick={handleChatClick}
                        className="close-button hover:text-primary"
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "32px",
                            height: "32px",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        <XMarkIcon
                            className="close-icon hover:text-primary w-8 h-8 text-[var(--neutral-700)] hover:text-primary hover:fill-primary transition-colors duration-300 ease-in-out"
                            style={{
                                width: "24px",
                                height: "24px",
                                color: "#4b5563",
                            }}
                        />
                    </button>
                </div>
                <div
                    className="h-[100%] max-h-[79vh] scrollbar-hide min-h-[50vh] bg-[#EAEBFD] overflow-y-auto p-4"
                    style={{overflowY: "auto"}}
                    ref={scrollRef}
                >
                    <ChatMessages messages={messages}/>
                </div>
                <ChatInput
                    text={text}
                    setText={setText}
                    handleSendMessage={handleSendMessage}
                    handleFileUpload={handleFileUpload}
                    handleVoiceRecord={handleVoiceRecord}
                    handleVideoCapture={handleVideoCapture}
                    fileInputRef={fileInputRef}
                    isRecording={isRecording}
                    isVideoRecording={isVideoRecording}
                />
            </div>
            <audio ref={audioRef} style={{display: 'none'}}/>
            <video ref={videoRef} style={{display: 'none'}}/>
        </>
    );
};

const ChatMessages : React.FC<ChatMessagesProps> =({messages}) => (
    <ul className="flex flex-col gap-4">
        {messages.map((message, index) => (
            <li key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                    className={`p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                    {message.text && message.text}
                    {message.audio && <audio src={message.audio} controls/>}
                    {message.video && <video src={message.video} controls/>}
                    {message.file && (
                        <a href={message.file.url} download={message.file.name} className="text-white underline">
                            {message.file.name}
                        </a>
                    )}
                </div>
            </li>
        ))}
    </ul>
);

const ChatInput : React.FC<ChatInputProps> = ({
                       text,
                       setText,
                       handleSendMessage,
                       handleFileUpload,
                       handleVoiceRecord,
                       handleVideoCapture,
                       fileInputRef,
                       isRecording,
                       isVideoRecording
                   }) => (
    <div className="flex justify-content-flex shrink-0 w-full h-14 mt-2">
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{display: 'none'}}
        />
        <button type="button" className="ml-2 mr-2 hover:text-primary" onClick={() => {
            return fileInputRef.current?.click();
        }}>
            <DocumentIcon className="h-6 w-6 text-gray-500 hover:text-primary"/>
        </button>
        <button type="button" className="mr-1 hover:text-primary" onClick={handleVoiceRecord}>
            {isRecording ? <StopIcon className="h-6 w-6 text-red-500 hover:text-primary"/> :
                <MicrophoneIcon className="h-6 w-6 text-gray-500 hover:text-primary"/>}
        </button>
        <button
            type="button"
            className="link inline-block clr-neutral-500 text-[var(--neutral-700)] hover:text-primary hover:fill-primary transition-colors duration-300 ease-in-out"
            onClick={handleVideoCapture}
        >
            {isVideoRecording ? <StopIcon className="h-6 w-6 text-red-500"/> : <VideoCameraIcon className="w-8 h-8"/>}
        </button>
        <InputEmoji

            value={text}
            onChange={setText}
            cleanOnEnter
            onEnter={handleSendMessage}
            shouldReturn
            shouldConvertEmojiToImage={false}
            placeholder="Type a message"
        />
        <button
            type="button"
            className="ml-2 hover:text-primary"
            onClick={handleSendMessage}
        >
            <PaperAirplaneIcon className="h-6 w-6 text-gray-500 hover:text-primary"/>
        </button>
    </div>
);

export default ChatBox;