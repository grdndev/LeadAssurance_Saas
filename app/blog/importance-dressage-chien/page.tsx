import { Metadata } from "next";

export const metadata: Metadata = {
    title: "L'importance du dressage pour la sécurité de votre chien | Blog LeadsAssurance",
    description: "Apprenez pourquoi le dressage est crucial pour la sécurité et le bien-être de votre compagnon à quatre pattes.",
    keywords: ["dressage chien", "éducation canine", "assurance animaux", "sécurité chien"],
};

export default function ArticlePage() {
    return (
        <article className="max-w-4xl mx-auto px-6 py-20">
            <header className="mb-12">
                <div className="flex gap-2 mb-6">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">Formation</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                    L'importance du dressage pour la sécurité de votre chien
                </h1>
                <div className="flex items-center gap-4 text-muted-foreground border-y border-border/50 py-4">
                    <span>Par <strong>Expert Canin</strong></span>
                    <span>•</span>
                    <span>Publié le 02 Février 2026</span>
                </div>
            </header>

            <div className="aspect-video mb-12 rounded-3xl overflow-hidden shadow-2xl">
                <img
                    src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=2070&auto=format&fit=crop"
                    alt="Chien en dressage"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="prose prose-lg prose-blue dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
                <p className="text-xl text-foreground font-medium">
                    Le dressage ne se résume pas à apprendre à votre chien à faire le "beau" ou à donner la patte. C'est un outil fondamental pour assurer sa sécurité et celle des autres.
                </p>

                <h2 className="text-2xl font-bold text-foreground pt-4">Le rappel : un geste de survie</h2>
                <p>
                    Le rappel est sans doute l'ordre le plus crucial. Un chien qui revient immédiatement à l'appel de son maître peut être sauvé d'une voiture qui arrive à vive allure, d'une rencontre dangereuse avec un autre animal ou d'une perte en forêt. L'éducation canine permet d'instaurer ce lien de confiance indispensable.
                </p>

                <h2 className="text-2xl font-bold text-foreground pt-4">La socialisation : prévenir les morsures</h2>
                <p>
                    Un chien mal socialisé est souvent un chien anxieux. Cette anxiété peut se traduire par des réactions agressives imprévisibles. En formant votre chien dès son plus jeune âge, vous lui apprenez à interagir sereinement avec ses congénères et les humains, réduisant ainsi drastiquement les risques d'accidents domestiques.
                </p>

                <blockquote className="border-l-4 border-primary pl-6 py-2 italic text-primary text-xl bg-primary/5 rounded-r-xl">
                    "Un chien éduqué est un chien libre. Libre de vous accompagner partout, libre de courir sans laisse dans les zones autorisées, car vous savez que vous gardez le contrôle."
                </blockquote>

                <h2 className="text-2xl font-bold text-foreground pt-4">L'assurance animaux : un complément à l'éducation</h2>
                <p>
                    Même avec le meilleur dressage du monde, un accident peut arriver. C'est là que l'assurance animaux intervient. Chez LeadsAssurance, nous mettons en relation les propriétaires avec les meilleurs courtiers pour garantir une prise en charge optimale des frais vétérinaires.
                </p>

                <p>
                    Investir dans une formation canine et dans une bonne mutuelle, c'est offrir à votre compagnon la meilleure protection possible.
                </p>
            </div>

            <footer className="mt-20 pt-10 border-t border-border/50">
                <div className="bg-secondary/30 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Besoin d'une assurance pour votre compagnon ?</h3>
                        <p className="text-muted-foreground">Obtenez un devis personnalisé en quelques minutes auprès de nos partenaires.</p>
                    </div>
                    <button className="px-8 py-4 bg-primary text-white font-bold rounded-full hover:shadow-lg transition-all shrink-0">
                        Trouver un expert
                    </button>
                </div>
            </footer>
        </article>
    );
}
