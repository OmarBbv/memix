'use client'
import { useParams } from 'next/navigation'
import { CategorySelector } from '../components/CategorySelector'

const categoryTitles: { [key: string]: string } = {
    'women': 'Qadın modası',
    'men': 'Kişi modası',
    'bags': 'Çantalar',
    'accessories': 'Aksesuarlar',
    'shoes': 'Ayaqqabılar',
    'children': 'Uşaqlar'
}

const subcategoryTitles: { [key: string]: string } = {
    'added-today': 'Bu gün əlavə edilənlər',
    'lowest-prices': 'Ən aşağı qiymətlər',
    'most-liked': 'Ən çox bəyənilənlər',
    'daily-finds': 'Günün tapıntıları',
    'winter-classics': 'Qış klassikləri',
    'jackets-coats': 'Ceketlər, paltolar və jiletlər',
    'winter-comfort': 'Qışın rahatlığında',
    'tommy-hilfiger': 'Tommy Hilfiger Shop',

    'tracksuits': 'Trenco',
    'swimwear': 'Üzgüçülük geyimləri',
    'underwear': 'Alt geyim',
    'blouses': 'Bluzkalar',
    'ponchos': 'Ponço və boksro',
    'jumpsuits': 'Kombinezonlar',
    'jeans': 'Cins',
    'vests': 'Yeleklər',
    'cardigans': 'Jiletlər',
    'skirts': 'Yubkalar',
    'leather-jackets': 'Dəri ceketlər',
    'suits': 'Kostyumlar',
    'shorts': 'Şortlar',
    'coats': 'Paltolar',

    'zara': 'Zara',
    'nike': 'Nike',
    'pinko': 'Pinko',
    'karl-lagerfeld': 'Karl Lagerfeld',
    'all-brands': 'Bütün brendləri gör',

    'backpacks': 'Sırt çantaları',
    'shoulder-bags': 'Çiyin çantaları',
    'jewelry': 'Biju',
    'watches': 'Saatlar',
    'sport-shoes': 'İdman ayaqqabıları',
    'elegant-shoes': 'Zərif ayaqqabılar',
    'babies': 'Körpələr',
    'toddlers': 'Kiçik uşaqlar'
}

export default function CategoryPage() {
    const params = useParams()
    const slug = params.slug as string

    const title = categoryTitles[slug] || subcategoryTitles[slug] || 'Kateqoriya'

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-xl font-bold mb-8 block text-center">{title}</h1>

                <CategorySelector currentCategory={slug} />

                <p className="text-lg text-gray-600 mb-8">
                    "{title}" kateqoriyasında ən yaxşı məhsulları kəşf edin
                </p>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                        <div key={item} className="bg-gray-100 rounded-lg p-4 h-64 flex items-center justify-center">
                            <span className="text-gray-500">Məhsul {item}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
