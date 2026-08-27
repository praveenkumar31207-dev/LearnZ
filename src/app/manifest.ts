import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CogniStudy — AI Study Planner & Smart Tracker',
    short_name: 'CogniStudy',
    description:
      'Continuous adaptive AI study management system that analyzes progress and reschedules in real time.',
    start_url: '/',
    display: 'standalone',
    background_color: '#090d16',
    theme_color: '#4f46e5',
    icons: [
      {
        src: '/icons/icon-192x192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: '/icons/icon-512x512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
    ],
  };
}
