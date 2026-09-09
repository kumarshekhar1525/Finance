import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Fingerprint, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw, 
  AlertCircle,
  Scan,
  Check,
  Upload
} from 'lucide-react';
import { BiometricRecord } from '../types';

interface BiometricModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (biometric: BiometricRecord, photoBase64?: string) => void;
}

export const BiometricVerificationModal: React.FC<BiometricModalProps> = ({
  isOpen,
  onClose,
  onVerified,
}) => {
  const [authMode, setAuthMode] = useState<'face' | 'fingerprint'>('face');
  const [cameraActive, setCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDone, setIsDone] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen && authMode === 'face' && !capturedPhoto) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, authMode]);

  const startCamera = async () => {
    try {
      setErrorMsg('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraActive(false);
      setErrorMsg('Camera permission not granted or device camera busy. You can use photo upload or fingerprint mode.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleCaptureFace = () => {
    if (!videoRef.current) return;
    setIsScanning(true);

    // Create canvas capture
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedPhoto(dataUrl);
    }

    stopCamera();

    // Simulate AI Facial Liveness Match
    setTimeout(() => {
      setIsScanning(false);
      const score = Math.floor(95 + Math.random() * 4) + 0.5; // 95.5% - 99.5%
      setMatchScore(score);
      setIsDone(true);

      const record: BiometricRecord = {
        isVerified: true,
        type: 'face',
        verifiedAt: new Date().toISOString(),
        faceMatchScore: score,
        token: `BIO-FACE-SHA256-${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
        deviceInfo: navigator.userAgent.slice(0, 40),
      };

      setTimeout(() => {
        onVerified(record, capturedPhoto || undefined);
        onClose();
      }, 1400);
    }, 1200);
  };

  const handleFingerprintScan = () => {
    setIsScanning(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsScanning(false);
      setIsDone(true);

      const record: BiometricRecord = {
        isVerified: true,
        type: 'fingerprint',
        verifiedAt: new Date().toISOString(),
        token: `BIO-FP-UIDAI-${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
        deviceInfo: 'UIDAI Registered Biometric Scanner Level-0',
      };

      setTimeout(() => {
        onVerified(record);
        onClose();
      }, 1200);
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setCapturedPhoto(dataUrl);
        setIsScanning(true);

        setTimeout(() => {
          setIsScanning(false);
          const score = 98.2;
          setMatchScore(score);
          setIsDone(true);

          const record: BiometricRecord = {
            isVerified: true,
            type: 'face',
            verifiedAt: new Date().toISOString(),
            faceMatchScore: score,
            token: `BIO-FILE-SHA256-${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
          };

          setTimeout(() => {
            onVerified(record, dataUrl);
            onClose();
          }, 1400);
        }, 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        id="biometric-modal"
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-600 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
              <Scan className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-base font-bold">Biometric e-KYC Verification</h3>
              <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Live Facial Match / UIDAI L1 Sensor
              </p>
            </div>
          </div>
          <button
            id="close-biometric-modal-btn"
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Mode Selector */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 p-2 gap-2 bg-slate-50 dark:bg-slate-800/40">
          <button
            id="biometric-mode-face"
            type="button"
            onClick={() => {
              setAuthMode('face');
              setCapturedPhoto(null);
            }}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              authMode === 'face'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            Face Biometric & Liveness
          </button>

          <button
            id="biometric-mode-fp"
            type="button"
            onClick={() => {
              stopCamera();
              setAuthMode('fingerprint');
            }}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              authMode === 'fingerprint'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Fingerprint className="w-4 h-4" />
            Fingerprint Sensor Scan
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-4">
          {authMode === 'face' ? (
            <div className="space-y-4 text-center">
              <div className="relative w-72 h-72 mx-auto rounded-2xl overflow-hidden bg-slate-950 border-2 border-dashed border-emerald-500 flex items-center justify-center shadow-inner">
                {capturedPhoto ? (
                  <img
                    src={capturedPhoto}
                    alt="Captured Applicant"
                    className="w-full h-full object-cover"
                  />
                ) : cameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                ) : (
                  <div className="p-6 text-center space-y-3">
                    <Camera className="w-12 h-12 text-slate-500 mx-auto" />
                    <p className="text-xs text-slate-400">
                      Camera inactive. Click button below to start camera or upload applicant photo.
                    </p>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                    >
                      Start Camera
                    </button>
                  </div>
                )}

                {/* Facial Oval Target Overlay */}
                {!capturedPhoto && cameraActive && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-44 h-56 rounded-full border-2 border-emerald-400/80 ring-4 ring-emerald-500/20 animate-pulse"></div>
                    <div className="absolute top-3 bg-black/60 px-3 py-1 rounded-full text-[10px] text-emerald-300 font-mono">
                      Align Face in Oval
                    </div>
                  </div>
                )}

                {isScanning && (
                  <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2">
                    <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
                    <p className="text-xs font-bold">Scanning Face Liveness & Aadhaar Match...</p>
                  </div>
                )}
              </div>

              {matchScore && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Facial Liveness Verified
                  </span>
                  <span className="bg-emerald-200 dark:bg-emerald-900 px-2 py-0.5 rounded text-emerald-900 dark:text-emerald-100">
                    Match: {matchScore}%
                  </span>
                </div>
              )}

              {errorMsg && (
                <p className="text-xs text-amber-600 dark:text-amber-400">{errorMsg}</p>
              )}

              <div className="flex items-center gap-3">
                {cameraActive && !capturedPhoto && (
                  <button
                    id="capture-face-btn"
                    type="button"
                    onClick={handleCaptureFace}
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Capture & Verify Face
                  </button>
                )}

                <label className="flex-1 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-xs text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-center py-4">
              <div className="relative w-36 h-36 mx-auto rounded-3xl bg-slate-100 dark:bg-slate-800 border-2 border-emerald-500/40 flex items-center justify-center">
                <Fingerprint 
                  className={`w-20 h-20 text-emerald-600 dark:text-emerald-400 ${
                    isScanning ? 'animate-pulse scale-110' : ''
                  } transition-all`} 
                />
                {isScanning && (
                  <div className="absolute inset-0 rounded-3xl ring-4 ring-emerald-500 animate-ping opacity-25" />
                )}
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  UIDAI Registered Biometric Scanner
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  Place applicant thumb or index finger on the biometric scanner device for digital signature.
                </p>
              </div>

              {isDone ? (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Biometric Token Generated Successfully
                </div>
              ) : (
                <button
                  id="start-fingerprint-scan-btn"
                  type="button"
                  onClick={handleFingerprintScan}
                  disabled={isScanning}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Reading Sensor Ridges...</span>
                    </>
                  ) : (
                    <>
                      <Fingerprint className="w-4 h-4" />
                      <span>Scan Fingerprint / बायोमेट्रिक फिंगरप्रिंट स्कैन</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
