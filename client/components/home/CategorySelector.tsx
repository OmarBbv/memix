import Image from "next/image"
import childImgOne from "@/public/home/category-selector/kids-2y.webp"
import childImgTwo from "@/public/home/category-selector/kids-10y.webp"
import childImgThree from "@/public/home/category-selector/kids-18y.webp"

const childrenCategories = [
    {
        img: childImgOne,
        alt: 'childImgOne',
        label: 'Деца до 2 години',
    },
    {
        img: childImgTwo,
        alt: 'childImgTwo',
        label: 'Деца до 10 години',
    },
    {
        img: childImgThree,
        alt: 'childImgThree',
        label: 'Тийнейджъри',
    },
];


export const CategorySelector = () => {
    return <div className="flex flex-col p-3">
        <h2 className="text-2xl text-center">
            Детски дрехи
        </h2>
        <div className="flex flex-nowrap justify-center gap-4 mt-4">
            {childrenCategories.map((child, index) => (
                <div
                    key={index}
                    className="flex flex-col items-center gap-2 shrink-0"
                >
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        <Image src={child.img} alt={child.alt} width={96} height={96} className="object-cover" />
                    </div>
                    <span className="text-base text-center max-w-[100px]">{child.label}</span>
                </div>
            ))}
        </div>
    </div>

}