import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { format, differenceInDays, addDays } from "date-fns";
import { CalendarIcon, Shield, Clock, AlertCircle, Loader2 } from "lucide-react";

export default function RentalBookingForm({ product, onSubmit, isSubmitting }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const duration = useMemo(() => {
    if (!startDate || !endDate) return 0;
    return differenceInDays(endDate, startDate) + 1;
  }, [startDate, endDate]);

  const pricing = useMemo(() => {
    if (!duration || duration < 1) return null;
    let model = "daily";
    let rate = product.daily_rate;
    let cost;

    if (duration >= 30 && product.monthly_rate) {
      model = "monthly";
      const months = Math.floor(duration / 30);
      const remainingDays = duration % 30;
      cost = months * product.monthly_rate + remainingDays * product.daily_rate;
    } else if (duration >= 7 && product.weekly_rate) {
      model = "weekly";
      const weeks = Math.floor(duration / 7);
      const remainingDays = duration % 7;
      cost = weeks * product.weekly_rate + remainingDays * product.daily_rate;
    } else {
      cost = duration * product.daily_rate;
    }

    return {
      model,
      cost: Math.round(cost * 100) / 100,
      deposit: product.deposit_amount || 0,
      total: Math.round((cost + (product.deposit_amount || 0)) * 100) / 100,
    };
  }, [duration, product]);

  const minDate = addDays(new Date(), 1);
  const isValid = startDate && endDate && duration >= (product.min_rental_days || 1) && duration <= (product.max_rental_days || 90);
  const isAvailable = product.available_stock > 0;

  const handleSubmit = () => {
    if (!isValid || !pricing) return;
    onSubmit({
      start_date: format(startDate, "yyyy-MM-dd"),
      end_date: format(endDate, "yyyy-MM-dd"),
      duration_days: duration,
      pricing_model: pricing.model,
      rental_cost: pricing.cost,
      deposit_amount: pricing.deposit,
      total_amount: pricing.total,
    });
  };

  return (
    <div className="rounded-xl border bg-card p-6 sticky top-24">
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-3xl font-bold text-primary">${product.daily_rate}</span>
        <span className="text-muted-foreground">/ day</span>
      </div>
      {product.weekly_rate && (
        <p className="text-sm text-muted-foreground">${product.weekly_rate}/wk · ${product.monthly_rate || "–"}/mo</p>
      )}

      <Separator className="my-5" />

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Start Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "MMM d, yyyy") : "Select start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(d) => {
                  setStartDate(d);
                  if (endDate && d >= endDate) setEndDate(null);
                }}
                disabled={(date) => date < minDate}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">End Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "MMM d, yyyy") : "Select end date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                disabled={(date) => date < (startDate ? addDays(startDate, (product.min_rental_days || 1) - 1) : minDate)}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {duration > 0 && pricing && (
        <div className="mt-5 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{duration} days ({pricing.model} rate)</span>
            <span>${pricing.cost.toFixed(2)}</span>
          </div>
          {pricing.deposit > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <Shield className="w-3 h-3" /> Refundable deposit
              </span>
              <span>${pricing.deposit.toFixed(2)}</span>
            </div>
          )}
          <Separator className="my-2" />
          <div className="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>${pricing.total.toFixed(2)}</span>
          </div>
        </div>
      )}

      {product.late_fee_per_day > 0 && (
        <p className="text-xs text-muted-foreground mt-3 flex items-start gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          Late return fee: ${product.late_fee_per_day}/day
        </p>
      )}

      <Button
        className="w-full mt-5 h-12 text-base rounded-xl"
        disabled={!isValid || !isAvailable || isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
        ) : !isAvailable ? (
          "Currently Unavailable"
        ) : (
          "Book Rental"
        )}
      </Button>

      <div className="mt-4 flex items-center gap-4 justify-center text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Insured</span>
        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Free cancellation</span>
      </div>
    </div>
  );
}