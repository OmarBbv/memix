'use client'
import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { X, Eye, EyeOff } from "lucide-react"
import Image from "next/image"

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return (
        <div className={`fixed inset-0 z-100 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}>
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
            <div className={`fixed top-0 left-0 right-0 h-screen bg-white transform transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-y-0' : '-translate-y-full'
                }`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">R</span>
                        </div>
                        <span className="font-bold text-lg">remix</span>
                        <span className="text-sm text-gray-500">PRELOVED FASHION</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-1 overflow-y-auto">
                    {/* Left Side - Promo */}
                    <div className="flex-1 bg-linear-to-br from-green-300 to-green-400 p-8 flex flex-col justify-center items-center text-center">
                        <div className="mb-6">
                            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
                                <span className="text-white text-2xl">✈</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                ВЗЕМИ -20% ОТСТЪПКА + БЕЗПЛАТНА ДОСТАВКА
                            </h2>
                            <p className="text-gray-700">WELCOME ПОДАРЪК!</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600 mb-2">Въведи код</p>
                            <div className="bg-white px-4 py-2 rounded-full inline-block">
                                <span className="font-bold">WELCOME</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="flex-1 p-8 flex flex-col justify-center">
                        <div className="max-w-md mx-auto w-full">
                            <h3 className="text-2xl font-bold text-center mb-8">ВХОД</h3>

                            <div className="space-y-4 mb-6">
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    autoComplete="off"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-5 border border-gray-300 rounded-lg"
                                />

                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        autoComplete="off"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full p-5 border border-gray-300 rounded-lg pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="text-center mb-6">
                                <a href="#" className="text-sm text-blue-600 hover:underline">
                                    Забравили сте паролата си?
                                </a>
                            </div>

                            <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-medium mb-6">
                                Вход
                            </Button>

                            <div className="space-y-3 mb-6">
                                <Button
                                    variant="outline"
                                    className="w-full py-4 border border-gray-300 rounded-lg flex items-center justify-center gap-3"
                                >
                                    <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">f</span>
                                    </div>
                                    Влезте с Facebook
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full py-4 border border-gray-300 rounded-lg flex items-center justify-center gap-3"
                                >
                                    <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">G</span>
                                    </div>
                                    Влезте с Google
                                </Button>
                            </div>

                            <div className="text-center text-sm text-gray-600">
                                Нямате профил в Remix? {" "}
                                <a href="#" className="text-blue-600 hover:underline">
                                    Регистрирайте се.
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Images */}
                <div className="flex shrink-0">
                    <div className="flex-1 h-32 bg-blue-200 relative overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-r from-blue-300 to-blue-400"></div>
                        <div className="absolute bottom-4 left-4">
                            <div className="bg-white px-3 py-1 rounded">
                                <span className="text-sm font-medium">WEAR&SHARE</span>
                                <div className="text-xs text-gray-600">BONUS</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 h-32 bg-gray-800 relative overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-r from-gray-700 to-gray-900"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center text-white">
                                <div className="text-4xl font-bold mb-2">CBB</div>
                                <div className="text-sm">Започни новата</div>
                            </div>
                        </div>
                        <div className="absolute bottom-4 left-4">
                            <a href="#" className="text-white text-sm underline hover:no-underline">
                                Към селекцията →
                            </a>
                        </div>
                    </div>

                    <div className="flex-1 h-32 bg-green-200 relative overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-r from-green-300 to-green-400"></div>
                        <div className="absolute top-4 right-4">
                            <div className="bg-black text-white px-3 py-1 rounded text-sm">
                                До -50%
                            </div>
                            <div className="text-xs text-gray-700 mt-1">с код FRESH</div>
                        </div>
                        <div className="absolute bottom-4 left-4 text-green-800">
                            <div className="text-sm font-medium">Започни с Wear&Share</div>
                        </div>
                    </div>

                    <div className="flex-1 h-32 bg-gray-100 relative overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-r from-gray-200 to-gray-300"></div>
                        <div className="absolute bottom-4 right-4 text-gray-700">
                            <div className="text-sm">Условия</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
