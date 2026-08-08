import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "智汇云 - 账号管理后台",
    description: "account 后台 key 管理原型预览",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="zh-CN">
            <body>{children}</body>
        </html>
    );
}
