import React from "react";
import { motion } from "framer-motion";
import { Search, CalendarCheck, Truck, RotateCcw } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse & Choose",
    description: "Explore our catalog and find the perfect product for your needs.",
  },
  {
    icon: CalendarCheck,
    title: "Book Your Dates",
    description: "Select your rental period with flexible daily, weekly, or monthly rates.",
  },
  {
    icon: Truck,
    title: "Receive & Enjoy",
    description: "Get your rental delivered or pick it up. Use it for as long as you need.",
  },
  {
    icon: RotateCcw,
    title: "Return Easily",
    description: "Send it back when you're done. Your deposit is refunded upon return.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-muted/50 border-y">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">How It Works</h2>
          <p className="text-muted-foreground mt-2">Renting made simple in 4 easy steps</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-xs font-semibold text-primary mb-2">Step {i + 1}</div>
              <h3 className="font-semibold mb-1">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}