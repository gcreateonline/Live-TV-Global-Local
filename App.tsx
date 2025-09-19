import React from 'react';
import DeviceFrame from './components/DeviceFrame';
import AdBanner from './components/AdBanner';

const App: React.FC = () => {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-900 to-black flex flex-col items-center justify-center p-2 sm:p-4 font-sans antialiased overflow-hidden">
      <header id="main-header" className="text-center mb-6 md:mb-8 z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          Live TV Global & Local
        </h1>
      </header>
      <DeviceFrame />
      <AdBanner />
    </main>
  );
};

export default App;