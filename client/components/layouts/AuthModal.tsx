'use client'
import { Eye, EyeOff, X, Mail, ArrowLeft, CheckCircle2, RefreshCw } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useLogin, useRegister, useSendOtp, useVerifyOtp } from "@/hooks/useAuth"
import { useAppDispatch } from "@/lib/redux/hooks"
import { setCredentials } from "@/lib/redux/features/authSlice"
import { authService } from "@/services/auth.service"

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
}

type Step = 'form' | 'otp' | 'success'

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
    const [isLogin, setIsLogin] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [step, setStep] = useState<Step>('form')
    const [otpValues, setOtpValues] = useState(['', '', '', '', '', ''])
    const [countdown, setCountdown] = useState(0)
    const otpRefs = useRef<(HTMLInputElement | null)[]>([])
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    const dispatch = useAppDispatch()

    const { mutateAsync: login, isPending: isLoginLoading } = useLogin()
    const { mutateAsync: register, isPending: isRegisterLoading } = useRegister()
    const { mutateAsync: sendOtp, isPending: isSendingOtp } = useSendOtp()
    const { mutateAsync: verifyOtp, isPending: isVerifyingOtp } = useVerifyOtp()

    // Form fields
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [surname, setSurname] = useState("")

    const startCountdown = (seconds = 60) => {
        setCountdown(seconds)
        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }

    useEffect(() => {
        return () => { if (timerRef.current) clearInterval(timerRef.current) }
    }, [])

    // Reset when modal closes
    useEffect(() => {
        if (!isOpen) {
            setStep('form')
            setOtpValues(['', '', '', '', '', ''])
            setError('')
            setEmail('')
            setPassword('')
            setName('')
            setSurname('')
        }
    }, [isOpen])

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return
        const newValues = [...otpValues]
        newValues[index] = value.slice(-1)
        setOtpValues(newValues)
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus()
        }
    }

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
            const newValues = [...otpValues]
            newValues[index - 1] = ''
            setOtpValues(newValues)
            otpRefs.current[index - 1]?.focus()
        }
    }

    const handleOtpPaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
        const newValues = [...otpValues]
        pasted.split('').forEach((ch, i) => { if (i < 6) newValues[i] = ch })
        setOtpValues(newValues)
        const nextEmpty = newValues.findIndex(v => !v)
        otpRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus()
    }

    const handleFormSubmit = async () => {
        setError("")
        try {
            if (isLogin) {
                await login({ email, password })
                onClose()
            } else {
                if (!name.trim() || !surname.trim() || !email.trim() || !password.trim()) {
                    setError("Bütün xanaları doldurun.")
                    return
                }
                await sendOtp({ email, password, name, surname })
                startCountdown(60)
                setStep('otp')
                setTimeout(() => otpRefs.current[0]?.focus(), 100)
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Xəta baş verdi. Yenidən cəhd edin.")
        }
    }

    const handleVerifyOtp = async () => {
        const code = otpValues.join('')
        if (code.length < 6) {
            setError("Zəhmət olmasa 6 rəqəmli kodu daxil edin.")
            return
        }
        setError("")
        try {
            await verifyOtp({ email, code })
            setStep('success')
        } catch (err: any) {
            setError(err.response?.data?.message || "Kod yanlışdır.")
        }
    }

    const handleResendOtp = async () => {
        if (countdown > 0) return
        setError("")
        try {
            await sendOtp({ email, password, name, surname })
            setOtpValues(['', '', '', '', '', ''])
            startCountdown(60)
            setTimeout(() => otpRefs.current[0]?.focus(), 100)
        } catch (err: any) {
            setError(err.response?.data?.message || "Xəta baş verdi.")
        }
    }

    const handleSuccessLogin = async () => {
        try {
            const loginResp = await authService.login({ email, password })
            const token = loginResp.access_token
            if (token) {
                localStorage.setItem('token', token)
                const user = await authService.getProfile()
                dispatch(setCredentials({ user, token }))
            }
        } catch (e) { /* silent */ }
        onClose()
    }

    const isLoading = isLoginLoading || isRegisterLoading || isSendingOtp || isVerifyingOtp

    return (
        <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className={`fixed top-0 left-0 right-0 h-screen bg-white transform transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">M</span>
                        </div>
                        <span className="font-bold text-lg">Memix</span>
                        <span className="text-xs text-gray-400 hidden sm:block">PRELOVED FASHION</span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Main content */}
                <div className="flex flex-col md:flex-row flex-1 overflow-y-auto">

                    {/* Left promo — hidden on mobile */}
                    <div className="hidden md:flex flex-1 bg-gradient-to-br from-green-400 to-green-500 p-10 flex-col justify-center items-center text-center">
                        <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mb-6">
                            <span className="text-white text-3xl">✈</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-3">-20% ENDİRİM</h2>
                        <p className="text-white/80 text-lg mb-6">İlk sifarişinizə xüsusi endirim</p>
                        <div className="bg-white rounded-full px-6 py-3">
                            <span className="font-bold text-green-600 text-lg tracking-widest">WELCOME</span>
                        </div>
                    </div>

                    {/* Right form */}
                    <div className="flex-1 flex flex-col justify-center p-5 sm:p-8 overflow-y-auto">
                        <div className="max-w-md mx-auto w-full">

                            {/* Mobile promo */}
                            <div className="md:hidden bg-green-50 border border-green-200 rounded-xl p-3 mb-5 text-center">
                                <p className="font-semibold text-green-700 text-sm">🎉 WELCOME kodu ilə ilk sifarişdə -20%</p>
                            </div>

                            {/* ── STEP: FORM ── */}
                            {step === 'form' && (
                                <>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
                                        {isLogin ? 'GİRİŞ' : 'QEYDİYYAT'}
                                    </h3>

                                    {error && (
                                        <div className="p-3 rounded-xl mb-4 text-sm text-center bg-red-50 text-red-600 border border-red-100">
                                            {error}
                                        </div>
                                    )}

                                    <div className="space-y-3 mb-5">
                                        {!isLogin && (
                                            <div className="flex gap-3">
                                                <Input
                                                    type="text"
                                                    placeholder="Ad"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="flex-1 h-12 border-gray-300 rounded-xl"
                                                />
                                                <Input
                                                    type="text"
                                                    placeholder="Soyad"
                                                    value={surname}
                                                    onChange={(e) => setSurname(e.target.value)}
                                                    className="flex-1 h-12 border-gray-300 rounded-xl"
                                                />
                                            </div>
                                        )}

                                        <Input
                                            type="email"
                                            placeholder="Email"
                                            autoComplete="off"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleFormSubmit()}
                                            className="h-12 border-gray-300 rounded-xl"
                                        />

                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Şifrə"
                                                autoComplete="off"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleFormSubmit()}
                                                className="h-12 border-gray-300 rounded-xl pr-12"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {isLogin && (
                                        <div className="text-center mb-4">
                                            <a href="#" className="text-sm text-blue-600 hover:underline">Şifrənizi unutmusunuz?</a>
                                        </div>
                                    )}

                                    <Button
                                        onClick={handleFormSubmit}
                                        disabled={isLoading}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white h-12 rounded-xl font-semibold text-base mb-4 transition-all duration-200"
                                    >
                                        {isLoading
                                            ? 'Yüklənir...'
                                            : isLogin
                                                ? 'Daxil ol'
                                                : 'Kodu Göndər →'}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4444'}/auth/google`}
                                        className="w-full h-12 border border-gray-300 rounded-xl flex items-center justify-center gap-3 mb-5"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z" fill="#4285F4" />
                                            <path d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z" fill="#34A853" />
                                            <path d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z" fill="#FBBC05" />
                                            <path d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z" fill="#EB4335" />
                                        </svg>
                                        Google ilə {isLogin ? 'daxil ol' : 'qeydiyyat'}
                                    </Button>

                                    <p className="text-center text-sm text-gray-500">
                                        {isLogin ? (
                                            <>Hesabınız yoxdur?{" "}
                                                <button onClick={() => { setIsLogin(false); setError('') }} className="text-blue-600 font-semibold hover:underline">
                                                    Qeydiyyatdan keçin.
                                                </button>
                                            </>
                                        ) : (
                                            <>Artıq hesabınız var?{" "}
                                                <button onClick={() => { setIsLogin(true); setError('') }} className="text-blue-600 font-semibold hover:underline">
                                                    Daxil olun.
                                                </button>
                                            </>
                                        )}
                                    </p>
                                </>
                            )}

                            {/* ── STEP: OTP ── */}
                            {step === 'otp' && (
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Mail className="w-8 h-8 text-green-600" />
                                    </div>

                                    <h3 className="text-2xl font-bold mb-2">Email Doğrulama</h3>
                                    <p className="text-gray-500 text-sm mb-1">
                                        <span className="font-semibold text-gray-700">{email}</span> ünvanına
                                    </p>
                                    <p className="text-gray-500 text-sm mb-6">6 rəqəmli təsdiqləmə kodu göndərildi.</p>

                                    {error && (
                                        <div className="p-3 rounded-xl mb-4 text-sm bg-red-50 text-red-600 border border-red-100">
                                            {error}
                                        </div>
                                    )}

                                    {/* OTP Inputs */}
                                    <div className="flex gap-2 sm:gap-3 justify-center mb-6" onPaste={handleOtpPaste}>
                                        {otpValues.map((val, idx) => (
                                            <input
                                                key={idx}
                                                ref={el => { otpRefs.current[idx] = el }}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={val}
                                                onChange={e => handleOtpChange(idx, e.target.value)}
                                                onKeyDown={e => handleOtpKeyDown(idx, e)}
                                                className={`w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-bold border-2 rounded-xl outline-none transition-all duration-200
                                                    ${val ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 bg-gray-50'}
                                                    focus:border-green-500 focus:bg-white focus:shadow-sm`}
                                            />
                                        ))}
                                    </div>

                                    <Button
                                        onClick={handleVerifyOtp}
                                        disabled={isVerifyingOtp || otpValues.join('').length < 6}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white h-12 rounded-xl font-semibold text-base mb-4"
                                    >
                                        {isVerifyingOtp ? 'Yoxlanılır...' : 'Kodu Təsdiqlə'}
                                    </Button>

                                    {/* Resend */}
                                    <div className="flex items-center justify-center gap-2 mb-5">
                                        {countdown > 0 ? (
                                            <p className="text-sm text-gray-400">
                                                Yenidən göndər <span className="font-semibold text-gray-600">{countdown}s</span>
                                            </p>
                                        ) : (
                                            <button
                                                onClick={handleResendOtp}
                                                disabled={isSendingOtp}
                                                className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
                                            >
                                                <RefreshCw className="w-3.5 h-3.5" />
                                                Kodu yenidən göndər
                                            </button>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => { setStep('form'); setOtpValues(['', '', '', '', '', '']); setError('') }}
                                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mx-auto"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Geri qayıt
                                    </button>
                                </div>
                            )}

                            {/* ── STEP: SUCCESS ── */}
                            {step === 'success' && (
                                <div className="text-center py-4">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Hesabınız Yaradıldı!</h3>
                                    <p className="text-gray-500 mb-8">Email adresiniz uğurla təsdiqləndi. İndi Memix-dən istifadə edə bilərsiniz.</p>
                                    <Button
                                        onClick={handleSuccessLogin}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white h-12 rounded-xl font-semibold text-base"
                                    >
                                        Daxil ol
                                    </Button>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {/* Bottom banners */}
                <div className="hidden md:flex shrink-0">
                    <div className="flex-1 h-24 bg-gradient-to-r from-blue-300 to-blue-400 relative overflow-hidden">
                        <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded">
                            <span className="text-sm font-medium">WEAR&SHARE</span>
                            <div className="text-xs text-gray-600">BONUS</div>
                        </div>
                    </div>
                    <div className="flex-1 h-24 bg-gradient-to-r from-gray-700 to-gray-900 relative overflow-hidden flex items-center justify-center">
                        <div className="text-center text-white">
                            <div className="text-3xl font-bold">CBB</div>
                            <div className="text-xs">Yenisini başlat</div>
                        </div>
                    </div>
                    <div className="flex-1 h-24 bg-gradient-to-r from-green-300 to-green-400 relative overflow-hidden">
                        <div className="absolute top-3 right-3 bg-black text-white px-3 py-1 rounded text-sm">50%-ə qədər</div>
                        <div className="absolute bottom-3 left-3 text-green-800 text-sm font-medium">Wear&Share</div>
                    </div>
                    <div className="flex-1 h-24 bg-gradient-to-r from-gray-200 to-gray-300 relative overflow-hidden">
                        <div className="absolute bottom-3 right-3 text-gray-700 text-sm">Şərtlər</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
