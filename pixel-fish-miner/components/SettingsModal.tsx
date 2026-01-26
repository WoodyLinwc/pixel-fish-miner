import React, { useState } from "react";
import { Language } from "../types";
import { TRANSLATIONS } from "../locales/translations";
import { X, Music, Volume2, Globe, Download, Upload } from "lucide-react";
import { audioManager } from "../utils/audioManager";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMusicOn: boolean;
  onToggleMusic: () => void;
  isSoundEffectsOn: boolean;
  onToggleSoundEffects: () => void;
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  onExportSave: () => void;
  onImportSave: (encryptedData: string) => boolean;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isMusicOn,
  onToggleMusic,
  isSoundEffectsOn,
  onToggleSoundEffects,
  language,
  onChangeLanguage,
  onExportSave,
  onImportSave,
}) => {
  const [importFeedback, setImportFeedback] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const t = TRANSLATIONS[language];

  const handleClose = () => {
    audioManager.playButtonSound();
    onClose();
  };

  const handleMusicToggle = () => {
    audioManager.playButtonSound();
    onToggleMusic();
  };

  const handleSfxToggle = () => {
    audioManager.playButtonSound();
    onToggleSoundEffects();
  };

  const handleLanguageChange = (lang: Language) => {
    audioManager.playButtonSound();
    onChangeLanguage(lang);
  };

  const handleExport = () => {
    audioManager.playButtonSound();
    onExportSave();
    setImportFeedback({
      success: true,
      message: t.exportSuccess || "Save file downloaded!",
    });
    setTimeout(() => setImportFeedback(null), 3000);
  };

  const handleImport = () => {
    audioManager.playButtonSound();
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".fishsave";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const success = onImportSave(text);

        if (success) {
          setImportFeedback({
            success: true,
            message:
              t.importSuccess || "Save loaded successfully! Reloading...",
          });
          // Reload page after 1 second to apply changes
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          setImportFeedback({
            success: false,
            message: t.importError || "Invalid or corrupted save file!",
          });
          setTimeout(() => setImportFeedback(null), 3000);
        }
      } catch (error) {
        setImportFeedback({
          success: false,
          message: t.importError || "Failed to read save file!",
        });
        setTimeout(() => setImportFeedback(null), 3000);
      }
    };
    input.click();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-2 md:p-4">
      {/* Wood Frame */}
      <div className="bg-[#e6c288] border-[6px] border-[#8d5524] rounded-lg w-full max-w-md shadow-[0_10px_20px_rgba(0,0,0,0.5)] relative animate-fade-in p-1 max-h-[75vh] md:max-h-[80vh] flex flex-col">
        {/* Inner Border */}
        <div className="border-2 border-[#c68c53] p-2 md:p-4 rounded bg-[#e6c288] flex flex-col overflow-hidden h-full">
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 bg-[#d32f2f] text-white hover:bg-[#b71c1c] border-2 border-[#801313] rounded p-1 shadow-md active:translate-y-1 z-10"
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl text-[#5d4037] mb-2 text-center uppercase tracking-widest drop-shadow-sm font-bold">
            {t.settings}
          </h2>

          {/* Settings Options - Scrollable */}
          <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
            {/* Background Music */}
            <div className="bg-[#fff3e0] p-2 md:p-2 md:p-3 rounded border-2 border-[#a1887f] shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Music size={24} className="text-[#5d4037]" />
                  <div>
                    <h3 className="text-sm font-bold text-[#3e2723]">
                      {t.backgroundMusic}
                    </h3>
                    <p className="text-[10px] text-[#6d4c41]">
                      {t.backgroundMusicDesc}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleMusicToggle}
                  className={`px-4 py-2 rounded font-bold text-xs border-b-4 active:border-b-0 active:translate-y-1 transition-all ${
                    isMusicOn
                      ? "bg-[#66bb6a] border-[#2e7d32] text-white"
                      : "bg-[#cfd8dc] border-[#90a4ae] text-[#5d4037]"
                  }`}
                >
                  {isMusicOn ? t.on : t.off}
                </button>
              </div>
            </div>

            {/* Sound Effects */}
            <div className="bg-[#fff3e0] p-2 md:p-3 rounded border-2 border-[#a1887f] shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 size={24} className="text-[#5d4037]" />
                  <div>
                    <h3 className="text-sm font-bold text-[#3e2723]">
                      {t.soundEffects}
                    </h3>
                    <p className="text-[10px] text-[#6d4c41]">
                      {t.soundEffectsDesc}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSfxToggle}
                  className={`px-4 py-2 rounded font-bold text-xs border-b-4 active:border-b-0 active:translate-y-1 transition-all ${
                    isSoundEffectsOn
                      ? "bg-[#66bb6a] border-[#2e7d32] text-white"
                      : "bg-[#cfd8dc] border-[#90a4ae] text-[#5d4037]"
                  }`}
                >
                  {isSoundEffectsOn ? t.on : t.off}
                </button>
              </div>
            </div>

            {/* Language */}
            <div className="bg-[#fff3e0] p-2 md:p-3 rounded border-2 border-[#a1887f] shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe size={24} className="text-[#5d4037]" />
                  <div>
                    <h3 className="text-sm font-bold text-[#3e2723]">
                      {t.language}
                    </h3>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleLanguageChange("en")}
                    className={`px-3 py-2 rounded font-bold text-xs border-b-4 active:border-b-0 active:translate-y-1 transition-all ${
                      language === "en"
                        ? "bg-[#66bb6a] border-[#2e7d32] text-white"
                        : "bg-[#cfd8dc] border-[#90a4ae] text-[#5d4037]"
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => handleLanguageChange("es")}
                    className={`px-3 py-2 rounded font-bold text-xs border-b-4 active:border-b-0 active:translate-y-1 transition-all ${
                      language === "es"
                        ? "bg-[#66bb6a] border-[#2e7d32] text-white"
                        : "bg-[#cfd8dc] border-[#90a4ae] text-[#5d4037]"
                    }`}
                  >
                    ES
                  </button>
                  <button
                    onClick={() => handleLanguageChange("zh")}
                    className={`px-3 py-2 rounded font-bold text-xs border-b-4 active:border-b-0 active:translate-y-1 transition-all ${
                      language === "zh"
                        ? "bg-[#66bb6a] border-[#2e7d32] text-white"
                        : "bg-[#cfd8dc] border-[#90a4ae] text-[#5d4037]"
                    }`}
                  >
                    中文
                  </button>
                </div>
              </div>
            </div>

            {/* Import/Export Save */}
            <div className="bg-[#fff3e0] p-2 md:p-3 rounded border-2 border-[#a1887f] shadow-sm">
              <h3 className="text-sm font-bold text-[#3e2723] mb-2">
                {t.saveData || "Save Data"}
              </h3>
              <p className="text-[10px] text-[#6d4c41] mb-3">
                {t.saveDataDesc ||
                  "Download or upload your encrypted game progress"}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleExport}
                  className="flex-1 bg-[#42a5f5] border-[#1976d2] text-white hover:bg-[#1e88e5] px-3 py-2 rounded font-bold text-xs border-b-4 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  <Download size={14} />
                  {t.exportSave || "Export"}
                </button>
                <button
                  onClick={handleImport}
                  className="flex-1 bg-[#66bb6a] border-[#2e7d32] text-white hover:bg-[#4caf50] px-3 py-2 rounded font-bold text-xs border-b-4 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  <Upload size={14} />
                  {t.importSave || "Import"}
                </button>
              </div>
              {importFeedback && (
                <div
                  className={`mt-2 p-2 rounded text-xs font-bold text-center ${
                    importFeedback.success
                      ? "bg-[#c8e6c9] text-[#2e7d32]"
                      : "bg-[#ffcdd2] text-[#c62828]"
                  }`}
                >
                  {importFeedback.message}
                </div>
              )}
            </div>

            {/* Credits */}
            <div className="bg-[#fff3e0] p-2 md:p-3 rounded border-2 border-[#a1887f] shadow-sm">
              <h3 className="text-sm font-bold text-[#3e2723] mb-2 flex items-center gap-2">
                👨‍💻 {t.creator}
              </h3>
              <p className="text-xs text-[#6d4c41] mb-3">Woody Lin / 林万程</p>

              <h3 className="text-sm font-bold text-[#3e2723] mb-2 flex items-center gap-2">
                🛠️ {t.techStack}
              </h3>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-[#6d4c41] mb-3">
                <div>• React 19</div>
                <div>• TypeScript</div>
                <div>• HTML5 Canvas</div>
                <div>• Tailwind CSS</div>
                <div>• Vite</div>
                <div>• Lucide React</div>
              </div>

              <h3 className="text-sm font-bold text-[#3e2723] mb-1 flex items-center gap-2">
                🎵 {t.music}
              </h3>
              <p className="text-[10px] text-[#6d4c41] mb-2">
                Background music by leohpaz (CC-BY 4.0 & 3.0, OpenGameArt.org)
              </p>

              <h3 className="text-sm font-bold text-[#3e2723] mb-1 flex items-center gap-2">
                🔊 Sound Effects
              </h3>
              <p className="text-[10px] text-[#6d4c41]">
                CC0 Public Domain (OpenGameArt.org & Freesound.org)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
