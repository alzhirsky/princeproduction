export interface Service {
  id: string;
  title: string;
  description: string;
  format: string;
  platform: string;
  turnaround: string;
  totalPrice: number;
  designerAlias: string;
  coverUrl: string;
}

export interface Designer {
  id: string;
  alias: string;
  skills: string[];
  accent: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const sampleServices: Service[] = [
  {
    id: 'b45a6d6a-7f13-4c64-b75d-b09ffcc7e59f',
    title: 'Превью для YouTube',
    description: 'Хайповый кликабельный дизайн с учётом бренда и референсов.',
    format: '1920×1080 JPG/PSD',
    platform: 'YouTube',
    turnaround: '48 часов',
    totalPrice: 8900,
    designerAlias: 'Дизайнер платформы',
    coverUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f7fb9cb9-6d34-49ed-a2ea-0211e0745c27',
    title: 'Монтаж Reels/TikTok',
    description: 'Вертикальное видео с графикой, субтитрами и звуком.',
    format: '1080×1920 MP4',
    platform: 'Instagram, TikTok',
    turnaround: '72 часа',
    totalPrice: 12900,
    designerAlias: 'Alias Aurora',
    coverUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '4a77d2b5-4cd4-4b5e-84c7-229a51f7c71d',
    title: 'Пакет сторис',
    description: 'Серия из 5 сторис с анимацией и интерактивом.',
    format: '1080×1920 PSD/MP4',
    platform: 'Instagram',
    turnaround: '96 часов',
    totalPrice: 15900,
    designerAlias: 'Alias Bloom',
    coverUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80'
  }
];

export const sampleDesigners: Designer[] = [
  {
    id: 'a1',
    alias: 'Alias Aurora',
    skills: ['Motion', 'Reels', 'Subtitles'],
    accent: '#5B8CFF',
    status: 'approved'
  },
  {
    id: 'a2',
    alias: 'Alias Bloom',
    skills: ['Stories', 'Illustration', 'Brand'],
    accent: '#f8c537',
    status: 'approved'
  },
  {
    id: 'a3',
    alias: 'Alias Nova',
    skills: ['YouTube', 'Thumbnails'],
    accent: '#ff5f6d',
    status: 'approved'
  },
  {
    id: 'a4',
    alias: 'Alias Vega',
    skills: ['Video Editing', 'Colorist'],
    accent: '#3ddc97',
    status: 'pending'
  }
];
