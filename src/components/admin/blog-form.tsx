"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUploader, type UploadedImage } from "@/components/admin/image-uploader";
import { useToast } from "@/hooks/use-toast";
import { blogSchema, type BlogInput } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { BLOG_CATEGORIES } from "@/lib/constants";

export function BlogForm({
  initial,
  blogId,
}: {
  initial?: Partial<BlogInput> & { coverImage?: string };
  blogId?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [cover, setCover] = React.useState<UploadedImage[]>(
    initial?.coverImage ? [{ url: initial.coverImage }] : []
  );
  const [tagsInput, setTagsInput] = React.useState((initial?.tags ?? []).join(", "));

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BlogInput>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: initial?.title ?? "",
      slug: initial?.slug ?? "",
      excerpt: initial?.excerpt ?? "",
      content: initial?.content ?? "",
      category: initial?.category ?? BLOG_CATEGORIES[0],
      status: initial?.status ?? "DRAFT",
      featured: initial?.featured ?? false,
      readMinutes: initial?.readMinutes ?? 5,
      metaTitle: initial?.metaTitle ?? "",
      metaDescription: initial?.metaDescription ?? "",
      tags: initial?.tags ?? [],
      publishedAt: initial?.publishedAt ?? "",
    },
  });

  const status = watch("status");

  async function onSubmit(values: BlogInput) {
    const payload = {
      ...values,
      coverImage: cover[0]?.url ?? "",
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
    };
    const url = blogId ? `/api/admin/blog/${blogId}` : "/api/admin/blog";
    try {
      const res = await fetch(url, {
        method: blogId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
      toast({ variant: "success", title: blogId ? "Post updated" : "Post created" });
      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      toast({ variant: "destructive", title: "Save failed", description: err instanceof Error ? err.message : "" });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card title="Content">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Title <span className="text-gold">*</span></Label>
              <Input
                {...register("title")}
                onBlur={(e) => { if (!watch("slug")) setValue("slug", slugify(e.target.value)); }}
                placeholder="Equipment Financing vs. Leasing"
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input {...register("slug")} placeholder="auto-generated" />
            </div>
            <div className="space-y-1.5">
              <Label>Excerpt</Label>
              <Textarea rows={2} {...register("excerpt")} placeholder="Short summary shown in previews" />
            </div>
            <div className="space-y-1.5">
              <Label>Content (Markdown) <span className="text-gold">*</span></Label>
              <Textarea rows={16} className="font-mono text-sm" {...register("content")} placeholder="## Heading&#10;&#10;Write your article in Markdown…" />
              {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
              <p className="text-xs text-muted-foreground">Supports headings, **bold**, *italics*, lists, &gt; quotes, and [links](url).</p>
            </div>
          </div>
        </Card>

        <Card title="SEO">
          <div className="space-y-4">
            <div className="space-y-1.5"><Label>Meta Title</Label><Input {...register("metaTitle")} /></div>
            <div className="space-y-1.5"><Label>Meta Description</Label><Textarea rows={2} {...register("metaDescription")} /></div>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card title="Publishing">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setValue("status", v as BlogInput["status"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {status === "SCHEDULED" && (
              <div className="space-y-1.5">
                <Label>Publish Date</Label>
                <Input type="datetime-local" {...register("publishedAt")} />
              </div>
            )}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Featured</p>
                <p className="text-xs text-muted-foreground">Highlight at top of blog</p>
              </div>
              <Switch checked={watch("featured")} onCheckedChange={(v) => setValue("featured", v)} />
            </div>
          </div>
        </Card>

        <Card title="Cover Image">
          <ImageUploader value={cover} onChange={setCover} multiple={false} />
        </Card>

        <Card title="Taxonomy">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={watch("category")} onValueChange={(v) => setValue("category", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {BLOG_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Tags (comma-separated)</Label>
              <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="financing, leasing" />
            </div>
            <div className="space-y-1.5">
              <Label>Read time (minutes)</Label>
              <Input type="number" {...register("readMinutes")} />
            </div>
          </div>
        </Card>

        <Button type="submit" variant="gold" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : blogId ? "Update Post" : "Create Post"}
        </Button>
      </div>
    </form>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-card">
      <h3 className="font-display text-base font-bold">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}
