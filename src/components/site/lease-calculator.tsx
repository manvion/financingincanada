"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, cn } from "@/lib/utils";

type Mode = "finance" | "lease";

/**
 * Computes the monthly payment.
 * - Finance (loan): full amortization, residual = 0, you own the asset.
 * - Lease: residual (buyout) is deferred to end of term, lowering the payment.
 */
function computePayment(principal: number, annualRatePct: number, months: number, residualPct: number) {
  const r = annualRatePct / 100 / 12;
  const residual = principal * (residualPct / 100);
  if (principal <= 0 || months <= 0) return { monthly: 0, residual: 0 };
  if (r === 0) return { monthly: (principal - residual) / months, residual };
  const monthly = ((principal - residual * Math.pow(1 + r, -months)) * r) / (1 - Math.pow(1 + r, -months));
  return { monthly, residual };
}

const TERMS = [12, 24, 36, 48, 60, 72, 84];
const RESIDUALS = [
  { label: "$10 Buyout (Lease-to-Own)", value: 0 },
  { label: "10% Residual (FMV)", value: 10 },
  { label: "20% Residual (FMV)", value: 20 },
];

export function LeaseCalculator({
  className,
  defaultAmount = 150000,
}: {
  className?: string;
  defaultAmount?: number;
}) {
  const [mode, setMode] = React.useState<Mode>("finance");
  const [amount, setAmount] = React.useState(Math.round(defaultAmount));
  const [term, setTerm] = React.useState(60);
  const [rate, setRate] = React.useState(8.9);
  const [residualPct, setResidualPct] = React.useState(10);

  const effectiveResidual = mode === "finance" ? 0 : residualPct;
  const { monthly, residual } = computePayment(amount, rate, term, effectiveResidual);
  const totalPayments = monthly * term;
  const totalCost = totalPayments + (mode === "lease" ? residual : 0);
  const financeCost = totalCost - amount;

  return (
    <div className={cn("grid gap-8 lg:grid-cols-[1.1fr_0.9fr]", className)}>
      {/* Inputs */}
      <div className="space-y-7 rounded-2xl border bg-card p-7 shadow-card sm:p-8">
        {/* Mode toggle */}
        <div>
          <Label className="text-sm">I want to</Label>
          <div className="mt-2 grid grid-cols-2 gap-1 rounded-lg border bg-secondary/60 p-1">
            {(["finance", "lease"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={cn(
                  "rounded-md px-4 py-2.5 text-sm font-semibold capitalize transition-all",
                  mode === m ? "bg-card text-navy shadow-sm dark:text-white" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {m === "finance" ? "Finance (Own It)" : "Lease"}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {mode === "finance"
              ? "Amortized loan — you own the equipment outright at the end."
              : "Lower payments — purchase at the residual, renew, or return at term end."}
          </p>
        </div>

        <div>
          <div className="flex items-end justify-between">
            <Label className="text-sm">Equipment Amount</Label>
            <span className="font-display text-lg font-semibold text-foreground">{formatCurrency(amount)}</span>
          </div>
          <input
            type="range"
            min={10000}
            max={1000000}
            step={5000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-3 w-full accent-gold"
          />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>$10K</span>
            <span>$1M</span>
          </div>
          <Input
            type="number"
            value={amount}
            min={0}
            onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
            className="mt-3"
          />
        </div>

        <div>
          <Label className="text-sm">Term Length</Label>
          <div className="mt-3 flex flex-wrap gap-2">
            {TERMS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTerm(t)}
                className={cn(
                  "rounded-md border px-4 py-2 text-sm font-medium transition-colors",
                  term === t ? "border-gold bg-gold text-navy" : "border-border hover:bg-secondary"
                )}
              >
                {t} mo
              </button>
            ))}
          </div>
        </div>

        {mode === "lease" && (
          <div>
            <Label className="text-sm">End-of-Lease Option</Label>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {RESIDUALS.map((res) => (
                <button
                  key={res.value}
                  type="button"
                  onClick={() => setResidualPct(res.value)}
                  className={cn(
                    "rounded-md border px-3 py-2.5 text-xs font-medium leading-tight transition-colors",
                    residualPct === res.value ? "border-gold bg-gold/10 text-gold-700 dark:text-gold" : "border-border hover:bg-secondary"
                  )}
                >
                  {res.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-end justify-between">
            <Label className="text-sm">Estimated Annual Rate</Label>
            <span className="font-display text-lg font-semibold text-foreground">{rate.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min={4}
            max={18}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="mt-3 w-full accent-gold"
          />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>4%</span>
            <span>18%</span>
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="flex flex-col justify-between rounded-2xl bg-navy-gradient p-7 text-white shadow-premium sm:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            {mode === "finance" ? "Estimated Finance Payment" : "Estimated Lease Payment"}
          </p>
          <motion.p
            key={`${mode}-${Math.round(monthly)}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-2 font-display text-5xl font-semibold"
          >
            {formatCurrency(monthly)}
            <span className="text-xl font-normal text-white/55">/mo</span>
          </motion.p>

          <dl className="mt-8 space-y-3 border-t border-white/10 pt-6 text-sm">
            <div className="flex justify-between">
              <dt className="text-white/60">Structure</dt>
              <dd className="font-medium">{mode === "finance" ? "Equipment Loan" : "Equipment Lease"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/60">Term</dt>
              <dd className="font-medium">{term} months</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/60">Total of payments</dt>
              <dd className="font-medium">{formatCurrency(totalPayments)}</dd>
            </div>
            {mode === "lease" && (
              <div className="flex justify-between">
                <dt className="text-white/60">End-of-term buyout</dt>
                <dd className="font-medium">{residual <= 0 ? "$10" : formatCurrency(residual)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-white/60">Est. finance cost</dt>
              <dd className="font-medium">{formatCurrency(financeCost)}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8">
          <Button asChild variant="gold" size="lg" className="w-full">
            <Link href="/apply">
              Get Your Real Rate <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <p className="mt-3 text-center text-xs text-white/50">
            Estimate only. Final rate &amp; terms subject to approval (OAC).
          </p>
        </div>
      </div>
    </div>
  );
}
