import Image from "next/image";
import { clientConfig } from "@/lib/config/client-config";

export default function SplashScreen() {
  return (
    <>
      <style jsx>{`
        @keyframes heartbeat {
          0% {
            transform: scale(1);
          }
          14% {
            transform: scale(1.1);
          }
          28% {
            transform: scale(1);
          }
          42% {
            transform: scale(1.15);
          }
          70% {
            transform: scale(1);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Cercles d'arrière-plan décoratifs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Logo principal */}
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-black/5 dark:bg-white/5 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl border border-black/10 dark:border-white/10 p-4">
              <Image
                src="/logo.png"
                alt={clientConfig.app.name}
                width={120}
                height={120}
                className="w-full h-full object-contain animate-pulse"
                style={{
                  animation: "heartbeat 1.8s ease-in-out infinite",
                }}
                priority
              />
            </div>
          </div>

          {/* Texte et chargement */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground tracking-wide">
              {clientConfig.app.name}
            </h1>

            <p className="text-muted-foreground text-sm">
              Plateforme anonyme de contenus digitaux
            </p>

            {/* Indicateur de chargement moderne */}
            <div className="flex justify-center mt-6">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
