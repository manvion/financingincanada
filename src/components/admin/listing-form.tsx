"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUploader, type UploadedImage } from "@/components/admin/image-uploader";
import { useToast } from "@/hooks/use-toast";
import { listingSchema, type ListingInput } from "@/lib/validations";
import { estimateMonthlyPayment, slugify } from "@/lib/utils";
import { PROVINCES } from "@/lib/constants";

type Category = { id: string; name: string };

export function ListingForm({
  categories,
  initial,
  listingId,
}: {
  categories: Category[];
  initial?: Partial<ListingInput> & { images?: UploadedImage[] };
  listingId?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [images, setImages] = React.useState<UploadedImage[]>(initial?.images ?? []);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ListingInput>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: initial?.title ?? "",
      slug: initial?.slug ?? "",
      description: initial?.description ?? "",
      categoryId: initial?.categoryId ?? "",
      price: initial?.price ?? undefined,
      monthlyPayment: initial?.monthlyPayment ?? undefined,
      condition: initial?.condition ?? "USED",
      province: initial?.province ?? "ON",
      city: initial?.city ?? "",
      year: initial?.year ?? undefined,
      make: initial?.make ?? "",
      model: initial?.model ?? "",
      status: initial?.status ?? "DRAFT",
      featured: initial?.featured ?? false,
      metaTitle: initial?.metaTitle ?? "",
      metaDescription: initial?.metaDescription ?? "",
      specifications: initial?.specifications ?? [{ label: "", value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "specifications" });
  const price = watch("price");

  async function onSubmit(values: ListingInput) {
    const payload = {
      ...values,
      images,
      specifications: values.specifications?.filter((s) => s.label && s.value),
    };
    const url = listingId ? `/api/admin/listings/${listingId}` : "/api/admin/listings";
    const method = listingId ? "PATCH" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
      toast({ variant: "success", title: listingId ? "Listing updated" : "Listing created" });
      router.push("/admin/listings");
      router.refresh();
    } catch (err) {
      toast({ variant: "destructive", title: "Save failed", description: err instanceof Error ? err.message : "" });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card title="Details">
          <FieldRow>
            <Field label="Title" error={errors.title?.message} required full>
              <Input
                {...register("title")}
                onBlur={(e) => {
                  if (!watch("slug")) setValue("slug", slugify(e.target.value));
                }}
                placeholder="2021 Caterpillar 320 Excavator"
              />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label="Slug" error={errors.slug?.message} full>
              <Input {...register("slug")} placeholder="auto-generated-from-title" />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label="Description" error={errors.description?.message} required full>
              <Textarea rows={5} {...register("description")} placeholder="Describe the equipment, condition, and highlights…" />
            </Field>
          </FieldRow>
        </Card>

        <Card title="Specifications">
          <div className="space-y-3">
            {fields.map((field, i) => (
              <div key={field.id} className="flex gap-2">
                <Input placeholder="Label (e.g. Hours)" {...register(`specifications.${i}.label`)} />
                <Input placeholder="Value (e.g. 2,140)" {...register(`specifications.${i}.value`)} />
                <button type="button" onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive" aria-label="Remove spec">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => append({ label: "", value: "" })}>
            <Plus className="h-4 w-4" /> Add specification
          </Button>
        </Card>

        <Card title="Images">
          <ImageUploader value={images} onChange={setImages} />
        </Card>

        <Card title="SEO">
          <FieldRow>
            <Field label="Meta Title" full><Input {...register("metaTitle")} placeholder="Custom title for search engines" /></Field>
          </FieldRow>
          <FieldRow>
            <Field label="Meta Description" full><Textarea rows={2} {...register("metaDescription")} placeholder="155-character summary" /></Field>
          </FieldRow>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <Card title="Publishing">
          <Field label="Status" error={errors.status?.message}>
            <SelectField name="status" value={watch("status")} onChange={(v) => setValue("status", v as ListingInput["status"])} options={[
              { value: "DRAFT", label: "Draft" },
              { value: "PUBLISHED", label: "Published" },
              { value: "UNPUBLISHED", label: "Unpublished" },
              { value: "SOLD", label: "Sold" },
            ]} />
          </Field>
          <div className="mt-4 flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Featured</p>
              <p className="text-xs text-muted-foreground">Show on homepage</p>
            </div>
            <Switch checked={watch("featured")} onCheckedChange={(v) => setValue("featured", v)} />
          </div>
        </Card>

        <Card title="Pricing & Category">
          <Field label="Category" error={errors.categoryId?.message} required>
            <SelectField
              name="categoryId"
              value={watch("categoryId")}
              onChange={(v) => setValue("categoryId", v)}
              placeholder="Select category"
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />
          </Field>
          <Field label="Price (CAD)" error={errors.price?.message} required>
            <Input type="number" step="0.01" {...register("price")} placeholder="285000" />
          </Field>
          <Field label="Monthly Payment (CAD)" error={errors.monthlyPayment?.message}>
            <div className="flex gap-2">
              <Input type="number" step="0.01" {...register("monthlyPayment")} placeholder="Optional" />
              <Button
                type="button"
                variant="outline"
                size="icon"
                title="Estimate from price"
                onClick={() => price && setValue("monthlyPayment", estimateMonthlyPayment(Number(price)))}
              >
                <Wand2 className="h-4 w-4" />
              </Button>
            </div>
          </Field>
          <Field label="Condition">
            <SelectField name="condition" value={watch("condition")} onChange={(v) => setValue("condition", v as "NEW" | "USED")} options={[
              { value: "NEW", label: "New" },
              { value: "USED", label: "Used" },
            ]} />
          </Field>
        </Card>

        <Card title="Location & Identity">
          <Field label="Province">
            <SelectField name="province" value={watch("province")} onChange={(v) => setValue("province", v as ListingInput["province"])} options={PROVINCES} />
          </Field>
          <Field label="City"><Input {...register("city")} placeholder="Mississauga" /></Field>
          <div className="grid grid-cols-3 gap-2">
            <Field label="Year"><Input type="number" {...register("year")} placeholder="2021" /></Field>
            <Field label="Make"><Input {...register("make")} placeholder="Cat" /></Field>
            <Field label="Model"><Input {...register("model")} placeholder="320" /></Field>
          </div>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" variant="gold" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : listingId ? "Update Listing" : "Create Listing"}
          </Button>
        </div>
      </div>
    </form>
  );
}

// ── small helpers ─────────────────────────────────────────────

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-card">
      <h3 className="font-display text-base font-bold">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4">{children}</div>;
}

function Field({
  label,
  error,
  required,
  full,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? "space-y-1.5" : "mb-4 space-y-1.5 last:mb-0"}>
      <Label className="flex items-center gap-1">
        {label}
        {required && <span className="text-gold">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function SelectField({
  value,
  onChange,
  options,
  placeholder,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger><SelectValue placeholder={placeholder ?? "Select"} /></SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
