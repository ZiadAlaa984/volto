"use client";

import { toastShared } from "@/lib/utils";
import { CopyIcon } from "lucide-react";
import { Button } from "../ui/button";

function CopyButton({ url }: { url: string }) {
    const onCopy = (e: React.MouseEvent) => {
        e.preventDefault()   // don't follow any parent <a>
        e.stopPropagation()  // don't bubble to motion.div whileTap
        navigator.clipboard.writeText(url)
        toastShared({
            title: "Link copied to clipboard",
            description: "The link has been copied to your clipboard",
        })
    }

    return (
        <Button size="icon" variant="outline" onClick={onCopy} className="shrink-0">
            <CopyIcon className="w-4 h-4" />
        </Button>
    )
}

export default CopyButton