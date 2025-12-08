import { Card, CardContent } from "@/components/ui/card";


export default function LegalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Card className="border-border/50 shadow-xl">
                    <CardContent className="pt-8 pb-4">
                        <div className="prose prose-lg max-w-none mx-auto prose-headings:font-semibold prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:underline">
                            {children}
                        </div>

                        {/* <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
                            <p>
                                Questions?{" "}
                                <Link
                                    href="/contact"
                                    className="font-medium text-primary hover:underline"
                                >
                                    Contact us
                                </Link>
                            </p>
                        </div> */}
                    </CardContent>
                </Card>

                <div className="mt-8 text-center text-xs text-muted-foreground/70">
                    If you find anything missing, please reach out to us.
                </div>
            </div>
        </div>
    );
}
