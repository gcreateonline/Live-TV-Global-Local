import React, { useEffect } from 'react';

const AdBanner: React.FC = () => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className="w-full max-w-sm md:max-w-md lg:max-w-lg mt-6 text-center">
      {/* 
        This is a responsive ad unit.
        TODO: Replace the following with your own AdSense data:
        - data-ad-client: Your Publisher ID (e.g., "ca-pub-XXXXXXXXXXXXXXXX")
        - data-ad-slot: Your Ad Slot ID (e.g., "YYYYYYYYYY")
      */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot="YYYYYYYYYY"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdBanner;
