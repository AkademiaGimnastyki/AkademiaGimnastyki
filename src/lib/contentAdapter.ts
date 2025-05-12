import type { Entry } from 'contentful';
import { getBlogEntries, getBlogEntryBySlug } from './contentful';

// Interfejs dla ujednoliconego formatu wpisu blogowego
export interface UnifiedBlogPost {
  id: string;
  slug: string;
  title: string;
  date: Date | string;
  description: string;
  image: string;
  content: any;
  attachments?: any[]; // Dodatkowe załączniki (np. pliki PDF, obrazy)
  source: string;
}

// Stała określająca źródło treści
export enum ContentSource {
  CONTENTFUL = 'contentful'
}

// Adapter dla wpisów blogowych - teraz tylko Contentful
export async function getBlogPosts(): Promise<UnifiedBlogPost[]> {
  try {
    const entries = await getBlogEntries();
    return entries.map(transformContentfulEntry);
  } catch (error) {
    console.error('Błąd podczas pobierania wpisów z Contentful:', error);
    return [];
  }
}

// Pobieranie pojedynczego wpisu po slug
export async function getBlogPostBySlug(slug: string) {
  try {
    const entry = await getBlogEntryBySlug(slug);
    return entry ? transformContentfulEntry(entry) : null;
  } catch (error) {
    console.error(`Błąd podczas pobierania wpisu "${slug}" z Contentful:`, error);
    return null;
  }
}

// Funkcja pomocnicza do przekształcania wpisów z Contentful na wspólny format
function transformContentfulEntry(entry: Entry<any>): UnifiedBlogPost {
  const fields = entry.fields as Record<string, any>;
  
  // Bezpieczne pobieranie wartości z pól
  const title = typeof fields.title === 'string' ? fields.title : 'Bez tytułu';
  
  // Sprawdź, czy mamy pole slug, jeśli nie, użyj ID wpisu
  let slug = entry.sys.id;
  if (typeof fields.slug === 'string' && fields.slug) {
    slug = fields.slug;
  }
  
  // Opis - może być w polu opis lub description
  let description = '';
  if (typeof fields.description === 'string') {
    description = fields.description;
  } else if (typeof fields.opis === 'string') {
    description = fields.opis;
  }
  
  // Data - może być w różnych formatach
  let date = entry.sys.createdAt;
  if (fields.date) {
    date = fields.date;
  }
  
  // Bezpieczne pobieranie URL obrazu
  let imageUrl = '/images/placeholder.jpg';
  if (fields.image && typeof fields.image === 'object' && fields.image.fields && 
      fields.image.fields.file && fields.image.fields.file.url) {
    imageUrl = `https:${fields.image.fields.file.url}`;
  }
  
  // Treść - może być w różnych polach i formatach
  let content = '';
  
  // Sprawdź dostępne pola dla treści
  if (fields.content) {
    // Jeśli jest to obj Rich Text, konwertujemy go do HTML
    if (typeof fields.content === 'object' && fields.content.nodeType === 'document') {
      // Najprostsze podejście - konwersja do tekstu
      content = JSON.stringify(fields.content);
    } else {
      content = fields.content;
    }
  } else if (fields.tresc) {
    content = fields.tresc;
  }
  
  // Obsługa dodatkowych załączników
  let attachments = [];
  if (fields.attachments && Array.isArray(fields.attachments)) {
    // Jeśli pole attachments jest tablicą referencji do zasobów
    attachments = fields.attachments;
  }
  
  return {
    id: entry.sys.id,
    slug: slug,
    title: title,
    date: date,
    description: description,
    image: imageUrl,
    content: content,
    attachments: attachments,
    source: ContentSource.CONTENTFUL
  };
}
