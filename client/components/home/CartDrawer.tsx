import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ReactNode } from "react"
import { Shirt } from "lucide-react"
import Link from "next/link"

interface CartDrawerProps {
    children: ReactNode
}

export function CartDrawer({ children }: CartDrawerProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-[500px]! sm:w-[500px] p-0 flex flex-col [&>button]:top-[18px] [&>button]:right-6">
                <SheetHeader className="px-6 py-[18px] border-b">
                    <SheetTitle className="text-xl font-normal m-0">Кошница</SheetTitle>
                </SheetHeader>

                <div className="flex-1 flex flex-col justify-center items-center px-16 py-[30px] text-center">
                    <div className="text-gray-400 text-[106px] leading-none mb-8 relative">
                        <Shirt className="w-[106px] h-[106px]" strokeWidth={1} />
                        <span className="absolute -top-2 -right-2 text-2xl">✨</span>
                        <span className="absolute top-4 -left-4 text-xl">✨</span>
                        <span className="absolute -bottom-2 left-2 text-lg">✨</span>
                    </div>

                    <div className="space-y-2 mb-8">
                        <p className="text-base leading-6 text-gray-900">
                            Все още нямате продукти в кошницата.
                        </p>
                        <p className="text-base leading-6 text-gray-900">
                            Добавете нещо стилно днес.
                        </p>
                    </div>

                    <div className="w-full space-y-3">
                        <Link href="/category/women" className="block">
                            <Button className="w-full bg-black hover:bg-gray-800 text-white rounded-xl px-6 text-base font-medium h-[42px] relative after:content-['→'] after:ml-2 after:text-xl after:font-normal">
                                Дамска мода
                            </Button>
                        </Link>
                        <Link href="/category/men" className="block">
                            <Button className="w-full bg-black hover:bg-gray-800 text-white rounded-xl px-6 text-base font-medium h-[42px] relative after:content-['→'] after:ml-2 after:text-xl after:font-normal">
                                Мъжка мода
                            </Button>
                        </Link>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
