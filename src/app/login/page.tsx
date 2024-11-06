"use client";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";

export default function LoginPage(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("token")) router.push("/");
  }, [router]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-5xl mx-auto p-4 gap-8">
        {/* Left side - Branding and Illustration */}
        <div className="hidden lg:flex flex-col items-center justify-center flex-1 space-y-8">
          <div className="w-48 h-12 relative mb-8">
            <Image
              src="/logo.svg"
              alt="Company Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="w-full h-96 relative">
            <Image
              src="/illustration.svg"
              alt="Login Illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex-1 w-full max-w-md">
          <Card className="w-full">
            <CardHeader className="space-y-1">
              <div className="w-32 h-8 relative mb-4 lg:hidden">
                <Image
                  src="/logo.svg"
                  alt="Company Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <CardTitle className="text-2xl font-bold">Device Login</CardTitle>
              <CardDescription>
                Enter your device credentials to log in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={async (event: FormEvent<HTMLFormElement>) => {
                  event.preventDefault();
                  setLoading(true);
                  const formData = new FormData(event.currentTarget);
                  const deviceId = formData.get("deviceId") as string;
                  const initialPin = formData.get("initialPin") as string;
                  try {
                    const response = await fetch(
                      "https://wifiapi.sustainico.in/device/deviceLogin",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ deviceId, initialPin }),
                      }
                    );
                    const result = await response.json();
                    if (result.jwt) {
                      localStorage.setItem("token", result.jwt);
                      localStorage.setItem("deviceId", deviceId);
                      localStorage.setItem("initialPin", initialPin);
                      toast.success("Login successful");
                      router.push("/");
                    } else {
                      toast.error(result.error || "Login failed. Please try again.");
                    }
                  } catch (error) {
                    toast.error("An error occurred. Please try again later.");
                  } finally {
                    setLoading(false);
                  }
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="deviceId">Device ID</Label>
                  <Input
                    id="deviceId"
                    name="deviceId"
                    placeholder="Enter your device ID"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="initialPin">Device PIN</Label>
                  <Input
                    id="initialPin"
                    name="initialPin"
                    type="password"
                    placeholder="Enter your device PIN"
                    required
                  />
                </div>

                <Button className="w-full" type="submit" disabled={loading}>
                  {loading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Log in
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

