import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export default function FAQAccordion() {
  return (
    <Accordion type="single" collapsible className="space-y-2">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-base py-2 text-left">
          Gdzie prowadzone są zajęcia?
        </AccordionTrigger>
        <AccordionContent className="text-base">
          Zajęcia odbywają się w dwóch lokalizacjach:
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Mszana Dolna: ul. Józefa Marka 2</li>
            <li>Nowy Targ: ul. Plac Evry 4</li>
          </ul> 
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger className="text-base py-2 text-left">
          Czy Akademia ma status klubu sportowego?
        </AccordionTrigger>
        <AccordionContent className="text-base">
          Tak! Jesteśmy zarejestrowanym klubem sportowym (KRS 0001133284) i przygotowujemy zawodników do rywalizacji na szczeblu regionalnym i krajowym.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionTrigger className="text-base py-2 text-left">
          Jak mogę zapisać dziecko na zajęcia?
        </AccordionTrigger>
        <AccordionContent className="text-base">
          Obecnie pracujemy nad elektronicznym formularzem zapisów. Tymczasowo prosimy o bezpośredni kontakt:
          <ul className="list-none mt-2 space-y-1">
            <li> Telefon: 535 124 492</li>
            <li> E-mail: akademia.malopolska@gmail.com</li>
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-4">
        <AccordionTrigger className="text-base py-2 text-left">
          Czy zajęcia są bezpieczne dla dzieci?
        </AccordionTrigger>
        <AccordionContent className="text-base">
          Tak! Certyfikowani trenerzy z uprawnieniami pedagogicznymi dbają o asekurację. Wszystkie przyrządy posiadają atestowane zabezpieczenia, a sale są wyposażone w specjalistyczny sprzęt.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-5">
        <AccordionTrigger className="text-base py-2 text-left">
          Czy potrzebne jest doświadczenie?
        </AccordionTrigger>
        <AccordionContent className="text-base">
          Nie wymagamy doświadczenia! Prowadzimy grupy dla dzieci w różnym wieku 3-11+ lat i na każdym poziomie zaawansowania. Po wstępnej konsultacji dopasujemy poziom zajęć do umiejętności Twojego dziecka i doradzimy optymalną ścieżkę rozwoju.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-6">
        <AccordionTrigger className="text-base py-2 text-left">
          Jak wyglądają obozy sportowe?
        </AccordionTrigger>
        <AccordionContent className="text-base">
          Organizujemy letnie i zimowe obozy łączące codzienne treningi z zabawą (np. wycieczki górskie, gry i zabawy zespołowe). Zakwaterowanie w ośrodkach z pełnym zapleczem sportowym.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
