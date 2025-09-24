import React, { useRef } from 'react';

interface HeaderProps {
  onSave: () => void;
  onLoad: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExportJPG: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  appMode: 'view' | 'edit';
  onEnterEditMode: () => void;
  onExitEditMode: () => void;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  lastSavedAt: number | null;
  isLoading: boolean;
}

const Header: React.FC<HeaderProps> = ({ onSave, onLoad, onExportJPG, onUndo, onRedo, canUndo, canRedo, appMode, onEnterEditMode, onExitEditMode, saveStatus, lastSavedAt, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const saveDisabled = isLoading || appMode === 'view' || saveStatus === 'saving';

  const statusText = (() => {
    if (isLoading) {
      return 'Loading diagram...';
    }
    switch (saveStatus) {
      case 'saving':
        return 'Saving changes...';
      case 'error':
        return 'Save failed. Retry soon.';
      case 'saved':
        if (lastSavedAt) {
          return `Saved ${new Date(lastSavedAt).toLocaleTimeString()}`;
        }
        return 'Saved';
      default:
        if (lastSavedAt) {
          return `Last saved ${new Date(lastSavedAt).toLocaleTimeString()}`;
        }
        return 'Autosave ready in edit mode';
    }
  })();

  const statusClass = saveStatus === 'error'
    ? 'text-red-400'
    : saveStatus === 'saving'
      ? 'text-sky-400'
      : 'text-gray-400';

  return (
    <header className="relative text-center p-6 border-b border-white/10">
      <div className="absolute top-1/2 -translate-y-1/2 left-6 flex items-center gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo || appMode === 'view' || isLoading}
          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:enabled:bg-white/10 text-gray-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          title="Undo (Ctrl+Z)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 9l-3 3m0 0l3 3m-3-3h8a5 5 0 005-5V7" />
          </svg>
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo || appMode === 'view' || isLoading}
          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:enabled:bg-white/10 text-gray-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          title="Redo (Ctrl+Y)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 15l3-3m0 0l-3-3m3 3H8a5 5 0 00-5 5v2" />
          </svg>
        </button>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500 tracking-tight">
        Single-Line Diagram Builder
      </h1>
      <p className="text-gray-400 mt-2 text-base">
        Facility Dept. Seagate Teparuk
      </p>
      <div className="absolute top-1/2 -translate-y-1/2 right-6 flex flex-col items-end gap-2">
        <span className={`text-xs ${statusClass}`}>{statusText}</span>
        <div className="flex gap-3">
          {appMode === 'view' ? (
              <button 
                onClick={onEnterEditMode}
                disabled={isLoading}
                className="bg-green-600 hover:enabled:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg transition-all text-sm shadow-md shadow-green-600/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Enter Edit Mode
              </button>
          ) : (
              <button 
                onClick={onExitEditMode}
                disabled={isLoading}
                className="bg-yellow-500 hover:enabled:bg-yellow-400 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-all text-sm shadow-md shadow-yellow-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Exit Edit Mode
              </button>
          )}
          <button 
            onClick={onExportJPG}
            disabled={isLoading}
            className="bg-white/5 border border-white/10 hover:enabled:bg-white/10 text-gray-200 font-semibold py-2 px-4 rounded-lg transition-all text-sm shadow disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Export JPG
          </button>
          <button 
            onClick={onSave}
            disabled={saveDisabled}
            className="bg-white/5 border border-white/10 hover:enabled:bg-white/10 text-gray-200 font-semibold py-2 px-4 rounded-lg transition-all text-sm shadow disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save
          </button>
          <button 
            onClick={handleLoadClick}
            disabled={isLoading}
            className="bg-sky-600 hover:enabled:bg-sky-500 text-white font-semibold py-2 px-4 rounded-lg transition-all text-sm shadow-md shadow-sky-600/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Load
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={onLoad} 
            className="hidden" 
            accept=".json" 
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
