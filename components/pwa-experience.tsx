"use client";

import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";

type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function PwaExperience() {
  const [splash, setSplash] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<InstallPrompt | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const splashTimer = window.setTimeout(() => setSplash(false), 1500);
    const capture = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPrompt);
    };
    const installed = () => setInstallPrompt(null);
    window.addEventListener("beforeinstallprompt", capture);
    window.addEventListener("appinstalled", installed);
    return () => {
      window.clearTimeout(splashTimer);
      window.removeEventListener("beforeinstallprompt", capture);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);

  async function install() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") setInstallPrompt(null);
    else setDismissed(true);
  }

  return <>
    {splash && <div className="pwa-splash" aria-hidden="true"><div className="pwa-splash-ball">★</div><strong>BINGO</strong><em>AO VIVO</em></div>}
    {installPrompt && !dismissed && <aside className="install-pwa"><Download/><span><b>Instale o Bingo ao Vivo</b><small>Acesse como aplicativo, sem a barra do navegador.</small></span><button onClick={install}>Instalar</button><button className="install-close" onClick={() => setDismissed(true)} aria-label="Agora não"><X/></button></aside>}
  </>;
}
