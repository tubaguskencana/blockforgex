// src/pages/apply/VideoRecord.jsx
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Typography, Avatar, message } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectApp } from "../../store";
import { getInitials } from "../../utils/name";
import logo from "../../assets/logo-blockforgex.png";
import { CameraOutlined, ReloadOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const MAX_SECONDS = 180; // 3 menit

export default function VideoRecord() {
    const { fullName } = useSelector(selectApp);
    const initials = getInitials(fullName);
    const navigate = useNavigate();

    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const recorderRef = useRef(null);
    const chunksRef = useRef([]);

    const [status, setStatus] = useState("init"); // init | error | ready | recording | preview
    const [devices, setDevices] = useState([]);
    const [deviceIdx, setDeviceIdx] = useState(0);
    const [blobURL, setBlobURL] = useState("");
    const [sec, setSec] = useState(0);

    const attachStream = useCallback(async () => {
        const v = videoRef.current;
        const s = streamRef.current;
        if (v && s) {
            v.srcObject = s;
            v.muted = true;
            v.playsInline = true;
            try { await v.play(); } catch { }
        }
    }, []);

    const stopStream = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
    }, []);

    const startStream = useCallback(async (deviceId) => {
        setStatus("init");
        try {
            const constraints = {
                audio: true,
                video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: "user" },
            };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

            const list = (await navigator.mediaDevices.enumerateDevices()).filter(
                (d) => d.kind === "videoinput"
            );
            setDevices(list);
            if (deviceId) {
                const idx = Math.max(0, list.findIndex((d) => d.deviceId === deviceId));
                setDeviceIdx(idx);
            } else {
                setDeviceIdx(0);
            }

            setStatus("ready");
            setTimeout(attachStream, 0);
        } catch (e) {
            console.error(e);
            setStatus("error");
        }
    }, [attachStream]);

    useEffect(() => {
        if (!navigator.mediaDevices?.getUserMedia) {
            setStatus("error");
            return;
        }
        startStream();
        return () => {
            stopStream();
            if (blobURL) URL.revokeObjectURL(blobURL);
        };
    }, []); // eslint-disable-line

    useEffect(() => {
        if (status === "ready" || status === "recording") {
            attachStream();
        }
    }, [status, attachStream]);

    const switchCamera = async () => {
        if (!devices.length) return;
        const next = (deviceIdx + 1) % devices.length;
        setDeviceIdx(next);
        stopStream();
        await startStream(devices[next].deviceId);
    };

    const startRecording = () => {
        const stream = streamRef.current;
        if (!stream) return;
        try {
            chunksRef.current = [];
            const mr = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" });
            recorderRef.current = mr;

            mr.ondataavailable = (e) => {
                if (e.data && e.data.size) chunksRef.current.push(e.data);
            };
            mr.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "video/webm" });
                const url = URL.createObjectURL(blob);
                setBlobURL(url);
                setStatus("preview");
                setSec(0);
            };

            mr.start(100);
            setStatus("recording");
            setSec(0);

            const iv = setInterval(() => {
                setSec((s) => {
                    if (s + 1 >= MAX_SECONDS) {
                        clearInterval(iv);
                        stopRecording();
                    }
                    return s + 1;
                });
            }, 1000);
        } catch (e) {
            console.error(e);
            message.error("Cannot start recording");
        }
    };

    const stopRecording = () => {
        const mr = recorderRef.current;
        if (mr && mr.state !== "inactive") mr.stop();
    };

    const retake = async () => {
        if (blobURL) URL.revokeObjectURL(blobURL);
        setBlobURL("");
        setStatus("ready");
        setTimeout(attachStream, 0);
    };

    const submitVideo = async () => {
        // TODO: upload ke API; untuk sekarang langsung ke success
        navigate("/apply/video/success");
    };

    const formatTime = (s) =>
        `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

    return (
        <div className="h-dvh w-full p-10">
            <div className="max-w-6xl mx-auto h-full flex flex-col">
                {/* ROW 1: logo kiri, avatar+nama kanan */}
                <div className="flex items-center justify-between">
                    <img src={logo} alt="Blockforgex" className="h-[64px] w-auto" />
                    {fullName && (
                        <div className="flex items-center gap-2">
                            <Avatar
                                size={28}
                                className="text-white"
                                style={{
                                    background:
                                        "radial-gradient(86% 86% at 50% 14%, #837CFF 0%, #4F46E5 100%)",
                                    fontWeight: 600,
                                }}
                            >
                                {initials}
                            </Avatar>
                            <Text className="text-gray-700">{fullName}</Text>
                        </div>
                    )}
                </div>

                {/* ROW 2: back kiri, TITLE center (sebaris) */}
                <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="justify-self-start text-indigo-600 hover:underline"
                    >
                        ← Back
                    </button>

                    <div className="justify-self-center text-center">
                        <Title level={1} className="!text-4xl !leading-[1.2] !mb-1">
                            Share Your Story & Achievements
                        </Title>
                        <Text type="secondary">
                            Record a short video introduction to complete your application.
                        </Text>
                    </div>

                    <div /> {/* spacer kanan */}
                </div>

                {/* VIDEO WRAPPER — center, rounded penuh, tinggi fix 300px */}
                <div className="mt-8 mx-auto w-full max-w-2xl rounded-2xl shadow-sm bg-black relative">
                    <div className="overflow-hidden rounded-2xl">
                        {/* State panels */}
                        {status === "error" && (
                            <div className="h-[300px] flex flex-col items-center justify-center text-white">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 mb-3">
                                    <CloseCircleOutlined className="text-red-400 text-2xl" />
                                </div>
                                <div className="text-lg font-semibold">Camera not Ready!!</div>
                                <p className="text-gray-300 text-sm mt-1">
                                    Please check permissions, connection, or device availability.
                                </p>
                                <Button
                                    type="primary"
                                    className="rf-btn-primary mt-3"
                                    onClick={() => navigate("/apply/video/help")}
                                >
                                    Why this happen?
                                </Button>
                            </div>
                        )}

                        {status === "init" && (
                            <div className="h-[300px] flex flex-col items-center justify-center text-white">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/20 mb-3">
                                    <CameraOutlined className="text-yellow-400 text-2xl" />
                                </div>
                                <div className="text-lg font-semibold">Initializing Camera...</div>
                            </div>
                        )}

                        {(status === "ready" || status === "recording") && (
                            <div className="relative h-[300px]">
                                {/* VIDEO (tanpa controls saat stream) */}
                                <video
                                    ref={videoRef}
                                    className="block w-full h-full object-contain bg-black"
                                />

                                {/* OVERLAY di atas video */}
                                <div className="absolute inset-0 z-20 pointer-events-none">
                                    {/* Switch camera (kanan-atas) */}
                                    {devices.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={switchCamera}
                                            onMouseDown={(e) => e.preventDefault()} // ⬅︎ cegah focus saat klik mouse
                                            className="pointer-events-auto absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center
                                                   focus:outline-none focus:ring-0 focus-visible:outline-none"
                                            style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
                                            title="Switch camera"
                                        >
                                            <ReloadOutlined />
                                        </button>

                                    )}

                                    {/* Record/Stop (tengah-bawah) */}
                                    <div className="absolute left-1/2 -translate-x-1/2 bottom-3">
                                        <button
                                            type="button"
                                            onClick={status === "recording" ? stopRecording : startRecording}
                                            className="pointer-events-auto"
                                            aria-label={status === "recording" ? "Stop recording" : "Start recording"}
                                            onMouseDown={(e) => e.preventDefault()} // ⬅︎ cegah focus saat klik mouse

                                            // netralisir global button background
                                            style={{ backgroundColor: "transparent", border: "none", padding: 0 }}
                                        >
                                            <span
                                                className={[
                                                    "flex items-center justify-center transition-all duration-150",
                                                    status === "recording"
                                                        ? "w-10 h-10 rounded-full border-2 border-red-600"
                                                        : "w-12 h-12 rounded-full border-2 border-white"
                                                ].join(" ")}
                                            >
                                                <span
                                                    className={[
                                                        "transition-all duration-150",
                                                        status === "recording"
                                                            ? "w-3 h-3 bg-white rounded-[3px]"        // kotak kecil putih
                                                            : "w-3.5 h-3.5 bg-red-600 rounded-full"   // lingkaran merah
                                                    ].join(" ")}
                                                />
                                            </span>
                                        </button>
                                    </div>

                                    {/* Timer (kiri-bawah) */}
                                    {status === "recording" && (
                                        <div className="absolute left-3 bottom-3 text-white/90 font-semibold">
                                            {formatTime(sec)} / 03:00
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}



                        {status === "preview" && (
                            <video
                                controls
                                src={blobURL}
                                className="block w-full h-[300px] object-contain bg-black"
                            />
                        )}
                    </div>
                </div>

                {/* Actions bawah video (preview only) */}
                {status === "preview" && (
                    <div className="mt-4 mx-auto flex items-center gap-3">
                        <Button onClick={retake} className="rf-btn-default">Retake</Button>
                        <Button type="primary" className="rf-btn-primary" onClick={submitVideo}>
                            Submit
                        </Button>
                    </div>
                )}

                {/* (Opsional) Instruction ringkes */}
                <div className="mx-auto mt-6 w-full max-w-3xl">
                    <div className="font-semibold text-gray-800 mb-3">Tips:</div>
                    <ol className="space-y-2 text-sm text-gray-700">
                        <li>• Keep your video between 1–3 minutes</li>
                        <li>• Ensure good lighting and clear audio</li>
                        <li>• Briefly introduce yourself and your background</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
