import Image, { ImageProps } from "next/image";

import Link from "next/link";
import React from "react";
import { clientConfig } from "@/lib/config/client-config";

export default function Logo({
  width = 40,
  height = 40,
}: Pick<ImageProps, "width" | "height">) {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Image
        src="/mini-logo.png"
        alt={clientConfig.app.name}
        width={width}
        height={height}
        className="animate-pulse"
        style={{
          animation: "heartbeat 1.8s ease-in-out infinite",
        }}
        priority
      />
      <span className="hidden font-bold sm:inline-block">
        {clientConfig.app.name}
      </span>
    </Link>
  );
}
