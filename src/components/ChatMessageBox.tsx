import { Inter } from "next/font/google";
import { useEffect, useRef, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function ChatMessageBox({
  content = "",
  fontClass = inter.className,
  hidden = false,
  loading = false
}) {
  const self = useRef<HTMLDivElement>(null!);
  const [loadingDots, setLoadingDots] = useState('')

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingDots('.'.repeat(((loadingDots.length+1) % 3) + 1))
      }, 250)
      return () => clearInterval(interval);
    } else if (loadingDots.length > 0) {
      setLoadingDots('')
    }
  }, [loading, loadingDots])

  useEffect(() => {
    self.current.scrollTop = self.current.scrollHeight;
  }, [content]);

  return (
    <div
      ref={self}
      hidden={hidden}
      className="fixed top-0 w-full max-w-xl h-1/3 overflow-y-scroll p-2 mt-8 border border-gray-300 rounded shadow-xl bg-white bg-opacity-75"
    >
      <div className={fontClass}>{content} {loadingDots}</div>
    </div>
  );
}
