"use client";

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { sendGTMEvent } from '@next/third-parties/google';

export default function GTMAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      sendGTMEvent({
        event: 'page_view',
        page_location: window.location.href,
        page_path: pathname,
      });
    }
  }, [pathname]);

  return null;
}