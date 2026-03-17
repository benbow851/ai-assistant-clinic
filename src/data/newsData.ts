
import { NewsItemProps } from '@/components/NewsItem';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  isRead: boolean;
  learning?: string;
  date?: string;
}

export const initialNewsData: NewsItem[] = [];
