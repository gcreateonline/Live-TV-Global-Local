import React, { useState, useRef, useEffect } from 'react';
import Spinner from './Spinner';

const channels = [
  { name: 'TV Garden', url: 'https://tv.garden/' },
  { name: 'Pluto TV', url: 'https://pluto.tv/en/live-tv/pluto-tv-news-uk' },
  { name: 'Bloomberg TV', url: 'https://www.bloomberg.com/media-manifest/streams/us.m3u8' }, // Note: May not embed directly
  { name: 'France 24', url: 'https://www.youtube.com/embed/live_stream?channel=UCQfwfsi5VrQ8yKZ-UaQNMAE' },
  { name: 'NASA TV', url: 'https://www.youtube.com/embed/live_stream?channel=UCLA_DiR1FfKNvjuUpBHmylQ' }
];

const DeviceFrame: React.FC = () => {
  const [currentChannelIndex, setCurrentChannelIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  const frameRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const currentChannel = channels[currentChannelIndex];

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setLoadError(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      if (isLoading) {
        setLoadError(true);
        setIsLoading(false);
      }
    }, 10000); // 10-second timeout

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentChannelIndex]);

  const handleIframeLoad = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsLoading(false);
    setLoadError(false);
  };

  const handleChannelSelect = (index: number) => {
    if (index !== currentChannelIndex) {
        setCurrentChannelIndex(index);
    }
    setIsPanelOpen(false);
  };
  
  const toggleFullscreen = () => {
    if (!frameRef.current) return;
    if (!isFullscreen) {
      frameRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div 
        ref={frameRef} 
        id="device-frame-container"
        className="w-full max-w-sm md:max-w-md lg:max-w-lg h-[75vh] md:h-[80vh] max-h-[900px] bg-black rounded-[40px] p-3 shadow-2xl border-4 border-gray-800 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-500/10 
                   fullscreen:max-w-none fullscreen:max-h-none fullscreen:w-screen fullscreen:h-screen fullscreen:p-0 fullscreen:border-0 fullscreen:rounded-none"
    >
      <div className="w-full h-full bg-gray-900 rounded-[28px] overflow-hidden relative flex items-center justify-center fullscreen:rounded-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-7 bg-black rounded-b-xl flex items-center justify-center z-20 fullscreen:hidden">
          <p className="text-white text-xs font-semibold truncate px-2" title={currentChannel.name}>{currentChannel.name}</p>
        </div>
        
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20">
            <Spinner />
            <p className="text-white mt-4 text-sm font-mono tracking-widest">Tuning in...</p>
          </div>
        )}
        
        {loadError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10 p-4">
            <p className="text-red-400 text-center font-semibold">Could not load channel.</p>
            <p className="text-gray-400 text-center text-sm mt-2">The stream may be offline or unavailable. Please try another channel.</p>
          </div>
        )}

        <iframe
          key={currentChannel.url} // Use key to force re-mount on src change
          src={currentChannel.url}
          title="Live TV Global & Local Viewer"
          className={`w-full h-full transition-opacity duration-700 ${isLoading || loadError ? 'opacity-0' : 'opacity-100'}`}
          frameBorder="0"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          onLoad={handleIframeLoad}
        ></iframe>
        
        <div className="absolute bottom-4 left-4 z-30 fullscreen:hidden">
          <button
            onClick={() => setIsPanelOpen(true)}
            className="p-2 bg-black/50 rounded-full text-white hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black transition-opacity opacity-50 hover:opacity-100"
            aria-label="Open channel list"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Panel Backdrop */}
        <div
          className={`absolute inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 fullscreen:hidden ${isPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsPanelOpen(false)}
          aria-hidden="true"
        ></div>

        {/* Channel Panel */}
        <div
          className={`absolute top-0 left-0 bottom-0 z-50 w-2/3 max-w-[250px] bg-gray-900/95 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col fullscreen:hidden ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="channel-list-title"
        >
          <div className="p-4 border-b border-gray-700">
            <h2 id="channel-list-title" className="text-lg font-bold text-white">Channels</h2>
          </div>
          <ul className="flex-1 overflow-y-auto">
            {channels.map((channel, index) => (
              <li key={channel.name}>
                <button
                  onClick={() => handleChannelSelect(index)}
                  className={`w-full text-left p-4 text-sm font-medium transition-colors duration-200 ${
                    index === currentChannelIndex
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {channel.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
         <button
          onClick={toggleFullscreen}
          className="absolute bottom-4 right-4 z-30 p-2 bg-black/50 rounded-full text-white hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black transition-opacity opacity-50 hover:opacity-100"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 4H4v4m4 12H4v-4m12 4h4v-4m-4-12h4v4" />
            </svg>
          ) : (
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