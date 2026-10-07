import { LegalPage } from "@/components/LegalPage";

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="September 2, 2026"
      intro={
        'Student Guide ("we", "us", "our") respects your privacy. This policy explains what information we collect through the Student Guide app and website, how we use it, and the choices you have. Student Guide is an independent, unofficial resource built for students of the National Open University of Nigeria (NOUN) — it is not operated by, affiliated with, or endorsed by NOUN.'
      }
      sections={[
        {
          heading: "1. Information We Collect",
          body: "Account information: your name, email address, matric number, phone number, password, and academic details (program, department, faculty and level).\n\nContent you submit: statements, questions, course materials and past questions you type or upload when using our study and ExamAI features (Explain, Solve, Summarize/AOC).\n\nSubscription information: when you subscribe, we store your plan, payment status, reference and dates. Your card or payment details are handled directly by our third-party payment processor — we do not store them.\n\nUsage information: notifications, login activity and general feature usage, used to operate and improve the app.",
        },
        {
          heading: "2. How We Use Your Information",
          body: "We use your information to: create and secure your account; verify you as a student; provide the features you request, including generating AI explanations, solved answers and material summaries from the content you submit; process subscription payments; send you service-related notifications; respond to support requests; and maintain and improve the app.",
        },
        {
          heading: "3. How We Share Your Information",
          body: "We share content you submit to our AI features with third-party AI service providers, solely so they can generate the explanation, answer or summary you requested.\n\nWe share subscription and payment details with a third-party payment processor, solely to process your payment.\n\nWe do not sell your personal information, and we do not share it with third parties for their own advertising or marketing purposes. We may disclose information where required by law.",
        },
        {
          heading: "4. Data Storage & Security",
          body: "Your information is stored on secure servers, and authentication tokens are stored on your device using secure local storage. We apply reasonable technical and organizational measures to protect your information, but no method of transmission or storage is 100% secure.",
        },
        {
          heading: "5. Your Rights",
          body: "You can request access to, correction of, or deletion of your personal information at any time by contacting us at the email below. We will respond within a reasonable time and in line with applicable data protection law, including the Nigeria Data Protection Regulation (NDPR).",
        },
        {
          heading: "6. Data Retention",
          body: "We retain your information for as long as your account is active or as needed to provide the app's services. If you request deletion, we will delete or anonymize your information unless we are required to retain it by law.",
        },
        {
          heading: "7. Children's Privacy",
          body: "Student Guide is intended for university-level students and is not directed at children. We do not knowingly collect personal information from children.",
        },
        {
          heading: "8. Changes to This Policy",
          body: 'We may update this policy from time to time. We will update the "Last updated" date above when we do. Continued use of the app after a change means you accept the updated policy.',
        },
        {
          heading: "9. Contact Us",
          body: "If you have questions about this policy or how your information is handled, contact us at support@studentguide.app.",
        },
      ]}
    />
  );
}
