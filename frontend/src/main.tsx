import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface RootErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class RootErrorBoundary extends React.Component<{ children: React.ReactNode }, RootErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): RootErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("RootErrorBoundary caught global error:", error, errorInfo);
  }

  handleReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-2xl space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-2xl">
              🏛️
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-white">Shekhar Finance Portal</h2>
              <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                पोर्टल ऑटो-रिकवरी सिस्टम (Auto Recovery Active)
              </p>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              पेज लोड करने में एक अस्थायी त्रुटि आई है। नीचे दिए गए बटन पर क्लिक करके पोर्टल को रिफ्रेश करें।
            </p>
            <div className="p-3 rounded-xl bg-slate-800 text-[11px] text-slate-400 font-mono text-left overflow-x-auto max-h-24">
              {this.state.error?.message || 'Unknown Render Notice'}
            </div>
            <button
              onClick={this.handleReload}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition-all"
            >
              🔄 पोर्टल पुनः लोड करें (Reload & Recover Portal)
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>,
);

