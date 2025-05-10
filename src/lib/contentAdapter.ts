import type { Entry } from 'contentful';
import { getBlogEntries, getBlogEntryBySlug } from './contentful';
import { getCollection } from 'astro:content';

// Interfejs dla ujednoliconego formatu wpisu blogowego
export interface UnifiedBlogPost {
  id: string;
  slug: string;
  title: string;
  date: Date | string;
  description: string;
  image: string;
  content: any;
  source: ContentSource;
}

// Enum określający źródło treści
export enum ContentSource {
  LOCAL = 'local',
  CONTENTFUL = 'contentful'
}

// Funkcja pomocnicza do sprawdzania typu źródła treści
export function isContentSource(source: ContentSource, target: ContentSource): boolean {
  return source === target;
}

// Domyślne źródło treści - można zmienić na CONTENTFUL gdy będziemy gotowi
const DEFAULT_SOURCE: ContentSource = ContentSource.LOCAL;

// Adapter dla wpisów blogowych - obsługuje zarówno lokalne jak i Contentful
export async function getBlogPosts(source: ContentSource = DEFAULT_SOURCE): Promise<UnifiedBlogPost[]> {
  // Próbujemy pobrać z wybranego źródła
  if (source === ContentSource.CONTENTFUL) {
    // Pobierz z Contentful i przekształć do wspólnego formatu
    try {
      const entries = await getBlogEntries();
      
      // Jeśli nie ma wpisów z Contentful, spróbuj użyć lokalnych
      if (entries.length === 0) {
        console.warn('Brak wpisów w Contentful lub problem z konfiguracją. Próba użycia lokalnych wpisów.');
        return getLocalBlogPosts();
      }
      
      return entries.map(transformContentfulEntry);
    } catch (error) {
      console.error('Błąd podczas pobierania wpisów z Contentful:', error);
      console.warn('Próba użycia lokalnych wpisów jako fallback.');
      return getLocalBlogPosts();
    }
  } else {
    // Pobierz z lokalnych Content Collections
    return getLocalBlogPosts();
  }
}

// Pomocnicza funkcja do pobierania lokalnych wpisów
async function getLocalBlogPosts(): Promise<UnifiedBlogPost[]> {
  try {
    const entries = await getCollection('blog');
    return entries.map(entry => ({
      id: entry.id,
      slug: entry.slug,
      title: entry.data.title,
      date: entry.data.date,
      description: entry.data.description,
      image: entry.data.image,
      content: entry.body, // Treść Markdown
      source: ContentSource.LOCAL
    }));
  } catch (error) {
    console.error('Błąd podczas pobierania lokalnych wpisów:', error);
    return [];
  }
}

// Pobieranie pojedynczego wpisu po slug
export async function getBlogPostBySlug(slug: string, source: ContentSource = DEFAULT_SOURCE) {
  // Próbujemy pobrać z wybranego źródła
  if (source === ContentSource.CONTENTFUL) {
    try {
      const entry = await getBlogEntryBySlug(slug);
      
      // Jeśli nie znaleziono wpisu w Contentful, spróbuj lokalnie
      if (!entry) {
        console.warn(`Nie znaleziono wpisu "${slug}" w Contentful. Próba użycia lokalnych wpisów.`);
        return getLocalBlogPostBySlug(slug);
      }
      
      return transformContentfulEntry(entry);
    } catch (error) {
      console.error(`Błąd podczas pobierania wpisu "${slug}" z Contentful:`, error);
      console.warn(`Próba użycia lokalnych wpisów jako fallback dla "${slug}".`);
      return getLocalBlogPostBySlug(slug);
    }
  } else {
    // Pobierz z lokalnych Content Collections
    return getLocalBlogPostBySlug(slug);
  }
}

// Pomocnicza funkcja do pobierania lokalnego wpisu po slug
async function getLocalBlogPostBySlug(slug: string): Promise<UnifiedBlogPost | null> {
  try {
    const entries = await getCollection('blog');
    const entry = entries.find(entry => entry.slug === slug);
    
    if (!entry) return null;
    
    return {
      id: entry.id,
      slug: entry.slug,
      title: entry.data.title,
      date: entry.data.date,
      description: entry.data.description,
      image: entry.data.image,
      content: entry.body,
      source: ContentSource.LOCAL
    };
  } catch (error) {
    console.error(`Błąd podczas pobierania lokalnego wpisu "${slug}":`, error);
    return null;
  }
}

// Funkcja pomocnicza do przekształcania wpisów z Contentful na wspólny format
function transformContentfulEntry(entry: Entry<any>): UnifiedBlogPost {
  const fields = entry.fields as Record<string, any>;
  
  // Bezpieczne pobieranie wartości z pól
  const title = typeof fields.title === 'string' ? fields.title : 'Bez tytułu';
  const slug = typeof fields.slug === 'string' ? fields.slug : entry.sys.id;
  const description = typeof fields.description === 'string' ? fields.description : '';
  const date = fields.date || entry.sys.createdAt;
  
  // Bezpieczne pobieranie URL obrazu
  let imageUrl = '/images/placeholder.jpg';
  if (fields.image && typeof fields.image === 'object' && fields.image.fields && 
      fields.image.fields.file && fields.image.fields.file.url) {
    imageUrl = `https:${fields.image.fields.file.url}`;
  }
  
  return {
    id: entry.sys.id,
    slug: slug,
    title: title,
    date: date,
    description: description,
    image: imageUrl,
    content: fields.content || '', // Treść w formacie Rich Text lub Markdown
    source: ContentSource.CONTENTFUL
  };
}
