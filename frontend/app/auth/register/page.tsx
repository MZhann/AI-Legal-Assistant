"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth";
import { Scale, Loader2, Mail, Lock, Eye, EyeOff, User, Hash, Calendar } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth, setLoading, isLoading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    fatherName: "",
    age: "",
    iin: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Құпия сөздер сәйкес келмейді / Пароли не совпадают");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Құпия сөз кемінде 6 таңба болуы керек / Пароль минимум 6 символов");
      return false;
    }
    if (!/^\d{12}$/.test(formData.iin)) {
      setError("ИИН 12 саннан тұруы керек / ИИН должен содержать 12 цифр");
      return false;
    }
    const age = parseInt(formData.age);
    if (age < 18 || age > 120) {
      setError("Жас 18-ден 120-ға дейін болуы керек / Возраст от 18 до 120");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await authService.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        fatherName: formData.fatherName || undefined,
        age: parseInt(formData.age),
        iin: formData.iin,
      });
      
      if (response.success && response.data) {
        setAuth(response.data.user, response.data.token);
        router.push("/profile");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Тіркелу қатесі / Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500/20 to-gold-500/20 border border-primary-500/30 flex items-center justify-center">
              <Scale className="w-7 h-7 text-primary-400" />
            </div>
          </div>
          <CardTitle className="text-2xl">Тіркелу / Регистрация</CardTitle>
          <p className="text-slate-400 text-sm mt-2">
            Жаңа аккаунт құру / Создать аккаунт
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Name fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Тегі / Фамилия *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    name="lastName"
                    placeholder="Иванов"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Аты / Имя *</label>
                <Input
                  name="firstName"
                  placeholder="Иван"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">Әкесінің аты / Отчество</label>
              <Input
                name="fatherName"
                placeholder="Петрович (міндетті емес / необязательно)"
                value={formData.fatherName}
                onChange={handleChange}
              />
            </div>

            {/* Age and IIN */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Жасы / Возраст *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    name="age"
                    type="number"
                    placeholder="25"
                    min="18"
                    max="120"
                    value={formData.age}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">ИИН *</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    name="iin"
                    placeholder="123456789012"
                    maxLength={12}
                    value={formData.iin}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  name="email"
                  type="email"
                  placeholder="example@mail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Құпия сөз / Пароль *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Қайталау / Повторите *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Жүктелуде...
                </>
              ) : (
                "Тіркелу / Зарегистрироваться"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            Аккаунт бар ма?{" "}
            <Link href="/auth/login" className="text-primary-400 hover:text-primary-300">
              Кіру / Войти
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

