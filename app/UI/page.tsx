import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "화면설계 | DDPAY",
  description: "디디페이 APP 화면설계 프로토타입",
};

export default function UIPage() {
  return (
    <iframe
      src="/wireframes/index.html"
      title="DDPAY 화면설계 프로토타입"
      className="fixed inset-0 z-[9999] h-screen w-screen border-0 bg-[#e8ebe9]"
    />
  );
}
