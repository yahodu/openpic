import LegalLayout from "@/app/legal/layout";
import { CardHeader, CardTitle } from "@/components/ui/card";


export default function PrivacyPolicy() {
    return (
        <LegalLayout>
            <CardHeader className="text-center pb-6 pt-4 border-b border-border/50">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Privacy Policy
                </CardTitle>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                    Last updated: {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
            </CardHeader>
            <section>
                <h1 className="text-2xl font-bold mb-4">1. Introduction</h1>
                <p className="mb-4">
                    Welcome to <b>OpenPic</b> (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). We are committed to protecting your personal information and your right to privacy. This policy explains how we collect, use, and safeguard your information when you visit our website.
                </p>
            </section>

            <section className="mt-8">
                <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                    <li>
                        <strong>Personal Information:</strong> Name, email address, contact details when you register or contact us
                    </li>
                    <li>
                        <strong>Usage Data:</strong> IP address, browser type, pages visited, time spent on pages
                    </li>
                    {/* <li>
                        <strong>Cookies and Tracking Technologies:</strong> We use cookies to enhance your experience (see Cookie Policy section)
                    </li> */}
                </ul>
            </section>

            <section className="mt-8">
                <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
                <p className="mb-4">We use collected information to:</p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                    <li>Provide and maintain our services</li>
                    <li>Respond to your inquiries and requests</li>
                    <li>Improve website functionality and user experience</li>
                    <li>Comply with legal obligations</li>
                    <li>Prevent fraud and security issues</li>
                </ul>
            </section>

            <section className="mt-8">
                <h2 className="text-xl font-semibold mb-3">4. Data Sharing and Disclosure</h2>
                <p className="mb-4">
                    We do not sell your personal information. We may share data with:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                    <li>Trusted service providers (hosting, analytics)</li>
                    <li>Legal authorities when required by law</li>
                    <li>Business transfers (mergers, acquisitions) with notice</li>
                </ul>
            </section>

            <section className="mt-8">
                <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
                <p className="mb-4">
                    Depending on your location, you may have the right to:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                    <li>Access and obtain a copy of your personal data</li>
                    <li>Request correction of inaccurate information</li>
                    <li>Request deletion of your personal data</li>
                    <li>Object to processing of your data</li>
                    <li>Withdraw consent at any time</li>
                </ul>
            </section>

            <section className="mt-8">
                <h2 className="text-xl font-semibold mb-3">6. Data Security</h2>
                <p className="mb-4">
                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no security system is impenetrable, and we cannot guarantee absolute security.
                </p>
            </section>

            <section className="mt-8">
                <h2 className="text-xl font-semibold mb-3">7. International Data Transfers</h2>
                <p className="mb-4">
                    Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers in compliance with applicable laws.
                </p>
            </section>

            <section className="mt-8">
                <h2 className="text-xl font-semibold mb-3">8. Changes to This Policy</h2>
                <p className="mb-4">
                    We may update this Privacy Policy periodically. Changes will be posted on this page with an updated &quot;Last Updated&quot; date. Continued use after changes constitutes acceptance.
                </p>
            </section>

            <section className="mt-8 border-t border-border/30">
                <h2 className="text-xl font-semibold mb-3">9. Contact Us</h2>
                <p className="mb-2">
                    For privacy-related questions or requests:
                </p>
                <address className="not-italic">
                    Email:{" "}
                    <a href="mailto:ceo@yahodu.in" className="text-primary hover:underline">
                        ceo@yahodu.in
                    </a>
                    <br />
                    {/* Address: [Your Company Address] */}
                </address>
            </section>
        </LegalLayout>
    );
}
