import LegalLayout from "@/app/legal/layout";
import { CardHeader, CardTitle } from "@/components/ui/card";


export default function TermsAndConditions() {
    return (
        <LegalLayout>
            <CardHeader className="text-center pb-6 pt-4 border-b border-border/50">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Terms and Conditions
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
                <h1 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h1>
                <p className="mb-4">
                    By accessing or using <b>OpenPic</b> (&quot;the Site&quot;), you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the Site.
                </p>
            </section>

            <section className="mt-8">
                <h2 className="text-xl font-semibold mb-3">2. Use of the Site</h2>
                <p className="mb-4">You agree not to:</p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                    <li>Use the Site for illegal purposes or to violate any laws</li>
                    <li>Interfere with the Site&apos;s security features or functionality</li>
                    <li>Attempt to gain unauthorized access to any part of the Site</li>
                    <li>Use automated systems to extract content without permission</li>
                    <li>Impersonate any person or entity</li>
                </ul>
            </section>

            <section className="mt-8">
                <h2 className="text-xl font-semibold mb-3">3. Intellectual Property</h2>
                <p className="mb-4">
                    All content on this Site (text, graphics, logos, images) is the property of <b>OpenPic</b> or its licensors and protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without explicit written permission.
                </p>
            </section>

            <section className="mt-8">
                <h2 className="text-xl font-semibold mb-3">4. User Accounts</h2>
                <p className="mb-4">
                    When creating an account, you must provide accurate information and maintain its accuracy. You are responsible for maintaining the confidentiality of your account credentials and all activities under your account.
                </p>
            </section>

            <section className="mt-8">
                <h2 className="text-xl font-semibold mb-3">5. Limitation of Liability</h2>
                <p className="mb-4">
                    To the fullest extent permitted by law, <b>OpenPic</b> shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Site. Our total liability for any claim related to the Site shall not exceed ₹10000 INR.
                </p>
            </section>

            <section className="mt-8">
                <h2 className="text-xl font-semibold mb-3">6. Third-Party Links</h2>
                <p className="mb-4">
                    The Site may contain links to third-party websites. We do not endorse or assume responsibility for the content, privacy policies, or practices of any third-party sites. You access third-party links at your own risk.
                </p>
            </section>

            <section className="mt-8">
                <h2 className="text-xl font-semibold mb-3">7. Termination</h2>
                <p className="mb-4">
                    We reserve the right to suspend or terminate your access to the Site immediately, without prior notice, for any reason whatsoever, including breach of these Terms. Upon termination, your right to use the Site will immediately cease.
                </p>
            </section>

            <section className="mt-8">
                <h2 className="text-xl font-semibold mb-3">8. Governing Law</h2>
                <p className="mb-4">
                    These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles. Any legal action arising from these Terms shall be brought exclusively in the courts located in Kerala, India.
                </p>
            </section>

            <section className="mt-8">
                <h2 className="text-xl font-semibold mb-3">9. Changes to Terms</h2>
                <p className="mb-4">
                    We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the Site after changes constitutes acceptance of the modified Terms.
                </p>
            </section>

            <section className="mt-8 border-t border-border/30">
                <h2 className="text-xl font-semibold mb-3">10. Contact Information</h2>
                <p className="mb-2">
                    For questions regarding these Terms:
                </p>
                <address className="not-italic">
                    Email:{" "}
                    <a href="mailto:support@openpic.in" className="text-primary hover:underline">
                        support@openpic.in
                    </a>
                    <br />
                    {/* Address: [Your Company Address] */}
                </address>
            </section>
        </LegalLayout>
    );
}
