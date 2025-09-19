import React, { useState, useRef, useEffect } from 'react';
import Spinner from './Spinner';

interface DeviceFrameProps {
  url: string;
}

const DeviceFrame: React.FC<DeviceFrameProps> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!frameRef.current) return;

    if (!isFullscreen) {
      frameRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div 
        ref={frameRef} 
        className="w-full max-w-sm md:max-w-md lg:max-w-lg h-[75vh] md:h-[80vh] max-h-[900px] bg-black rounded-[40px] p-3 shadow-2xl border-4 border-gray-800 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-500/10 
                   fullscreen:max-w-none fullscreen:max-h-none fullscreen:w-screen fullscreen:h-screen fullscreen:p-0 fullscreen:border-0 fullscreen:rounded-none"
    >
      <div className="w-full h-full bg-gray-900 rounded-[28px] overflow-hidden relative flex items-center justify-center fullscreen:rounded-none">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20">
            <Spinner />
            <p className="text-white mt-4 text-sm font-mono tracking-widest">Tuning in...</p>
          </div>
        )}
        <iframe
          src={url}
          title="Live TV Global & Local Viewer"
          className={`w-full h-full transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        ></iframe>
         <button
          onClick={toggleFullscreen}
          className="absolute bottom-4 right-4 z-30 p-2 bg-black/50 rounded-full text-white hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black transition-opacity opacity-50 hover:opacity-100"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? (
            // Exit fullscreen icon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 4H4v4m4 12H4v-4m12 4h4v-4m-4-12h4v4" />
            </svg>
          ) : (
            // Enter fullscreen icon
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4h4m12 4V4h-4M4 16v4h4m12-4v4h-4" />
             </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default DeviceFrame;
