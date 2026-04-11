import MainContent from '@/components/pages/business-card/MainContent'
import BackComponent from '@/components/shared/BackComponent'

function page() {
    return (
        <div className="min-h-screen flex flex-col gap-6 bg-background">
            <BackComponent>
                <h1 className="text-2xl font-bold">
                    Business Card
                </h1>
            </BackComponent>
            <MainContent />
        </div>
    )
}

export default page