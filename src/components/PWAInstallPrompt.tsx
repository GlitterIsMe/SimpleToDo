import { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [platform, setPlatform] = useState<'desktop' | 'mobile' | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Detect platform
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    setPlatform(isMobile ? 'mobile' : 'desktop');

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed (for iOS)
    if (isMobile && 'standalone' in window.navigator) {
      if (window.navigator.standalone === true) {
        setShowPrompt(false);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('PWA installed');
      }
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          {platform === 'mobile' ? (
            <Smartphone className="h-5 w-5 text-blue-600" />
          ) : (
            <Monitor className="h-5 w-5 text-blue-600" />
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 text-sm">安装应用到{platform === 'mobile' ? '手机' : '电脑'}</h4>
          <p className="text-xs text-gray-500 mt-1">
            获得更好的使用体验，支持离线使用和推送通知
          </p>
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              className="flex-1 h-8 text-xs"
              onClick={handleInstallClick}
            >
              <Download className="h-3 w-3 mr-1" />
              安装
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-xs"
              onClick={handleClose}
            >
              稍后
            </Button>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
