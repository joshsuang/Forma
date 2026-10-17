import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const colors = [
  { name: "background", className: "bg-background", role: "Page background" },
  { name: "surface", className: "bg-surface", role: "Cards and fields" },
  {
    name: "surface-subtle",
    className: "bg-surface-subtle",
    role: "Hover and muted fills",
  },
  { name: "primary", className: "bg-primary", role: "Primary actions" },
  {
    name: "success",
    className: "bg-success",
    role: "Completion and progress",
  },
  { name: "destructive", className: "bg-destructive", role: "Destructive actions" },
  { name: "border", className: "bg-border", role: "Subtle borders" },
  {
    name: "muted-foreground",
    className: "bg-muted-foreground",
    role: "Secondary text",
  },
];

const typography = [
  {
    name: "text-page-title",
    role: "Page titles",
    sample: "Your habits",
    className: "text-page-title",
  },
  {
    name: "text-section-title",
    role: "Section headings",
    sample: "Today",
    className: "text-section-title",
  },
  {
    name: "text-card-title",
    role: "Card titles",
    sample: "Morning stretch",
    className: "text-card-title",
  },
  {
    name: "text-stat",
    role: "Main statistics",
    sample: "86%",
    className: "text-stat",
  },
  {
    name: "text-label",
    role: "Secondary labels",
    sample: "CURRENT STREAK",
    className: "text-label text-muted-foreground",
  },
  {
    name: "text-body",
    role: "Body text",
    sample: "A calm place to track habits and understand progress.",
    className: "text-body",
  },
  {
    name: "text-caption",
    role: "Supporting descriptions",
    sample: "Last updated 2 minutes ago",
    className: "text-caption text-muted-foreground",
  },
];

export default function DesignPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-page-title">Design system</h1>
          <p className="mt-2 max-w-md text-body text-muted-foreground">
            Shared tokens and reusable components for Forma. This reference
            page is used to review both themes at desktop and mobile sizes.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <section aria-labelledby="colors-heading" className="mt-12">
        <h2 id="colors-heading" className="text-section-title">
          Color tokens
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {colors.map((color) => (
            <div
              key={color.name}
              className="overflow-hidden rounded-card border border-border bg-surface shadow-card"
            >
              <div className={`h-12 w-full ${color.className}`} />
              <div className="px-3 py-2">
                <p className="text-label">{color.name}</p>
                <p className="text-caption text-muted-foreground">
                  {color.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="type-heading" className="mt-12">
        <h2 id="type-heading" className="text-section-title">
          Typography
        </h2>
        <div className="mt-4 divide-y divide-border rounded-card border border-border bg-surface shadow-card">
          {typography.map((item) => (
            <div
              key={item.name}
              className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
            >
              <p className={item.className}>{item.sample}</p>
              <p className="text-caption whitespace-nowrap text-muted-foreground">
                {item.name} · {item.role}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="buttons-heading" className="mt-12">
        <h2 id="buttons-heading" className="text-section-title">
          Buttons
        </h2>
        <Card className="mt-4">
          <CardContent className="flex flex-wrap items-center gap-3 pt-5">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Delete</Button>
            <Button disabled>Disabled</Button>
            <Button size="sm">Small</Button>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="cards-heading" className="mt-12">
        <h2 id="cards-heading" className="text-section-title">
          Cards
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Morning stretch</CardTitle>
              <p className="text-caption text-muted-foreground">
                Personal · 10 minutes
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-body text-muted-foreground">
                Compact surfaces with subtle borders, restrained shadows, and a
                consistent corner radius.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Today&rsquo;s progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-stat">86%</p>
              <p className="mt-1 text-body text-muted-foreground">
                6 of 7 habits completed
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section aria-labelledby="inputs-heading" className="mt-12">
        <h2 id="inputs-heading" className="text-section-title">
          Inputs
        </h2>
        <Card className="mt-4">
          <CardContent className="flex flex-col gap-4 pt-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="habit-name">Habit name</Label>
              <Input id="habit-name" placeholder="Read" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="habit-notes">Notes</Label>
              <Textarea id="habit-notes" placeholder="Optional description" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="habit-disabled">Disabled</Label>
              <Input id="habit-disabled" value="Take vitamins" disabled readOnly />
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
