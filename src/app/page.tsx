"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Droplet, CalendarDays, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Component(): JSX.Element {
  const [timeFilter, setTimeFilter] = useState("day");
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState({ labels: [], data: [] });
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedDeviceId = localStorage.getItem("deviceId");
    if (!token) router.push("/login");
    else {
      setIsLoggedIn(true);
      if (storedDeviceId) setDeviceId(storedDeviceId);
    }
  }, [router]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://localhost:8443/newWaterReading2/latest",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              deviceId: deviceId,
              timeFilter,
              targetDate: format(date, "yyyy-MM-dd"),
            }),
          },
        );

        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [timeFilter, date, deviceId]);

  const chartData =
    data.labels?.map((label, index) => ({
      name: label,
      value: data.data[index],
    })) || [];

  const renderDateSelector = () => {
    switch (timeFilter) {
      case "day":
        return (
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="rounded-md border bg-white"
          />
        );
      case "month":
        return (
          <Select
            value={date.getMonth().toString()}
            onValueChange={(value) =>
              setDate(new Date(date.getFullYear(), parseInt(value), 1))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              <div className="max-h-[200px] overflow-y-auto">
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {format(new Date(2000, i, 1), "MMMM")}
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
        );
      case "year":
        return (
          <Select
            value={date.getFullYear().toString()}
            onValueChange={(value) => setDate(new Date(parseInt(value), 0, 1))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2].map((yearOffset) => {
                const year = new Date().getFullYear() - yearOffset;
                return (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Navigation */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-blue-900">
            DeviceId: {deviceId}
          </h1>
          {isLoggedIn && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("deviceId");
                  localStorage.removeItem("initialPin");
                  toast.success("Logged out");
                  router.push("/login");
                }}
                variant="outline"
                className="flex items-center gap-2 bg-white/90 hover:bg-white"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </motion.div>
          )}
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Card className="backdrop-blur-md bg-white/90 shadow-xl">
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-medium">Time Range</label>
                    <Tabs
                      value={timeFilter}
                      onValueChange={setTimeFilter}
                      className="w-full"
                    >
                      <TabsList className="grid grid-cols-3 w-full">
                        <TabsTrigger value="day">Day</TabsTrigger>
                        <TabsTrigger value="month">Month</TabsTrigger>
                        <TabsTrigger value="year">Year</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </motion.div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${timeFilter}-${date}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="h-96"
                    >
                      {loading ? (
                        <div className="h-full w-full flex items-center justify-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-12 h-12"
                          >
                            <Droplet className="w-full h-full text-blue-500" />
                          </motion.div>
                        </div>
                      ) : (
                        <ResponsiveContainer>
                          <LineChart data={chartData}>
                            <defs>
                              <linearGradient
                                id="colorGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#3B82F6"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#3B82F6"
                                  stopOpacity={0.2}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              opacity={0.1}
                            />
                            <XAxis
                              dataKey="name"
                              stroke="#6B7280"
                              fontSize={12}
                              tickLine={false}
                            />
                            <YAxis
                              stroke="#6B7280"
                              fontSize={12}
                              tickLine={false}
                              unit=" L"
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "rgba(255, 255, 255, 0.9)",
                                border: "none",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke="#3B82F6"
                              strokeWidth={2}
                              dot={{ fill: "#3B82F6", strokeWidth: 2 }}
                              activeDot={{
                                r: 6,
                                fill: "#3B82F6",
                                strokeWidth: 2,
                                stroke: "#fff",
                              }}
                              fill="url(#colorGradient)"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Select
                  </label>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    {renderDateSelector()}
                  </motion.div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <Card className="bg-blue-50">
                  <CardContent className="p-4">
                    <div className="text-sm font-medium">Total Consumption</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {data.data?.reduce((a, b) => a + b, 0).toFixed(2)} L
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50">
                  <CardContent className="p-4">
                    <div className="text-sm font-medium">Average Usage</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {(
                        data.data?.reduce((a, b) => a + b, 0) /
                        (data.data?.length || 1)
                      ).toFixed(2)}{" "}
                      L
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50">
                  <CardContent className="p-4">
                    <div className="text-sm font-medium">Peak Usage</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.max(...(data.data || [0])).toFixed(2)} L
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
