import Loader from "@/components/kokonutui/loader";

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-[500px]">
            <Loader size="lg" />
        </div>
    );
}
