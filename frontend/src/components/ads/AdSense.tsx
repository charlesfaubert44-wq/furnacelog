import { useEffect } from 'react';

interface AdSenseProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  className?: string;
}

/**
 * Google AdSense Component
 * Only shows ads for free tier users
 */
export const AdSense: React.FC<AdSenseProps> = ({
  slot,
  format = 'auto',
  responsive = true,
  className = ''
}) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-3954644976524123';

  if (!clientId || import.meta.env.DEV) {
    // Development placeholder
    return (
      <div className={`bg-stone-800/50 border border-stone-700 rounded-lg p-8 text-center ${className}`}>
        <p className="text-stone-500 text-sm">
          📢 Ad Space • $6.99/mo to remove ads
        </p>
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: 'block' }}
      data-ad-client={clientId}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
    />
  );
};

/**
 * Ad Banner for Dashboard (horizontal)
 */
export const DashboardAdBanner: React.FC = () => {
  return (
    <div className="my-8">
      <AdSense
        slot="1234567890"
        format="horizontal"
        className="min-h-[90px]"
      />
    </div>
  );
};

/**
 * Ad Sidebar (vertical)
 */
export const SidebarAd: React.FC = () => {
  return (
    <div className="sticky top-24">
      <AdSense
        slot="0987654321"
        format="vertical"
        className="min-h-[600px]"
      />
    </div>
  );
};

export default AdSense;
