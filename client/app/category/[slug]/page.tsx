'use client'
import { useParams } from 'next/navigation'
import { CategorySelector } from '../components/CategorySelector'

const categoryTitles: { [key: string]: string } = {
    'women': 'Дамска мода',
    'men': 'Мъжка мода',
    'bags': 'Чанти',
    'accessories': 'Аксесоари',
    'shoes': 'Обувки',
    'children': 'Деца'
}

const subcategoryTitles: { [key: string]: string } = {
    // Популярни
    'added-today': 'Добавени днес',
    'lowest-prices': 'Най-ниски цени',
    'most-liked': 'Най-харесвани',
    'daily-finds': 'Находките на деня',
    'winter-classics': 'Зимни класики',
    'jackets-coats': 'Сака, якета и жилетки',
    'winter-comfort': 'В уюта на зимата',
    'tommy-hilfiger': 'Tommy Hilfiger Shop',

    // Дамски дрехи
    'tracksuits': 'Анцузи',
    'swimwear': 'Бански',
    'underwear': 'Бельо',
    'blouses': 'Блузи',
    'ponchos': 'Боксро и пончо',
    'jumpsuits': 'Гащеризони',
    'jeans': 'Дънки',
    'vests': 'Елеци',
    'cardigans': 'Жилетки',
    'skirts': 'Клинове',
    'leather-jackets': 'Кожени якета',
    'suits': 'Костюми',
    'shorts': 'Къси панталони',
    'coats': 'Палта',

    // Марки
    'zara': 'Zara',
    'nike': 'Nike',
    'pinko': 'Pinko',
    'karl-lagerfeld': 'Karl Lagerfeld',
    'all-brands': 'Вижте всички марки',

    // Други
    'backpacks': 'Раници',
    'shoulder-bags': 'Чанти за рамо',
    'jewelry': 'Бижута',
    'watches': 'Часовници',
    'sport-shoes': 'Спортни обувки',
    'elegant-shoes': 'Елегантни обувки',
    'babies': 'Бебета',
    'toddlers': 'Малки деца'
}

export default function CategoryPage() {
    const params = useParams()
    const slug = params.slug as string

    const title = categoryTitles[slug] || subcategoryTitles[slug] || 'Категория'

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-xl font-bold mb-8 block text-center">{title}</h1>

                <CategorySelector currentCategory={slug} />

                <p className="text-lg text-gray-600 mb-8">
                    Открийте най-добрите продукти в категория "{title}"
                </p>

                {/* Тук ще бъде продуктовият списък */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Placeholder за продукти */}
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                        <div key={item} className="bg-gray-100 rounded-lg p-4 h-64 flex items-center justify-center">
                            <span className="text-gray-500">Продукт {item}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
