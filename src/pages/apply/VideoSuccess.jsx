import { Typography, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectApp } from "../../store";
import { getInitials } from "../../utils/name";
import logo from "../../assets/logo-blockforgex.png";
import useIsDesktop from "../../hooks/useIsDesktop";
import { CheckListIcon } from "hugeicons-react";
import { CheckOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function VideoSuccess() {
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
                                <Text className="!text-[#4F46E5]">{fullName}</Text>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-4 flex flex-col items-center gap-y-2 mt-8">

                    <div className="w-full flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center text-white text-5xl mb-6">
                            <CheckOutlined />
                        </div>
                        <Title level={1} className="!text-[20px] lg:!text-4xl !leading-[1.2] !mb-1">
                            Application Submitted Successfully
                        </Title>
                        <Text type="secondary" className="!text-sm lg:!text-base">
                            Thank you for completing your introduction.
                        </Text>
                    </div>

                    <div className="hidden lg:block" />
                </div>

                <div className="flex-1 flex flex-col items-center justify-center">

                    <div className="w-full max-w-xl">
                        <div className="text-indigo-600 font-semibold text-center mb-4">Your Vetting Process</div>
                        <ul className="space-y-6">
                            <li className="flex gap-3 items-start">
                                <span className="mt-1 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">✓</span>
                                <div>
                                    <div className="font-semibold">Applied</div>
                                    <div className="text-gray-500 text-sm">Your application has been received successfully.</div>
                                </div>
                            </li>
                            <li className="flex gap-3 items-start opacity-90">
                                <span className="mt-1 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">⋯</span>
                                <div>
                                    <div className="font-semibold">Under Review</div>
                                    <div className="text-gray-500 text-sm">Our team will carefully review your application. You'll receive an update soon.</div>
                                </div>
                            </li>
                            <li className="flex gap-3 items-start opacity-60">
                                <span className="mt-1 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center"></span>
                                <div>
                                    <div className="font-semibold">Final Interview</div>
                                    <div className="text-gray-500 text-sm">If shortlisted, you'll be invited to a virtual interview.</div>
                                </div>
                            </li>
                            <li className="flex gap-3 items-start opacity-60">
                                <span className="mt-1 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center"></span>
                                <div>
                                    <div className="font-semibold">Join Blockforgex</div>
                                    <div className="text-gray-500 text-sm">Once approved, you'll be matched with suitable opportunities.</div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="mt-8 w-full max-w-3xl bg-gray-50 rounded-2xl p-6">
                        <div className="font-semibold mb-2">About Our Company</div>
                        <p className="text-gray-600">
                            We're a forward-thinking technology company specializing in blockchain solutions. Our team is dedicated to pushing the boundaries of what's possible in the decentralized world.
                        </p>
                        <p className="text-gray-600 mt-3">
                            As a member of our team, you'll have the opportunity to work on cutting-edge projects, collaborate with talented developers worldwide, and contribute to the future of blockchain technology.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
