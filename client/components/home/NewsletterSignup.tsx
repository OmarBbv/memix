'use client'
import { Button } from "../ui/button"
import { Input } from "../ui/input"

export const NewsletterSignup = () => {
    return (
        <div className="w-full py-16 bg-linear-to-r from-purple-200 to-pink-200 rounded-lg">
            <div className="max-w-7xl mx-auto px-3 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    Запиши се за нашия нюзлетър!
                </h2>
                <p className="text-base md:text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                    Ще научаваш първо за най-горещите модни тенденции и
                    специалните оферти на Remix.
                </p>

                <div className="flex flex-col sm:flex-row gap-2 md:gap-4 max-w-md mx-auto">
                    <Input
                        type="email"
                        placeholder="Въведи имейла си"
                        className="flex-1 py-2 md:py-5 px-4 bg-white rounded-lg border"
                    />
                    <Button
                        className="cursor-pointer bg-black hover:bg-gray-800 text-white px-8 py-5 leading-0 rounded-lg font-medium transition-colors"
                    >
                        Потвърди
                    </Button>
                </div>
            </div>
        </div>
    )
}
