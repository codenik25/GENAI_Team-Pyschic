import { useEffect, useMemo, useRef, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Copy, Download, Film, Hash, Image as ImageIcon, Loader2, Music, Play, Upload } from "lucide-react";

interface UploadedItem {
  id: string;
  file: File;
  url: string;
  kind: "image" | "video" | "audio" | "other";
}

const pipelineSteps = [
  { id: "uploaded", label: "Your media has been successfully uploaded." },
  { id: "captions", label: "AI is creating engaging captions based on analysis." },
  { id: "hashtags", label: "Trending hashtags are being generated for reach." },
  { id: "ready", label: "Your optimized content is ready for preview." },
] as const;

type StepId = typeof pipelineSteps[number]["id"];

export default function Index() {
  const [items, setItems] = useState<UploadedItem[]>([]);
  const [activeStep, setActiveStep] = useState<StepId | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const fileInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!items.length) return;
    setActiveStep("uploaded");

    const timers: number[] = [];
    timers.push(window.setTimeout(() => setActiveStep("captions"), 800));
    timers.push(
      window.setTimeout(() => {
        setActiveStep("hashtags");
      }, 1600),
    );
    timers.push(
      window.setTimeout(() => {
        setActiveStep("ready");
      }, 2400),
    );

    const generatedCaption = generateCaption(items);
    const generatedTags = generateTags(items);
    setCaption(generatedCaption);
    setTags(generatedTags);

    return () => timers.forEach((t) => clearTimeout(t));
  }, [items]);

  const heroUrl = useMemo(() => items.find((i) => i.kind === "image" || i.kind === "video")?.url, [items]);

  function onFilesSelected(files: FileList | null) {
    if (!files || files.length === 0) return;
    const next: UploadedItem[] = [];
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      const kind: UploadedItem["kind"] = file.type.startsWith("image")
        ? "image"
        : file.type.startsWith("video")
          ? "video"
          : file.type.startsWith("audio")
            ? "audio"
            : "other";
      next.push({ id: `${file.name}-${file.size}-${file.lastModified}`, file, url, kind });
    });
    setItems(next);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    onFilesSelected(e.dataTransfer.files);
  }

  function openPicker() {
    fileInput.current?.click();
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
  }

  const canDownload = Boolean(items.length);

  return (
    <AppLayout>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        <section className="space-y-6">
          {/* Upload */}
          <Card>
            <CardHeader className="flex items-center justify-between gap-4 sm:flex-row">
              <div>
                <CardTitle className="text-xl">Upload Your Media</CardTitle>
                <CardDescription>
                  Drag and drop your images (.jpg, .png) or audio files (.mp3, .wav) here, or click to browse.
                </CardDescription>
              </div>
              <input
                ref={fileInput}
                type="file"
                accept="image/*,video/*,audio/*"
                multiple
                className="hidden"
                onChange={(e) => onFilesSelected(e.target.files)}
              />
              <Button onClick={openPicker} className="shrink-0">
                <Upload /> Browse Files
              </Button>
            </CardHeader>
            <CardContent>
              <div
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                className="group grid place-items-center rounded-lg border-2 border-dashed border-input bg-secondary/30 py-12 text-center transition-colors hover:border-primary hover:bg-secondary/40"
              >
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <Upload className="h-8 w-8 text-primary/80" />
                  <p className="text-sm">Drag and drop files here or click the button above</p>
                </div>
              </div>
              {items.length > 0 && (
                <div className="mt-6">
                  <p className="mb-3 text-sm text-muted-foreground">File Previews:</p>
                  <div className="flex flex-wrap gap-3">
                    {items.map((it) => (
                      <div key={it.id} className="flex items-center gap-2 rounded-md border bg-secondary/20 px-3 py-2 text-sm">
                        {it.kind === "image" && <ImageIcon className="h-4 w-4 text-primary" />}{}
                        {it.kind === "video" && <Film className="h-4 w-4 text-primary" />}{}
                        {it.kind === "audio" && <Music className="h-4 w-4 text-primary" />}{}
                        <span className="max-w-[220px] truncate">{it.file.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pipeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Processing Pipeline</CardTitle>
              <CardDescription>Track the progress of your content optimization.</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {pipelineSteps.map((step) => {
                  const index = pipelineSteps.findIndex((s) => s.id === step.id);
                  const activeIndex = activeStep ? pipelineSteps.findIndex((s) => s.id === activeStep) : -1;
                  const done = activeIndex >= index;
                  return (
                    <li key={step.id} className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {done ? (
                          <CheckCircle2 className="h-5 w-5 text-green-400" />
                        ) : activeIndex + 1 === index ? (
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border" />
                        )}
                      </div>
                      <p className="text-sm leading-6 text-muted-foreground">{step.label}</p>
                    </li>
                  );
                })}
              </ol>
            </CardContent>
          </Card>

          {/* Reel Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Reel Preview</CardTitle>
              <CardDescription>Watch your optimized short video and grab details for posting.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-hidden rounded-md border bg-secondary/20">
                <div className="aspect-video w-full bg-gradient-to-br from-slate-800 to-slate-700">
                  {heroUrl ? (
                    <img src={heroUrl} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <button
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:scale-105 h-14 w-14"
                  aria-label="play preview"
                >
                  <Play className="h-6 w-6" />
                </button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center gap-3 justify-between">
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => copy(caption)}>
                  <Copy /> Copy Caption
                </Button>
                <Button variant="secondary" onClick={() => copy(tags.map((t) => `#${t}`).join(" "))}>
                  <Hash /> Copy Hashtags
                </Button>
              </div>
              <Button disabled={!canDownload} onClick={() => items[0] && downloadBlob(items[0])}>
                <Download /> Download Reel
              </Button>
            </CardFooter>
          </Card>
        </section>

        {/* Right Sidebar */}
        <aside className="xl:sticky xl:top-20 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Content Insights</CardTitle>
              <CardDescription>Unlock your full potential with AI-powered suggestions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="mb-2 text-sm font-medium">Generated Content</div>
                <div className="rounded-md border bg-secondary/20 p-3 text-sm">
                  {caption || "Add media to generate a caption."}
                </div>
                <Button className="mt-2 h-8 text-xs" variant="outline" onClick={() => copy(caption)}>
                  <Copy className="h-3.5 w-3.5" /> Copy Caption
                </Button>
              </div>

              <div>
                <div className="mb-2 text-sm font-medium">Hashtags</div>
                <div className="flex flex-wrap gap-2">
                  {tags.length ? (
                    tags.map((t) => (
                      <Badge key={t} variant="secondary" className="bg-secondary/40">
                        #{t}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Upload to generate hashtags.</p>
                  )}
                </div>
                <Button className="mt-2 h-8 text-xs" variant="outline" onClick={() => copy(tags.map((t) => `#${t}`).join(" "))}>
                  <Copy className="h-3.5 w-3.5" /> Copy All Hashtags
                </Button>
              </div>

              <div>
                <div className="mb-2 text-sm font-medium">Style Tips</div>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Use eye-catching hooks in the first 3 seconds.</li>
                  <li>Incorporate trending audio for broader reach.</li>
                  <li>Maintain consistent visual quality and branding.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </AppLayout>
  );
}

function generateCaption(items: UploadedItem[]) {
  const first = items[0];
  const base = "Created with ViralSpark — optimized for reach.";
  if (!first) return base;
  const name = first.file.name.replace(/\.[^/.]+$/, "");
  return `${capitalize(name)} — bringing ideas to life. ${base}`;
}

function generateTags(items: UploadedItem[]) {
  const core = ["GoViral", "CreativeContent", "TrendAnalysis", "EngagementBoost", "SocialStrategy"];
  const more = ["Shorts", "Reels", "AIEditing", "Hook", "ContentBoss", "Vibe" /* extras */];
  const pool = [...core, ...more];
  const out: string[] = [];
  for (let i = 0; i < 8; i++) out.push(pool[(i * 7 + (items[0]?.file.size || 1)) % pool.length]);
  return Array.from(new Set(out));
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function downloadBlob(item: UploadedItem) {
  const a = document.createElement("a");
  a.href = item.url;
  a.download = item.file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
