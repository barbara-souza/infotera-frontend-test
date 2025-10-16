"use client";

import Image from "next/image";
import { FiHome, FiLogIn } from "react-icons/fi";

export default function Header() {
  return (
    <header className="py-4 w-full flex justify-center bg-white shadow-sm">
      <div className="flex justify-between items-center w-full max-w-[1700px] px-5">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Logo Infotravel"
            width={101}
            height={26}
            priority
          />
        </div>
        <div className="flex items-center gap-6 text-gray-600 text-sm">
          <a
            href="/"
            className="flex items-center gap-1 hover:text-[#0080FF] transition"
          >
            <FiHome />
            Página Inicial
          </a>
          <button className="flex items-center gap-1 hover:text-[#0080FF] transition">
            <FiLogIn />
            Iniciar Sessão
          </button>
        </div>
      </div>
    </header>
  );
}
