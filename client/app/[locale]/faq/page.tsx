'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQPage() {
  const faqs = [
    {
      question: "Sifarişimi necə izləyə bilərəm?",
      answer: "Sifarişinizi verdikdən sonra sizə e-mail vasitəsilə izləmə kodu göndəriləcək. Həmçinin, 'Hesabım > Sifarişlərim' menyusundan da sifarişinizin cari statusunu görə bilərsiniz."
    },
    {
      question: "Çatdırılma haqqı nə qədərdir?",
      answer: "Bakı daxili çatdırılma 50 AZN üzəri sifarişlərdə pulsuzdur. 50 AZN-dən az olan sifarişlər üçün standart çatdırılma haqqı 3 AZN təşkil edir. Rayonlara çatdırılma haqqı poçt tariflərinə uyğun hesablanır."
    },
    {
      question: "Məhsulu necə qaytara bilərəm?",
      answer: "Məhsulu təhvil aldıqdan sonra 14 gün ərzində qaytara və ya dəyişdirə bilərsiniz. Bunun üçün məhsulun etiketi qoparılmamalı və istifadə izləri olmamalıdır. Qaytarılma üçün bizimlə əlaqə saxlayın."
    },
    {
      question: "İkinci əl məhsulların təmizliyinə zəmanət verirsinizmi?",
      answer: "Bəli, Memix-də satılan bütün ikinci əl geyimlər peşəkar quru təmizləmədən keçirilir və gigiyenik standartlara tam cavab verir. Hər məhsul satışa çıxarılmazdan əvvəl diqqətlə yoxlanılır."
    },
    {
      question: "Ödəniş üsulları hansılardır?",
      answer: "Saytımızda Visa və MasterCard ilə onlayn ödəniş edə bilərsiniz. Həmçinin, qapıda nağd ödəniş seçimi də mövcuddur (yalnız Bakı daxili sifarişlər üçün)."
    },
    {
      question: "Öz geyimlərimi necə sata bilərəm?",
      answer: "Çox sadə! 'Satışa Başla' düyməsinə klikləyərək satıcı formunu doldurun. Komandamız sizinlə əlaqə saxlayaraq geyimlərinizi qiymətləndirəcək və satış prosesini başladacaq."
    }
  ];

  return (
    <div className="bg-white md:py-12 min-h-screen">
      < div className="max-w-3xl mx-auto md:px-6" >
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">Tez-tez Verilən Suallar</h1>
          <p className="text-zinc-600 text-lg">
            Ən çox soruşulan sualların cavablarını burada tapa bilərsiniz.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border border-zinc-200 rounded-xl px-6 data-[state=open]:bg-zinc-50 data-[state=open]:border-zinc-300 transition-all">
              <AccordionTrigger className="text-lg font-medium text-left hover:no-underline py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-zinc-600 pb-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div >
    </div >
  );
}
