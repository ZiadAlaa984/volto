"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

export default function QrCodeTrigger({ onOpen }: { onOpen: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
        >
            <Button
                variant="ghost"
                size="sm"
                onClick={onOpen}
                className="gap-2 rounded-xl text-xs font-medium transition-all"
            >
                <QrCode className="w-3.5 h-3.5" />
                Show QR code
            </Button>
        </motion.div>
    );
}