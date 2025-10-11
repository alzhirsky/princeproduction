export const mockCategories = [
  { id: 'cat-youtube', name: 'YouTube', slug: 'youtube', description: 'Оформление каналов и превью' },
  { id: 'cat-stories', name: 'Stories', slug: 'stories', description: 'Stories пакеты и анимация' },
  { id: 'cat-video', name: 'Video', slug: 'video', description: 'Монтаж вертикального видео' }
];

export const mockServices = [
  {
    id: 'svc-thumbnail',
    categoryId: 'cat-youtube',
    title: 'YouTube превью',
    description: 'Кликабельные превью с брендингом и вариативностью',
    coverUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    price: 8900,
    platformMarkup: 1900,
    format: '1920×1080 JPG/PSD',
    platform: 'YouTube',
    turnaround: '48 часов'
  },
  {
    id: 'svc-reels',
    categoryId: 'cat-video',
    title: 'Монтаж Reels',
    description: 'Вертикальное видео с субтитрами и музыкальными подборками',
    coverUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
    price: 12900,
    platformMarkup: 2500,
    format: '1080×1920 MP4',
    platform: 'Instagram, TikTok',
    turnaround: '72 часа'
  }
];

export const mockDesignerApplications = [
  {
    id: 'app-1',
    userId: 'designer-1',
    status: 'pending',
    bio: 'Motion дизайнер c 5-летним опытом',
    skills: ['Motion', 'Video'],
    portfolioLinks: ['https://behance.net/sample'],
    submittedAt: new Date().toISOString()
  }
];
