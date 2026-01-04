import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WishlistPage() {
    return (
        <div className="min-h-dvh flex items-center justify-center px-4 max-w-7xl mx-auto ">
            <div className="max-w-2xl mx-auto text-center space-y-8">
                {/* Heart Icon */}
                <div className="flex justify-center">
                    <Heart
                        className="w-32 h-32 text-[#E5395F] stroke-3"
                        fill="none"
                    />
                </div>

                {/* Main Text */}
                <div className="space-y-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase tracking-tight">
                        НЕ СА НАМЕРЕНИ АРТИКУЛИ, ОТГОВАРЯЩИ НА ТЪРСЕНЕТО
                    </h1>
                    <p className="text-base md:text-lg text-gray-700 max-w-lg mx-auto">
                        Разгледайте всички находки и добавяйте в „Любими", за да ги вижgame myk!
                    </p>
                </div>

                {/* CTA Button */}
                <div className="pt-4">
                    <Button
                        variant="outline"
                        className="px-8 cursor-pointer py-6 text-base font-bold uppercase border-2 border-gray-900 hover:bg-gray-50 transition-colors"
                    >
                        ОТКРИЙТЕ СВОИТЕ ЛЮБИМИ
                    </Button>
                </div>
            </div>
        </div>
    )
}
