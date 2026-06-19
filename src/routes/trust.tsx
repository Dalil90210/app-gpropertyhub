import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Lock, KeyRound, Database, Cookie, UserCheck, Mail, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/trust")({
  head: () => ({
    meta: [
      { title: "Trust & Security — New Guard Property Hub" },
      { name: "description", content: "How New Guard Property Hub protects your account, data, and transactions — authentication, hosting, data handling, and how to contact us about security or privacy." },
      { property: "og:title", content: "Trust & Security — New Guard Property Hub" },
      { property: "og:description", content: "How New Guard Property Hub protects your account, data, and transactions across all 50 states." },
      { property: "og:url", content: "https://app.ngpropertyhub.com/trust" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://app.ngpropertyhub.com/trust" }],
  }),
  component: Page,
});

function Section({ icon: Icon, title, children }: { icon: typeof ShieldCheck; title: string; children: React.ReactNode }) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-md gradient-gold flex items-center justify-center text-navy">
          <Icon className="w-4 h-4" />
        </div>
        <h2 className="text-lg font-semibold text-navy">{title}</h2>
      </div>
      <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">{children}</div>
    </Card>
  );
}

function Page() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <ShieldCheck className="w-12 h-12 mx-auto text-gold" aria-hidden="true" />
        <h1 className="text-4xl font-bold text-navy mt-4">Trust & Security</h1>
        <p className="mt-3 text-muted-foreground">
          This page is maintained by New Guard Property Hub to answer common security and privacy
          questions about our platform. It describes controls we have enabled today and is editable
          project content — not an independent certification.
        </p>
      </div>

      <div className="grid gap-4">
        <Section icon={KeyRound} title="Account access & authentication">
          <p>
            Accounts are protected with email and password sign-in, with optional Google single
            sign-on. Sessions are managed by our authentication provider and access tokens are
            stored in your browser, scoped to this site.
          </p>
          <p>
            Sensitive actions (listing changes, offers, escrow, role assignments) require an
            authenticated session and are checked server-side on every request.
          </p>
        </Section>

        <Section icon={Lock} title="Data protection in the database">
          <p>
            Every user-data table enforces row-level security: users can only read and write the
            rows they own. Roles are stored in a dedicated table and verified server-side — they
            cannot be elevated from the browser.
          </p>
          <p>
            Listings can only be edited by the assigned agent or an administrator, and ownership
            of a listing cannot be transferred from the client side.
          </p>
        </Section>

        <Section icon={Database} title="Platform & hosting">
          <p>
            The application runs on managed cloud infrastructure with TLS/HTTPS for all traffic.
            Database, authentication, and storage are provided by our backend platform; secrets
            and service keys are kept on the server and never shipped to the browser.
          </p>
          <p>
            Lovable platform capabilities are used as-is; this statement is not a Lovable
            certification or independent audit.
          </p>
        </Section>

        <Section icon={UserCheck} title="Data we collect & how we use it">
          <p>
            We collect the account information you provide (name, email, role), the listings and
            inquiries you create, and operational metadata needed to run the service (timestamps,
            message threads, transaction state). We use this data to operate the marketplace,
            connect buyers, sellers, and agents, and improve the product.
          </p>
          <p>
            We do not sell personal data. For specific retention windows or a copy/deletion of
            your data, contact us using the address below.
          </p>
        </Section>

        <Section icon={Cookie} title="Cookies & analytics">
          <p>
            We use cookies and local storage strictly to keep you signed in and to remember your
            preferences. Any analytics we run is aggregated and used to improve reliability and
            usability of the platform.
          </p>
        </Section>

        <Section icon={AlertTriangle} title="Reporting a security issue">
          <p>
            If you believe you have found a security vulnerability or a privacy issue, please
            email us before sharing details publicly. We will acknowledge your report and work
            with you on a fix.
          </p>
          <p className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-navy" />
            <a className="text-navy underline hover:text-gold" href="mailto:security@ngpropertyhub.com">
              security@ngpropertyhub.com
            </a>
          </p>
        </Section>

        <Section icon={ShieldCheck} title="Shared responsibility">
          <p>
            New Guard Property Hub secures the platform, the application, and the data it stores.
            You are responsible for keeping your account credentials private, using a strong
            password, and reviewing transactions before approving them. Third-party services you
            choose to connect (e.g. payment processors) operate under their own terms.
          </p>
        </Section>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-8">
        Questions about this page? <Link to="/contact" className="underline hover:text-gold">Contact us</Link>.
      </p>
    </div>
  );
}
