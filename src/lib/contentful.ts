import { createClient } from 'contentful';

// Klucze dostępu do Contentful
// W środowisku produkcyjnym powinny być przechowywane w zmiennych środowiskowych
// Jak uzyskać te klucze:
// 1. Zaloguj się do Contentful (https://app.contentful.com/)
// 2. Przejdź do Settings -> API keys
// 3. Utwórz nowy klucz lub użyj istniejącego
// 4. Skopiuj Space ID i Content Delivery API - access token

// Klucze dostępu do Contentful
const CONTENTFUL_SPACE_ID = '7tr2fubum8df'; // Space ID
const CONTENTFUL_ACCESS_TOKEN = '5ePxwYB_otXIV672r_3PmiZdjJAFNfk2GflRxhe6FE8'; // Content Delivery API token z przykładu
const CONTENTFUL_PREVIEW_TOKEN = ''; // Content Preview API token - opcjonalny

// Tworzymy klienta Contentful
export const contentfulClient = createClient({
  space: CONTENTFUL_SPACE_ID,
  accessToken: CONTENTFUL_ACCESS_TOKEN,
  // Ustawienia opcjonalne
  environment: 'master', // domyślne środowisko
});

// Klient do podglądu wersji roboczych (opcjonalnie)
export const contentfulPreviewClient = createClient({
  space: CONTENTFUL_SPACE_ID,
  accessToken: CONTENTFUL_PREVIEW_TOKEN,
  host: 'preview.contentful.com', // host dla wersji podglądowych
  environment: 'master',
});

// Funkcja pomocnicza do pobierania wpisów blogowych
export async function getBlogEntries() {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'blogPost', // ID typu treści w Contentful
      order: ['-sys.createdAt'], // Sortowanie od najnowszych (jako tablica)
      include: 2, // Poziom zagnieżdżenia referencji
    });
    
    return entries.items;
  } catch (error) {
    console.error('Błąd podczas pobierania wpisów z Contentful:', error);
    return [];
  }
}

/*
 * INSTRUKCJA: Tworzenie modelu treści w Contentful
 * 
 * 1. Zaloguj się do panelu Contentful (https://app.contentful.com/)
 * 2. Przejdź do zakładki "Content model"
 * 3. Kliknij "Add content type"
 * 4. Ustaw:
 *    - Name: "Blog Post"
 *    - API identifier: "blogPost" (dokładnie taka nazwa jest używana w kodzie)
 * 5. Dodaj następujące pola:
 *    - title (Short text) - Tytuł wpisu
 *    - slug (Short text) - Unikalny identyfikator w URL (np. "moj-pierwszy-wpis")
 *    - date (Date & time) - Data publikacji
 *    - description (Short text) - Krótki opis/wstęp
 *    - image (Media) - Zdjęcie główne wpisu
 *    - content (Rich text) - Treść wpisu
 * 6. Zapisz model i utwórz pierwszy wpis testowy
 */

// Funkcja pomocnicza do pobierania pojedynczego wpisu po slug
export async function getBlogEntryBySlug(slug: string) {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'blogPost',
      'fields.slug': slug,
      include: 2,
      limit: 1, // Pobieramy tylko jeden wpis
    });
    
    return entries.items[0] || null;
  } catch (error) {
    console.error(`Błąd podczas pobierania wpisu "${slug}" z Contentful:`, error);
    return null;
  }
}

// Typy TypeScript dla danych z Contentful (opcjonalnie)
export interface BlogPost {
  title: string;
  slug: string;
  date: string;
  description: string;
  image: {
    fields: {
      file: {
        url: string;
      }
    }
  };
  content: any; // Zawartość w formacie Rich Text lub Markdown
}
