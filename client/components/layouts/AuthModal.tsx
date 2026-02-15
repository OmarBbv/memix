'use client'
import { Eye, EyeOff, X } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useLogin, useRegister } from "@/hooks/useAuth"

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
    const [isLogin, setIsLogin] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")

    const { mutateAsync: login, isPending: isLoginLoading } = useLogin()
    const { mutateAsync: register, isPending: isRegisterLoading } = useRegister()

    // Form fields
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [surname, setSurname] = useState("")

    const handleSubmit = async () => {
        setError("")

        try {
            if (isLogin) {
                await login({ email, password })
                onClose()
            } else {
                await register({ email, password, name, surname })
                // Switch to login after register
                setIsLogin(true)
                setError("Qeydiyyat uğurludur! İndi daxil olun.")
            }
        } catch (err: any) {
            console.error(err)
            setError(err.response?.data?.message || "Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.")
        }
    }

    const isLoading = isLoginLoading || isRegisterLoading

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
                        <span className="font-bold text-lg">Memix</span>
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
                <div className="flex flex-col md:flex-row flex-1 overflow-y-auto">
                    {/* Left Side - Promo (Hidden on Mobile) */}
                    <div className="hidden md:flex flex-1 bg-linear-to-br from-green-300 to-green-400 p-8 flex-col justify-center items-center text-center">
                        <div className="mb-6">
                            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
                                <span className="text-white text-2xl">✈</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                -20% ENDİRİM + PULSUZ ÇATDIRILMA AL
                            </h2>
                            <p className="text-gray-700">WELCOME!</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600 mb-2">Kodu daxil et</p>
                            <div className="bg-white px-4 py-2 rounded-full inline-block">
                                <span className="font-bold">WELCOME</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Login/Register Form */}
                    <div className="flex-1 p-4 md:p-8 flex flex-col justify-center w-full">
                        <div className="max-w-md mx-auto w-full">
                            {/* Mobile Promo Banner */}
                            <div className="md:hidden bg-green-100 p-4 rounded-lg mb-6 text-center border border-green-200">
                                <p className="font-bold text-green-800 text-sm">WELCOME kodu ilə -20% ENDİRİM</p>
                            </div>

                            <h3 className="text-2xl font-bold text-center mb-8">
                                {isLogin ? 'GİRİŞ' : 'QEYDİYYAT'}
                            </h3>

                            {error && (
                                <div className={`p-3 rounded-lg mb-4 text-sm text-center ${error.includes('uğurludur') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4 mb-6">
                                {!isLogin && (
                                    <div className="flex gap-4">
                                        <Input
                                            type="text"
                                            placeholder="Ad"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-1/2 p-5 border border-gray-300 rounded-lg"
                                        />
                                        <Input
                                            type="text"
                                            placeholder="Soyad"
                                            value={surname}
                                            onChange={(e) => setSurname(e.target.value)}
                                            className="w-1/2 p-5 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                )}

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
                                        placeholder="Şifrə"
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

                            {isLogin && (
                                <div className="text-center mb-6">
                                    <a href="#" className="text-sm text-blue-600 hover:underline">
                                        Şifrənizi unutmusunuz?
                                    </a>
                                </div>
                            )}

                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 rounded-lg font-medium mb-6 text-base"
                            >
                                {isLoading ? 'Yüklənir...' : (isLogin ? 'Daxil ol' : 'Qeydiyyatdan keç')}
                            </Button>

                            <div className="space-y-3 mb-6">


                                <Button
                                    variant="outline"
                                    onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4444'}/auth/google`}
                                    className="w-full py-6 border border-gray-300 rounded-lg flex items-center justify-center gap-3"
                                >
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z" fill="#4285F4"></path>
                                        <path d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z" fill="#34A853"></path>
                                        <path d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z" fill="#FBBC05"></path>
                                        <path d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z" fill="#EB4335"></path>
                                    </svg>
                                    Google ilə {isLogin ? 'daxil ol' : 'qeydiyyat'}
                                </Button>
                            </div>

                            <div className="text-center text-sm text-gray-600">
                                {isLogin ? (
                                    <>
                                        Memix-də hesabınız yoxdur? {" "}
                                        <button onClick={() => setIsLogin(false)} className="text-blue-600 hover:underline font-medium">
                                            Qeydiyyatdan keçin.
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        Artıq hesabınız var? {" "}
                                        <button onClick={() => setIsLogin(true)} className="text-blue-600 hover:underline font-medium">
                                            Daxil olun.
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Images - Hidden on Mobile to save space */}
                <div className="hidden md:flex shrink-0">
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
                                <div className="text-sm">Yenisini başlat</div>
                            </div>
                        </div>
                        <div className="absolute bottom-4 left-4">
                            <a href="#" className="text-white text-sm underline hover:no-underline">
                                Seçimə keç →
                            </a>
                        </div>
                    </div>

                    <div className="flex-1 h-32 bg-green-200 relative overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-r from-green-300 to-green-400"></div>
                        <div className="absolute top-4 right-4">
                            <div className="bg-black text-white px-3 py-1 rounded text-sm">
                                50%-ə qədər
                            </div>
                            <div className="text-xs text-gray-700 mt-1">FRESH kodu ilə</div>
                        </div>
                        <div className="absolute bottom-4 left-4 text-green-800">
                            <div className="text-sm font-medium">Wear&Share ilə başla</div>
                        </div>
                    </div>

                    <div className="flex-1 h-32 bg-gray-100 relative overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-r from-gray-200 to-gray-300"></div>
                        <div className="absolute bottom-4 right-4 text-gray-700">
                            <div className="text-sm">Şərtlər</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
