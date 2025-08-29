import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Typography, Avatar, message } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectApp } from "../../store";
import { getInitials } from "../../utils/name";
import logo from "../../assets/logo-blockforgex.png";
import { CameraOutlined, ReloadOutlined, CloseCircleOutlined, VideoCameraOutlined, StopOutlined } from "@ant-design/icons";
import useIsDesktop  from "../../hooks/useIsDesktop";
const { Title, Text } = Typography;
const MAX_SECONDS = 180;

export default function VideoRecord() {
    const isDesktop = useIsDesktop()
    const { fullName } = useSelector(selectApp);
    const initials = getInitials(fullName);
    const navigate = useNavigate();

    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const recorderRef = useRef(null);
    const chunksRef = useRef([]);

    const [status, setStatus] = useState("init");
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
    }, []);

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
        navigate("/apply/video/success");
    };

    const formatTime = (s) =>
        `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

    return (
        <div className="h-dvh w-full gap-0 p-5 lg:p-10">
            <div className="max-w-6xl mx-auto h-full flex flex-col">
                <div className="flex items-center justify-between">
                    <img src={logo} alt="Blockforgex" className="h-[64px] w-auto" />
                    {fullName && (
                        <div className="flex items-center gap-2">
                            <Avatar
                                size={34}
                                className="text-white"
                                style={{
                                    background:
                                        "radial-gradient(86% 86% at 50% 14%, #837CFF 0%, #4F46E5 100%)",
                                    fontWeight: 600,
                                }}
                            >
                                {initials}
                            </Avatar>
                            {isDesktop && (
                                <Text className="text-gray-700">{fullName}</Text>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-y-2 mt-8">
                    <a
                        onClick={() => navigate(-1)}
                        className="justify-self-start text-indigo-600 cursor-pointer self-start"
                    >
                        ← Back
                    </a>

                    <div className="justify-self-center text-center">
                        <Title
                            level={1}
                            className="!text-[20px] lg:!text-4xl !leading-[1.2] !mb-1"
                        >
                            Share Your Story & Achievements
                        </Title>
                        <Text type="secondary">
                            Record a short video introduction to complete your application.
                        </Text>
                    </div>

                    <div className="hidden lg:block" />
                </div>


                <div className="mt-8 mx-auto w-full max-w-2xl rounded-2xl shadow-sm bg-black relative">
                    <div className="overflow-hidden rounded-2xl">
                        {status === "error" && (
                            <div className="h-[300px] flex flex-col items-center justify-center text-white px-2.5">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#FB2626] mb-3">
                                <VideoCameraOutlined style={{ position: 'absolute' }} />
                                <StopOutlined style={{ position: 'absolute', color: 'white', fontSize: '30px' }} />
                                </div>
                                <div className="text-lg font-semibold">Camera not Ready!!</div>
                                <p className="text-gray-300 text-sm mt-1 text-center !text-[12px] !lg:text-[14px]">
                                    Please check permissions, connection, or device availability.
                                </p>
                                <Button
                                    type="primary"
                                    className="!text-[12px] !lg:text-[14px] !bg-[#4F46E5] mt-3 !px-3 !py-2 h-8"
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
                                <video
                                    ref={videoRef}
                                    className="block w-full h-full object-contain bg-black"
                                />

                                <div className="absolute inset-0 z-20 pointer-events-none">
                                    {devices.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={switchCamera}
                                            onMouseDown={(e) => e.preventDefault()}
                                            className="pointer-events-auto absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center
                                                   focus:outline-none focus:ring-0 focus-visible:outline-none"
                                            style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
                                            title="Switch camera"
                                        >
                                            <ReloadOutlined />
                                        </button>

                                    )}

                                    <div className="absolute left-1/2 -translate-x-1/2 bottom-3">
                                        <button
                                            type="button"
                                            onClick={status === "recording" ? stopRecording : startRecording}
                                            className="pointer-events-auto"
                                            aria-label={status === "recording" ? "Stop recording" : "Start recording"}
                                            onMouseDown={(e) => e.preventDefault()}

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
                                                            ? "w-3 h-3 bg-white rounded-[3px]"        
                                                            : "w-3.5 h-3.5 bg-red-600 rounded-full"   
                                                    ].join(" ")}
                                                />
                                            </span>
                                        </button>
                                    </div>

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

                {status === "preview" && (
                    <div className="mt-4 mx-auto flex items-center gap-3">
                        <Button onClick={retake} className="rf-btn-default">Retake</Button>
                        <Button type="primary" className="rf-btn-primary" onClick={submitVideo}>
                            Submit
                        </Button>
                    </div>
                )}

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
