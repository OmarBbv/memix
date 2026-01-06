'use client'
import { ArrowRight, Mail } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

export const NewsletterSignup = () => {
    return (
        <section className="w-full px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-7xl mx-auto relative overflow-hidden rounded-[2.5rem] bg-[#0F172A]">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/10 blur-[100px] rounded-full" />
                    <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/10 blur-[100px] rounded-full" />
                </div>

                <div className="relative z-10 px-6 py-16 md:py-24 md:px-20 text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-2xl mb-8 border border-white/10 backdrop-blur-sm">
                        <Mail className="w-8 h-8 text-white" />
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
                        Moda Dünyasından Xəbərdar Ol
                    </h2>

                    <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Ən yeni trendləri, xüsusi kolleksiyaları və Remix-ə özəl endirim fürsətlərini ilk sən öyrən.
                    </p>

                    <div className="max-w-lg mx-auto">
                        <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm focus-within:bg-white/10 focus-within:border-white/20 transition-all duration-300">
                            <Input
                                type="email"
                                placeholder="E-poçt ünvanın"
                                className="flex-1 bg-transparent border-none text-white placeholder:text-slate-400 focus-visible:ring-0 h-12 md:h-14 px-4 text-base"
                            />
                            <Button
                                className="h-12 md:h-14 px-8 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-semibold text-base transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] whitespace-nowrap"
                            >
                                Abunə Ol
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                        <p className="text-slate-400 text-xs mt-4">
                            Abunə olaraq, məxfilik siyasətimizi və istifadə şərtlərini qəbul etmiş olursunuz.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
