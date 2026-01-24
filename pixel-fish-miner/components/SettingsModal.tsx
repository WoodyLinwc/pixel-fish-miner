import React from "react";
import { X, Music, Volume2, Globe, Award } from "lucide-react";
import { Language } from "../types";
import { TRANSLATIONS } from "../locales/translations";
import { audioManager } from "../utils/audioManager";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isMusicOn: boolean;
  toggleMusic: () => void;
  isSoundEffectsOn: boolean;
  toggleSoundEffects: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  language,
  setLanguage,
  isMusicOn,
  toggleMusic,
  isSoundEffectsOn,
  toggleSoundEffects,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[language];

  const handleClose = () => {
    audioManager.playButtonSound();
    onClose();
  };

  const handleLanguageChange = (lang: Language) => {
    audioManager.playButtonSound();
    setLanguage(lang);
  };

  const handleToggleMusic = () => {
    audioManager.playButtonSound();
    toggleMusic();
  };

  const handleToggleSoundEffects = () => {
    // Don't play sound when toggling sound effects off
    // (would be confusing to hear a sound when turning sounds off)
    if (isSoundEffectsOn) {
      toggleSoundEffects();
    } else {
      toggleSoundEffects();
      audioManager.playButtonSound();
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-2 md:p-4">
      {/* Wood Frame */}
      <div className="bg-[#e6c288] border-[6px] border-[#8d5524] rounded-lg w-full max-w-md shadow-[0_10px_20px_rgba(0,0,0,0.5)] relative animate-fade-in p-1 max-h-[75vh] md:max-h-[80vh] flex flex-col">
        {/* Inner Border */}
        <div className="border-2 border-[#c68c53] p-3 md:p-4 rounded h-full bg-[#e6c288] flex flex-col overflow-hidden">
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 bg-[#d32f2f] text-white hover:bg-[#b71c1c] border-2 border-[#801313] rounded p-1 shadow-md active:translate-y-1 z-10"
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl text-[#5d4037] mb-4 text-center uppercase tracking-widest flex items-center justify-center gap-3 drop-shadow-sm font-bold shrink-0">
            ⚙️ {t.settings || "Settings"}
          </h2>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {/* Background Music Section */}
            <div className="bg-[#f5deb3] border-2 border-[#c68c53] rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Music size={20} className="text-[#5d4037]" />
                  <h3 className="text-sm font-bold text-[#5d4037] uppercase">
                    {t.backgroundMusic || "Background Music"}
                  </h3>
                </div>
                <button
                  onClick={handleToggleMusic}
                  className={`px-3 py-1 rounded border-2 transition-all shadow-[0_2px_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-1 text-xs font-bold uppercase ${
                    isMusicOn
                      ? "bg-[#81c784] border-[#2e7d32] text-[#1b5e20]"
                      : "bg-[#e0e0e0] border-[#bdbdbd] text-[#757575]"
                  }`}
                >
                  {isMusicOn ? t.on || "ON" : t.off || "OFF"}
                </button>
              </div>
              <p className="text-[10px] text-[#6d4c41] leading-tight">
                {t.backgroundMusicDesc || "Toggle ocean background music"}
              </p>
            </div>

            {/* Sound Effects Section */}
            <div className="bg-[#f5deb3] border-2 border-[#c68c53] rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Volume2 size={20} className="text-[#5d4037]" />
                  <h3 className="text-sm font-bold text-[#5d4037] uppercase">
                    {t.soundEffects || "Sound Effects"}
                  </h3>
                </div>
                <button
                  onClick={handleToggleSoundEffects}
                  className={`px-3 py-1 rounded border-2 transition-all shadow-[0_2px_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-1 text-xs font-bold uppercase ${
                    isSoundEffectsOn
                      ? "bg-[#81c784] border-[#2e7d32] text-[#1b5e20]"
                      : "bg-[#e0e0e0] border-[#bdbdbd] text-[#757575]"
                  }`}
                >
                  {isSoundEffectsOn ? t.on || "ON" : t.off || "OFF"}
                </button>
              </div>
              <p className="text-[10px] text-[#6d4c41] leading-tight">
                {t.soundEffectsDesc ||
                  "Toggle game sound effects (claw, money, etc.)"}
              </p>
            </div>

            {/* Language Section */}
            <div className="bg-[#f5deb3] border-2 border-[#c68c53] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Globe size={20} className="text-[#5d4037]" />
                <h3 className="text-sm font-bold text-[#5d4037] uppercase">
                  {t.language || "Language"}
                </h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleLanguageChange("en")}
                  className={`flex-1 py-2 rounded border-2 transition-all shadow-[0_2px_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-1 text-xs font-bold uppercase ${
                    language === "en"
                      ? "bg-[#81c784] border-[#2e7d32] text-[#1b5e20]"
                      : "bg-[#e0e0e0] border-[#bdbdbd] text-[#757575] hover:bg-[#d6d6d6]"
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageChange("es")}
                  className={`flex-1 py-2 rounded border-2 transition-all shadow-[0_2px_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-1 text-xs font-bold uppercase ${
                    language === "es"
                      ? "bg-[#81c784] border-[#2e7d32] text-[#1b5e20]"
                      : "bg-[#e0e0e0] border-[#bdbdbd] text-[#757575] hover:bg-[#d6d6d6]"
                  }`}
                >
                  Español
                </button>
                <button
                  onClick={() => handleLanguageChange("zh")}
                  className={`flex-1 py-2 rounded border-2 transition-all shadow-[0_2px_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-1 text-xs font-bold uppercase ${
                    language === "zh"
                      ? "bg-[#81c784] border-[#2e7d32] text-[#1b5e20]"
                      : "bg-[#e0e0e0] border-[#bdbdbd] text-[#757575] hover:bg-[#d6d6d6]"
                  }`}
                >
                  中文
                </button>
              </div>
            </div>

            {/* Credits Section */}
            <div className="bg-[#fff8e1] border-2 border-[#c68c53] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Award size={20} className="text-[#5d4037]" />
                <h3 className="text-sm font-bold text-[#5d4037] uppercase">
                  {t.credits || "Credits"}
                </h3>
              </div>
              <div className="space-y-3 text-[10px] text-[#6d4c41] leading-relaxed">
                {/* Creator Section */}
                <div>
                  <p className="font-bold text-[#5d4037] mb-1">
                    👨‍💻 {t.creator || "Creator"}:
                  </p>
                  <p className="ml-2">
                    <span className="font-semibold">Woody Lin 林万程</span>
                  </p>
                </div>

                {/* Tech Stack Section */}
                <div className="border-t border-[#c68c53] pt-2">
                  <p className="font-bold text-[#5d4037] mb-1">
                    🛠️ {t.techStack || "Tech Stack"}:
                  </p>
                  <div className="ml-2 space-y-1">
                    <p>
                      • <span className="font-semibold">React 19</span> - UI
                      Framework
                    </p>
                    <p>
                      • <span className="font-semibold">TypeScript</span> -
                      Language
                    </p>
                    <p>
                      • <span className="font-semibold">HTML5 Canvas</span> -
                      Graphics
                    </p>
                    <p>
                      • <span className="font-semibold">Tailwind CSS</span> -
                      Styling
                    </p>
                    <p>
                      • <span className="font-semibold">Vite</span> - Build Tool
                    </p>
                    <p>
                      • <span className="font-semibold">Lucide React</span> -
                      Icons
                    </p>
                  </div>
                </div>

                {/* Music Section */}
                <div className="border-t border-[#c68c53] pt-2">
                  <p className="font-bold text-[#5d4037] mb-1">
                    🎵 {t.music || "Music"}:
                  </p>
                  <p className="ml-2">
                    <span className="font-semibold">Background Music</span> by{" "}
                    <span className="text-[#d32f2f]">leohpaz</span>
                  </p>
                  <p className="ml-2 text-[9px] text-[#8d6e63]">
                    Licensed under CC-BY 4.0 & CC-BY 3.0
                  </p>
                  <p className="ml-2 text-[9px] text-[#8d6e63]">
                    Source: OpenGameArt.org
                  </p>
                </div>

                {/* Sound Effects Section */}
                <div className="border-t border-[#c68c53] pt-2">
                  <p className="font-bold text-[#5d4037] mb-1">
                    🔊 {t.soundEffects || "Sound Effects"}:
                  </p>
                  <p className="ml-2 text-[9px]">
                    Licensed under CC0 (Public Domain)
                  </p>
                  <p className="ml-2 text-[9px] text-[#8d6e63]">
                    Source: OpenGameArt.org & Freesound.org
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
