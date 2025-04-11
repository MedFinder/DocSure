import FooterSection from "../landing/components/FooterSection";

export default function PrivacyPolicy() {
  return (
    <>
      <div className="flex flex-col justify-center px-6 md:px-96 py-16 overflow-auto  ">
        <div className="flex flex-col justify-center">
          <div className="border-b border-b-slate-200 pb-4">
            <h1 className="text-2xl font-semibold mb-6 text-center break-words">
              Docsure Privacy Policy
            </h1>
            <p>
              At Docsure, Inc. ("Docsure," "we," "our," or "us"), we respect
              your privacy and are committed to being transparent about how we
              handle your information. This Privacy Policy explains how we
              collect, use, and share your personal information when you use our
              websites, mobile applications, and related services (collectively,
              the "Services").
            </p>
            <p className="mt-4">
              By using Docsure, you agree to the practices described in this
              Privacy Policy. If you’re using Docsure on behalf of someone else
              (like a family member or dependent), you confirm you have the
              authority to accept this Policy on their behalf.
            </p>
          </div>
          <div className="mt-4 border-b border-b-slate-200 pb-4">
            <h2 className="text-xl">1. What This Policy Covers</h2>
            <p className="mt-4">
              This policy applies to all users of Docsure’s Services, whether or
              not you’ve created a Docsure account.
            </p>
          </div>
          <div className="mt-4 border-b border-b-slate-200 pb-4">
            <h2 className="text-xl">2. Personal Data We Collect</h2>
            <div className="mt-4">
              Depending on how you interact with Docsure, we may collect:
              <ul className="list-disc list-inside pl-6 pt-4">
                <li>Contact Info: Name, email, phone, mailing address.</li>
                <li>
                  Identifiers: IP address, device IDs, browser type, operating
                  system.
                </li>
                <li>
                  Usage Info: Pages visited, session duration, clicks, referring
                  site.
                </li>
                <li>
                  Demographics: Age, gender, zip code (if you share them).
                </li>
                <li>
                  Health & Appointment Data: Reason for visit, provider info,
                  medical history, insurance details.
                </li>
                <li>
                  Payment Info: Last 4 digits of card, card type, billing
                  address..
                </li>
                <li>
                  Sensitive Info: Race, sexual orientation, gender identity
                  (only if voluntarily provided).
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-4 border-b border-b-slate-200 pb-4">
            <h2 className="text-xl">3. How We Collect Information</h2>
            <div className="mt-4">
              <ul className="list-disc list-inside pl-6">
                <li>
                  Directly from you: When you create an account, book an
                  appointment, fill out a form, or contact us.
                </li>
                <li>
                  Automatically: Via cookies, mobile identifiers, and analytics
                  tools when you use our Services.
                </li>
                <li>
                  From third parties: Healthcare providers, insurers, analytics
                  platforms, ad partners.
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-4 border-b border-b-slate-200 pb-4">
            <h2 className="text-xl">4. Why We Use Your Information</h2>
            <div className="mt-4">
              <ul className="list-disc list-inside pl-6">
                <li>To provide, personalize, and improve our Services.</li>
                <li>To help schedule appointments and deliver support.</li>
                <li>
                  To communicate with you (e.g., confirmations, reminders).
                </li>
                <li>For analytics, fraud prevention, and system security.</li>
                <li>To comply with legal obligations.</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 border-b border-b-slate-200 pb-4">
            <h2 className="text-xl">5. When and How We Share Your Data</h2>
            <div className="mt-4">
              We may share your data with:
              <ul className="list-disc list-inside pl-6 py-4">
                <li>
                  Healthcare Providers to schedule or manage appointments.
                </li>
                <li>
                  Service Providers (e.g., payment processors, hosting,
                  support).
                </li>
                <li>
                  Analytics & Advertising Partners (for insights or marketing,
                  with opt-out options).
                </li>
                <li>
                  Insurance Partners to check eligibility or coordinate billing.
                </li>
                <li>
                  Health Information Exchanges if applicable to your care.
                </li>
                <li>Law enforcement when required by law.</li>
                <li>
                  Third-party platforms (if you use social logins like Google or
                  Apple).
                </li>
              </ul>
              We do not sell your personal information for monetary gain. Some
              data sharing may qualify as "selling" or "sharing" under certain
              privacy laws—but you can opt out.
            </div>
          </div>
          <div className="mt-4 border-b border-b-slate-200 pb-4">
            <h2 className="text-xl">6. Cookies and Tracking Technologies</h2>
            <div className="mt-4">
              Docsure uses cookies and similar tools to:
              <ul className="list-disc list-inside pl-6 py-4">
                <li>Remember you and your preferences.</li>
                <li>Understand how you use our Services</li>
                <li>Improve and secure the experience</li>
                <li>Deliver relevant ads (with consent)</li>
              </ul>
              You can manage cookie preferences in your browser or opt-out
              through the "Your Privacy Choices" page on our website.
            </div>
          </div>
          <div className="mt-4 border-b border-b-slate-200 pb-4">
            <h2 className="text-xl">7. Data Security & Retention</h2>
            <div className="mt-4">
              We use industry-standard security measures to protect your
              personal data. While we do our best to keep your info safe, no
              system is 100% secure.
              <br />
              <br />
              We retain your information as long as needed to provide our
              Services and for legitimate business purposes (like legal
              compliance or dispute resolution). When no longer needed, we
              securely delete or de-identify it.
            </div>
          </div>
          <div className="mt-4 border-b border-b-slate-200 pb-4">
            <h2 className="text-xl">8. Children’s Privacy</h2>
            <div className="mt-4">
              We use industry-standard security measures to protect your
              personal data. While we do our best to keep your info safe, no
              system is 100% secure.
            </div>
          </div>
          <div className="mt-4 border-b border-b-slate-200 pb-4">
            <h2 className="text-xl">9. Your Rights & Choices</h2>
            <div className="mt-4">
              Depending on your location, you may have rights to:
              <ul className="list-disc list-inside pl-6 py-4">
                <li>Access or delete your data</li>
                <li>Correct inaccurate information</li>
                <li>Opt out of sharing for advertising</li>
                <li>Limit the use of sensitive personal info</li>
              </ul>
              You can exercise these rights by contacting us through our
              website. We’ll respond within the timeframes required by law.
            </div>
          </div>
          <div className="mt-4 border-b border-b-slate-200 pb-4">
            <h2 className="text-xl">10. Updates to This Policy</h2>
            <div className="mt-4">
              We may update this Privacy Policy as our practices or laws change.
              If we make material changes, we’ll notify you via email or on our
              website. Your continued use of Docsure means you accept the
              updated Policy.
            </div>
          </div>
        </div>
      </div>
      <FooterSection />
    </>
  );
}
