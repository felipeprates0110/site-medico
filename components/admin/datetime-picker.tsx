"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"] as const;
const MONTHS = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
] as const;

const HOURS = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, "0")
);
const MINUTES = ["00", "15", "30", "45"] as const;

type DateTimePickerProps = {
  id?: string;
  value: string; // YYYY-MM-DDTHH:mm
  onChange: (value: string) => void;
  placeholder?: string;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function parseValue(value: string) {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!match) return null;
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: match[4],
    minute: match[5],
  };
}

function toValue(
  year: number,
  month: number,
  day: number,
  hour: string,
  minute: string
) {
  return `${year}-${pad(month)}-${pad(day)}T${hour}:${minute}`;
}

function formatDisplayParts(value: string) {
  const parsed = parseValue(value);
  if (!parsed) return null;
  return {
    date: `${pad(parsed.day)}/${pad(parsed.month)}/${parsed.year}`,
    time: `${parsed.hour}:${parsed.minute}`,
  };
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function startWeekday(year: number, month: number) {
  // 0 = domingo
  return new Date(year, month - 1, 1).getDay();
}

/**
 * Seletor de data/hora customizado para o admin.
 * Analogia: em vez do calendário genérico do navegador, uma agenda da clínica —
 * clara, em português e com horário fácil de escolher.
 */
export function DateTimePicker({
  id,
  value,
  onChange,
  placeholder = "Escolher data e hora",
}: DateTimePickerProps) {
  const parsed = parseValue(value);
  const now = new Date();
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(
    parsed?.year ?? now.getFullYear()
  );
  const [viewMonth, setViewMonth] = useState(
    parsed?.month ?? now.getMonth() + 1
  );
  const [selectedDay, setSelectedDay] = useState<number | null>(
    parsed?.day ?? null
  );
  const [hour, setHour] = useState(parsed?.hour ?? "08");
  const [minute, setMinute] = useState(
    MINUTES.includes((parsed?.minute ?? "") as (typeof MINUTES)[number])
      ? (parsed?.minute as string)
      : "00"
  );
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const next = parseValue(value);
    if (!next) return;
    setViewYear(next.year);
    setViewMonth(next.month);
    setSelectedDay(next.day);
    setHour(next.hour);
    setMinute(
      MINUTES.includes(next.minute as (typeof MINUTES)[number])
        ? next.minute
        : "00"
    );
  }, [value]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const grid = useMemo(() => {
    const total = daysInMonth(viewYear, viewMonth);
    const offset = startWeekday(viewYear, viewMonth);
    const cells: Array<number | null> = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let d = 1; d <= total; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [viewYear, viewMonth]);

  const commit = (day: number, nextHour = hour, nextMinute = minute) => {
    setSelectedDay(day);
    onChange(toValue(viewYear, viewMonth, day, nextHour, nextMinute));
  };

  const ensureDay = () => {
    if (selectedDay) return selectedDay;
    const t = new Date();
    const day =
      viewYear === t.getFullYear() && viewMonth === t.getMonth() + 1
        ? t.getDate()
        : 1;
    setSelectedDay(day);
    return day;
  };

  const goMonth = (delta: number) => {
    const date = new Date(viewYear, viewMonth - 1 + delta, 1);
    setViewYear(date.getFullYear());
    setViewMonth(date.getMonth() + 1);
  };

  const selectToday = () => {
    const t = new Date();
    setViewYear(t.getFullYear());
    setViewMonth(t.getMonth() + 1);
    setSelectedDay(t.getDate());
    commit(t.getDate());
  };

  const clear = () => {
    setSelectedDay(null);
    onChange("");
  };

  const isToday = (day: number) =>
    day === now.getDate() &&
    viewMonth === now.getMonth() + 1 &&
    viewYear === now.getFullYear();

  const isSelected = (day: number) => {
    if (selectedDay !== day) return false;
    if (!parsed) return true;
    return parsed.year === viewYear && parsed.month === viewMonth;
  };

  const display = value ? formatDisplayParts(value) : null;

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex min-h-14 w-full items-center gap-3 rounded-xl border bg-white px-3 py-2.5 text-left text-sm transition-all",
          "border-primary-200 hover:border-primary-300 hover:bg-primary-50/40",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2",
          open && "border-primary-400 ring-2 ring-primary-100"
        )}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
          <CalendarDays className="h-4 w-4" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 leading-snug">
          {display ? (
            <>
              <span className="font-medium text-gray-900">{display.date}</span>
              <span className="flex flex-wrap items-center gap-x-1.5 text-[12px] text-gray-600">
                <span className="inline-flex items-center gap-1 font-semibold tabular-nums text-primary-800">
                  <Clock className="h-3 w-3 shrink-0" />
                  {display.time}
                </span>
                <span className="text-gray-400">· Brasília</span>
              </span>
            </>
          ) : (
            <>
              <span className="text-gray-500">{placeholder}</span>
              <span className="text-[11px] leading-none text-gray-400">
                Horário de Brasília
              </span>
            </>
          )}
        </span>
        {value ? (
          <span
            role="button"
            tabIndex={0}
            className="shrink-0 rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              clear();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                clear();
              }
            }}
            aria-label="Limpar data"
          >
            <X className="h-4 w-4" />
          </span>
        ) : null}
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-900/10">
          {/* Cabeçalho do mês */}
          <div className="flex items-center justify-between border-b border-gray-100 px-3 py-3">
            <button
              type="button"
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              onClick={() => goMonth(-1)}
              aria-label="Mês anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <p className="text-sm font-semibold capitalize text-gray-900">
              {MONTHS[viewMonth - 1]} de {viewYear}
            </p>
            <button
              type="button"
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              onClick={() => goMonth(1)}
              aria-label="Próximo mês"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="p-3">
            {/* Dias da semana */}
            <div className="mb-2 grid grid-cols-7 gap-1">
              {WEEKDAYS.map((label, i) => (
                <div
                  key={`${label}-${i}`}
                  className="py-1 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-400"
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Grade de dias */}
            <div className="grid grid-cols-7 gap-1">
              {grid.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} className="h-9" />;
                }
                const selected = isSelected(day);
                const today = isToday(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      setSelectedDay(day);
                      commit(day);
                    }}
                    className={cn(
                      "h-9 rounded-xl text-sm font-medium transition-colors",
                      selected
                        ? "bg-primary-600 text-white shadow-sm shadow-primary-600/30"
                        : today
                          ? "bg-primary-50 text-primary-800 ring-1 ring-primary-200"
                          : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Horário */}
            <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50/80 p-3">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <Clock className="h-3.5 w-3.5" />
                Horário
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="space-y-1">
                  <span className="text-[11px] text-gray-500">Hora</span>
                  <select
                    value={hour}
                    onChange={(e) => {
                      const next = e.target.value;
                      setHour(next);
                      commit(ensureDay(), next, minute);
                    }}
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-2 text-sm font-medium text-gray-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  >
                    {HOURS.map((h) => (
                      <option key={h} value={h}>
                        {h}h
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="text-[11px] text-gray-500">Minutos</span>
                  <div className="grid grid-cols-4 gap-1">
                    {MINUTES.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          setMinute(m);
                          commit(ensureDay(), hour, m);
                        }}
                        className={cn(
                          "h-10 rounded-lg text-xs font-semibold transition-colors",
                          minute === m
                            ? "bg-primary-600 text-white"
                            : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                        )}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[auto_1fr_1fr] items-center gap-1.5 border-t border-gray-100 bg-gray-50/60 px-3 py-2.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="px-2.5"
              onClick={clear}
            >
              Limpar
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="px-2"
              onClick={selectToday}
            >
              Hoje
            </Button>
            <Button
              type="button"
              size="sm"
              className="px-2"
              onClick={() => setOpen(false)}
              disabled={!value}
            >
              Confirmar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
