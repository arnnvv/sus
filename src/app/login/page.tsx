"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Icons } from "@/components/ui/icons";

export default function LoginPage(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const token = localStorage.getItem("token");
  if (token) router.push("/");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Device Login
          </CardTitle>
          <CardDescription className="text-center">
            Enter your device credentials to log in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={async (event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              setLoading(true);
              setError(null);

              const formData = new FormData(event.currentTarget);
              const deviceId = formData.get("deviceId") as string;
              const initialPin = formData.get("initialPin") as string;

              try {
                const response = await fetch(
                  "https://localhost:8443/device/deviceLogin",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ deviceId, initialPin }),
                  },
                );

                const result = await response.json();

                if (result.jwt) {
                  localStorage.setItem("token", result.jwt);
                  localStorage.setItem("deviceId", deviceId);
                  localStorage.setItem("initialPin", initialPin);
                  router.push("/");
                } else {
                  setError(result.error || "Login failed. Please try again.");
                }
              } catch (error) {
                setError("An error occurred. Please try again later.");
              } finally {
                setLoading(false);
              }
            }}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deviceId">Device ID</Label>
                <Input id="deviceId" name="deviceId" type="text" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="initialPin">Device PIN</Label>
                <Input
                  id="initialPin"
                  name="initialPin"
                  type="password"
                  required
                />
              </div>
            </div>
            <Button className="w-full mt-6" type="submit" disabled={loading}>
              {loading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Log in
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}