import FooterSection from "../landing/components/FooterSection";

export default function TermsOfUse() {
  return (
    <>
      <div className="flex flex-col justify-center px-6 md:px-96 py-16 overflow-auto ">
        <div className="flex flex-col justify-center">
          <div className="border-b border-b-slate-200 pb-4">
            <h1 className="text-2xl font-semibold mb-6 text-center break-words">
              Terms of Use
            </h1>
            <p>
              Welcome to Docsure! These Terms of Use ("Terms" or the
              "Agreement") form a legal agreement between you and Docsure, Inc.
              ("Docsure," "we," "our," or "us"). By using our websites,
              applications, and related services (collectively, the "Services"),
              you agree to these Terms. If you don’t agree, please do not use
              our Services.
            </p>
            <p className="mt-4">
              The Services include but are not limited to: digital scheduling
              tools, provider directories, AI-powered features, and any other
              service offered or maintained by Docsure. Some features may have
              their own additional terms, which you’ll see before you use those
              specific features.
            </p>
            <p className="mt-4">
              By using Docsure, you confirm that you are legally authorized to
              enter into this agreement. If you’re using Docsure on behalf of
              another person (such as a dependent or client), you confirm that
              you’re authorized to act on their behalf.
            </p>
          </div>
          <div className="mt-4 border-b border-b-slate-200 pb-4">
            <h2 className="text-xl">1. Scope of Services</h2>
            <p className="mt-4">
              Docsure gives you a limited, personal, non-transferable, and
              revocable license to use the Services as permitted under these
              Terms.
            </p>
            <p className="mt-4">
              Content provided via the Services—including provider profiles,
              appointment availability, and AI features—is informational only.
              While some content may come from licensed healthcare
              professionals, Docsure does not provide medical care or advice.
            </p>
          </div>
          <div className="mt-4 border-b border-b-slate-200 pb-4">
            <h2 className="text-xl">2. No Medical Advice</h2>
            <p className="mt-4">
              Docsure is not a healthcare provider. Any content accessed through
              Docsure—including through our AI services, help center, blog,
              social media, or email—is for general informational purposes. It
              should never be used as a substitute for professional medical
              advice or treatment.
            </p>
            <p className="mt-4">
              If you are experiencing a medical emergency, please contact 911 or
              your nearest emergency provider immediately.
            </p>
          </div>
          <div className="mt-4 border-b border-b-slate-200 pb-4">
            <h2 className="text-xl">3. No Provider-Patient Relationship</h2>
            <p className="mt-4">
              Using Docsure does not create a provider-patient relationship.
              This applies even if you access provider content or use tools like
              Docsure’s AI assistant. Docsure is a technology platform—not a
              referral service—and we do not endorse or recommend any particular
              healthcare provider, procedure, or treatment.
            </p>
            <p className="mt-4">
              We do not control the actions, availability, or quality of any
              provider listed on our platform and are not liable for missed or
              canceled appointments or the outcomes of any medical services you
              receive.
            </p>
          </div>
          <div className="mt-4 border-b border-b-slate-200 pb-4">
            <h2 className="text-xl">4. Choosing a Provider</h2>
            <p className="mt-4">
              You are solely responsible for choosing a provider that fits your
              needs. We don’t guarantee their accuracy, availability, or
              quality.
            </p>
            <p className="mt-4">
              Search results on Docsure are influenced by your input, such as
              location, insurance, or specialty, and may also be impacted by
              provider availability, user feedback, or other criteria. Some
              providers may pay us fees to appear in search results.
            </p>
          </div>
          <div className="mt-4 border-b border-b-slate-200 pb-4">
            <h2 className="text-xl">5. Informational Use Only</h2>
            <p className="mt-4">
              Docsure is intended as a helpful tool for consumers and providers,
              not a source of medical advice. Content about healthcare services,
              insurance coverage, AI-generated information, or provider profiles
              is provided “as-is” and may not always be current or accurate. We
              make no guarantees about the completeness or reliability of such
              content.
            </p>
            <p className="mt-4">
              You agree to use Docsure responsibly, verify any critical
              information independently, and understand that your use is at your
              own risk.
            </p>
          </div>
          <div className="mt-4 border-b border-b-slate-200 pb-4">
            <h2 className="text-xl">6. AI-Powered Features</h2>
            <p className="mt-4">
              Some Docsure features use artificial intelligence to generate
              responses or suggestions. These AI tools are provided for
              convenience and should not be relied upon for medical, legal, or
              financial decisions. AI-generated content may contain inaccuracies
              or errors.
            </p>
            <p className="mt-4">
              Docsure disclaims any liability for harm caused by reliance on AI
              responses. If in doubt, consult a qualified professional.
            </p>
          </div>
          <div className="mt-4 border-b border-b-slate-200 pb-4">
            <h2 className="text-xl">7. Medical Data</h2>
            <p className="mt-4">
              You may choose to share health-related information with Docsure,
              such as when scheduling an appointment or filling out intake
              forms. By doing so, you authorize Docsure to transmit that
              information to the applicable provider.
            </p>
            <p className="mt-4">
              Make sure the information you provide is accurate, complete, and
              authorized. You may need to confirm or correct it with the
              provider during your appointment.
            </p>
          </div>
          <div className="mt-4 border-b border-b-slate-200 pb-4">
            <h2 className="text-xl">8. Changes to These Terms</h2>
            <p className="mt-4">
              We may update these Terms from time to time to reflect changes in
              law, technology, or our Services. If changes are material, we’ll
              do our best to notify you (e.g., via email or in-app
              notification). Continued use of Docsure means you accept the
              updated Terms.
            </p>
            <p className="mt-4">
              If you don’t agree with the new Terms, you may stop using the
              Services.
            </p>
          </div>
          <div className="mt-4 border-b border-b-slate-200 pb-4">
            <h2 className="text-xl">9. Questions?</h2>
            <p className="mt-4">
              If you have questions or feedback about these Terms, feel free to
              reach out to us.
            </p>
            <p className="mt-4">
              These Terms are designed to protect both you and Docsure. Please
              use our Services thoughtfully and let us know how we can make them
              better.
            </p>
          </div>
        </div>
      </div>
      <FooterSection />
    </>
  );
}
