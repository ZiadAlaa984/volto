"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LinkIcon, ImageIcon, FileTextIcon, UploadIcon, XIcon } from 'lucide-react'

type MenuType = 'link' | 'images' | 'pdf'

interface MenuSectionProps {
    value: string           // stores the URL or file name for display
    onChange: (value: string) => void
    error?: string
}

function MenuSection({ value, onChange, error }: MenuSectionProps) {
    const [tab, setTab] = useState<MenuType>('link')
    const [images, setImages] = useState<File[]>([])
    const [pdf, setPdf] = useState<File | null>(null)

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return
        // TODO: validate file size / type before upload
        const files = Array.from(e.target.files)
        setImages(prev => [...prev, ...files])
        onChange(files.map(f => f.name).join(', '))
    }

    function removeImage(index: number) {
        const next = images.filter((_, i) => i !== index)
        setImages(next)
        onChange(next.map(f => f.name).join(', '))
        // TODO: delete from storage
    }

    function handlePdfChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        // TODO: validate file size before upload
        setPdf(file)
        onChange(file.name)
    }

    return (
        <div className="space-y-4">
            <Tabs value={tab} onValueChange={v => { setTab(v as MenuType); onChange('') }}>
                <TabsList className="w-full">
                    <TabsTrigger value="link" className="flex-1 gap-2">
                        <LinkIcon className="w-4 h-4" /> Link
                    </TabsTrigger>
                    <TabsTrigger value="images" className="flex-1 gap-2">
                        <ImageIcon className="w-4 h-4" /> Images
                    </TabsTrigger>
                    <TabsTrigger value="pdf" className="flex-1 gap-2">
                        <FileTextIcon className="w-4 h-4" /> PDF
                    </TabsTrigger>
                </TabsList>

                {/* ── Link ── */}
                <TabsContent value="link" className="space-y-2 pt-2">
                    <Label htmlFor="menu-link">Menu URL</Label>
                    <Input
                        id="menu-link"
                        type="url"
                        placeholder="https://your-menu-link.com"
                        value={tab === 'link' ? value : ''}
                        onChange={e => onChange(e.target.value)}
                    />
                    {error && <p className="text-xs text-destructive">{error}</p>}
                    <p className="text-xs text-muted-foreground">
                        Paste a link — website, Zomato, Talabat, Google Drive, etc.
                    </p>
                </TabsContent>

                {/* ── Images ── */}
                <TabsContent value="images" className="space-y-3 pt-2">
                    <Label>Menu images</Label>
                    <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-border rounded-lg p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                        <UploadIcon className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Click to upload images</span>
                        <span className="text-xs text-muted-foreground">PNG, JPG up to 10MB each</span>
                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                    </label>
                    {/* TODO: show image thumbnails */}
                    {images.length > 0 && (
                        <ul className="space-y-2">
                            {images.map((file, i) => (
                                <li key={i} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
                                    <span className="truncate text-muted-foreground">{file.name}</span>
                                    <button type="button" onClick={() => removeImage(i)}>
                                        <XIcon className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </TabsContent>

                {/* ── PDF ── */}
                <TabsContent value="pdf" className="space-y-3 pt-2">
                    <Label>Menu PDF</Label>
                    {!pdf ? (
                        <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-border rounded-lg p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                            <UploadIcon className="w-5 h-5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Click to upload PDF</span>
                            <span className="text-xs text-muted-foreground">PDF up to 20MB</span>
                            <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfChange} />
                        </label>
                    ) : (
                        // TODO: show PDF first page thumbnail
                        <div className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
                            <div className="flex items-center gap-2">
                                <FileTextIcon className="w-4 h-4 text-muted-foreground" />
                                <span className="truncate text-muted-foreground">{pdf.name}</span>
                            </div>
                            <button type="button" onClick={() => { setPdf(null); onChange('') }}>
                                <XIcon className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                            </button>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default MenuSection