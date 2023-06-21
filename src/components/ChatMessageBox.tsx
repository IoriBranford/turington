import { Inter } from "next/font/google";
import { useEffect, useRef } from "react";

const inter = Inter({ subsets: ['latin'] })

export default function ChatMessageBox({ content = "", fontClass = inter.className }) {
  const self = useRef<HTMLDivElement>(null!);
  useEffect(() => {
    self.current.scrollTop = self.current.scrollHeight
  }, [content])
  return (
    <div ref={self} className="fixed top-0 w-full max-w-xl h-1/3 overflow-y-scroll p-2 mt-8 border border-gray-300 rounded shadow-xl bg-white bg-opacity-75">
      <div className={fontClass}>{content}</div>
    </div>
  );
}
