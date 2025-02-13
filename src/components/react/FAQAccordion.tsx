import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQAccordion() {
  return (
    <Accordion type="single" collapsible className="space-y-2">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-base py-2">
          Gdzie prowadzone są zajęcia?
        </AccordionTrigger>
        <AccordionContent className="text-base">
          Zajęcia odbywają się w dwóch lokalizacjach:
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Mszana Dolna: ul. Sportowa 15 (Hala Widowiskowo-Sportowa)</li>
            <li>Nowy Targ: ul. Olimpijska 8 (Kompleks Aktywności Fizycznej)</li>
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger className="text-base py-2">
          Czy Akademia ma status klubu sportowego?
        </AccordionTrigger>
        <AccordionContent className="text-base">
          Tak! Jesteśmy zarejestrowanym klubem sportowym (nr licencji 3734734) i przygotowujemy zawodników do rywalizacji na szczeblu regionalnym i krajowym.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionTrigger className="text-base py-2">
          Jak mogę zapisać dziecko na zajęcia?
        </AccordionTrigger>
        <AccordionContent className="text-base">
          Obecnie pracujemy nad elektronicznym formularzem zapisów. Prosimy o kontakt:
          <ul className="list-none mt-2 space-y-1">
            <li>📞 Telefon: 123 456 789</li>
            <li>✉️ E-mail: zapisy@mag.pl</li>
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-4">
        <AccordionTrigger className="text-base py-2">
          Czy zajęcia są bezpieczne dla dzieci?
        </AccordionTrigger>
        <AccordionContent className="text-base">
          Tak! Certyfikowani trenerzy z uprawnieniami pedagogicznymi dbają o asekurację. Wszystkie przyrządy posiadają atestowane zabezpieczenia, a sale są wyposażone w miękkie maty.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-5">
        <AccordionTrigger className="text-base py-2">
          Czy potrzebne jest doświadczenie?
        </AccordionTrigger>
        <AccordionContent className="text-base">
          Nie wymagamy doświadczenia! Prowadzimy grupy dla dzieci w różnym wieku (3-17 lat) i na każdym poziomie zaawansowania. Po wstępnej konsultacji dopasujemy poziom zajęć do umiejętności Twojego dziecka i doradzimy optymalną ścieżkę rozwoju.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-6">
        <AccordionTrigger className="text-base py-2">
          Jak wyglądają obozy sportowe?
        </AccordionTrigger>
        <AccordionContent className="text-base">
          Organizujemy letnie i zimowe obozy łączące codzienne treningi z zabawą (np. wycieczki górskie, warsztaty taneczne). Zakwaterowanie w ośrodkach z pełnym zapleczem sportowym.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-7">
        <AccordionTrigger className="text-base py-2">
          Czy oferujecie zajęcia próbne?
        </AccordionTrigger>
        <AccordionContent className="text-base">
          Tak! Pierwsze zajęcia są darmowe – umożliwiamy sprawdzenie atmosfery i dopasowanie do grupy.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-8">
        <AccordionTrigger className="text-base py-2">
          Jakie korzyści daje przynależność do klubu?
        </AccordionTrigger>
        <AccordionContent className="text-base">
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Możliwość udziału w zawodach ogólnopolskich</li>
            <li>Ubezpieczenie NNW podczas treningów</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
