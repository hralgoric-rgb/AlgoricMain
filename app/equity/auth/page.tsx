"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  FaGoogle, 
  FaFacebook, 
  FaEye, 
  FaEyeSlash, 
  FaArrowLeft,
  FaShieldAlt,
  FaLock
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EquityNavbar from "../components/EquityNavbar";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle authentication logic here
    console.log("Form submitted:", formData);
  };

  const socialLogin = (provider: string) => {
    // Handle social login
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      <EquityNavbar />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pt-20">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full opacity-10"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 2, 1]
            }}
            transition={{
              duration: 4 + i * 0.3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Back Button */}
          <Link href="/equity" className="inline-flex items-center text-orange-500 hover:text-orange-400 mb-8 transition-colors">
            <FaArrowLeft className="mr-2 w-4 h-4" />
            Back to Home
          </Link>

          <Card className="bg-gray-800/80 border-gray-700 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
                  Welcome to
                </span>
                <br />
                <span className="text-white">Equity Investment</span>
              </CardTitle>
              <p className="text-gray-300 mt-2">
                Start your real estate investment journey
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <Tabs value={isLogin ? "login" : "register"} onValueChange={(value) => setIsLogin(value === "login")}>
                <TabsList className="grid w-full grid-cols-2 bg-gray-700">
                  <TabsTrigger value="login" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="register" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                    Register
                  </TabsTrigger>
                </TabsList>

                {/* Login Form */}
                <TabsContent value="login">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500"
                        >
                          {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" />
                        <Label htmlFor="remember" className="text-sm text-gray-300">
                          Remember me
                        </Label>
                      </div>
                      <Link href="/equity/auth/forgot-password" className="text-sm text-orange-500 hover:text-orange-400">
                        Forgot password?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-6 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <FaLock className="mr-2 w-4 h-4" />
                      Sign In
                    </Button>
                  </form>
                </TabsContent>

                {/* Register Form */}
                <TabsContent value="register">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-white">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500"
                        >
                          {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500"
                        >
                          {showConfirmPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="agreeTerms" 
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeTerms: checked as boolean }))}
                      />
                      <Label htmlFor="agreeTerms" className="text-sm text-gray-300 leading-5">
                        I agree to the{" "}
                        <Link href="/equity/terms" className="text-orange-500 hover:text-orange-400">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/equity/privacy" className="text-orange-500 hover:text-orange-400">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      disabled={!formData.agreeTerms}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-6 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaShieldAlt className="mr-2 w-4 h-4" />
                      Create Account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Social Login */}
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-gray-800 px-4 text-gray-400">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => socialLogin("google")}
                    className="border-gray-600 hover:bg-gray-700 text-white"
                  >
                    <FaGoogle className="mr-2 w-4 h-4 text-red-500" />
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => socialLogin("facebook")}
                    className="border-gray-600 hover:bg-gray-700 text-white"
                  >
                    <FaFacebook className="mr-2 w-4 h-4 text-blue-500" />
                    Facebook
                  </Button>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-gray-700/50 rounded-lg p-4 mt-6">
                <div className="flex items-center text-orange-500 mb-2">
                  <FaShieldAlt className="w-4 h-4 mr-2" />
                  <span className="text-sm font-semibold">Secure & Protected</span>
                </div>
                <p className="text-xs text-gray-300">
                  Your data is encrypted and protected with bank-level security. We never share your information with third parties.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
