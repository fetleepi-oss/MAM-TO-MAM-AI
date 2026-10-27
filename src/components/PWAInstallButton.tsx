import React, { useState } from 'react';
import { Download, Smartphone, Check, HelpCircle } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showDesktopGuide, setShowDesktopGuide] = useState(false);

  // If already running as an installed PWA, show clean badge
  if (isInstalled) {
    return (
      <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
        <Check className="w-3.5 h-3.5" />
        <span>Installed PWA</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow with beforeinstallprompt ready
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 bg-[#F59E0B] hover:bg-amber-400 text-[#1F3B8C] font-extrabold px-2.5 py-1.5 rounded-xl text-xs shadow-md transition-all cursor-pointer min-h-[36px]"
        aria-label="Install App for Offline Use"
      >
        <Download className="w-3.5 h-3.5 shrink-0" />
        <span className="hidden sm:inline">Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 bg-[#152861] hover:bg-[#11204d] border border-blue-400/30 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-blue-100 transition-colors cursor-pointer min-h-[36px]"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span className="hidden sm:inline">Install iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-stone-200 text-stone-900">
              <h3 className="text-base font-extrabold text-[#1F3B8C] flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#F59E0B]" />
                Install MAM AI on iPhone / iPad
              </h3>
              <p className="mt-2.5 text-xs text-stone-600 leading-relaxed">
                1. Tap the <strong>Share</strong> button (box with upward arrow) in the Safari toolbar.<br />
                2. Scroll down and tap <strong>Add to Home Screen</strong>.<br />
                3. MAM AI will launch full-screen and work 100% offline with zero data usage.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-[#1F3B8C] text-white py-2 text-xs font-extrabold hover:bg-[#182E6E] cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback for Desktop/Android before ambient prompt triggers
  return (
    <>
      <button
        onClick={() => setShowDesktopGuide(true)}
        className="flex items-center gap-1.5 bg-[#152861] hover:bg-[#11204d] border border-blue-400/30 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-blue-100 transition-colors cursor-pointer min-h-[36px]"
        title="Install MAM AI Progressive Web App on your phone or desktop"
      >
        <Download className="w-3.5 h-3.5 text-[#F59E0B]" />
        <span className="hidden sm:inline">Install App</span>
      </button>

      {showDesktopGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-stone-200 text-stone-900">
            <h3 className="text-base font-extrabold text-[#1F3B8C] flex items-center gap-2">
              <Download className="w-5 h-5 text-[#F59E0B]" />
              Install MAM AI (PWA)
            </h3>
            <p className="mt-2.5 text-xs text-stone-600 leading-relaxed">
              MAM-to-MAM AI can be installed directly to your device for instant offline access:
            </p>
            <ul className="mt-2 text-xs text-stone-700 space-y-1 list-disc list-inside">
              <li><strong>Chrome / Edge (Desktop):</strong> Click the <strong>Install</strong> icon in the address bar (top right).</li>
              <li><strong>Android:</strong> Tap the browser menu (⋮) and choose <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
              <li><strong>iPhone (Safari):</strong> Tap <strong>Share</strong> → <strong>"Add to Home Screen"</strong>.</li>
            </ul>
            <p className="mt-2.5 text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
              Once installed, all health guides, danger-sign checks, and triage questionnaires will work with zero mobile data.
            </p>
            <button
              onClick={() => setShowDesktopGuide(false)}
              className="mt-4 w-full rounded-xl bg-[#1F3B8C] text-white py-2 text-xs font-extrabold hover:bg-[#182E6E] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
