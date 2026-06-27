import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BlogForm } from "@/components/admin/blog-form";

export default function NewBlogPage() {
  return (
    <div>
      <Link href="/admin/blog" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to posts
      </Link>
      <h2 className="mb-6 font-display text-xl font-bold">New Blog Post</h2>
      <BlogForm />
    </div>
  );
}
