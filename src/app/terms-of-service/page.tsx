import { LegalPage } from "@/components/LegalPage";

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated="September 2, 2026"
      intro={
        "These terms govern your use of the Student Guide app and website. By creating an account or using the app, you agree to these terms. Student Guide is an independent, unofficial resource built for students of the National Open University of Nigeria (NOUN) — it is not operated by, affiliated with, or endorsed by NOUN."
      }
      sections={[
        {
          heading: "1. Description of Service",
          body: "Student Guide provides study resources, exam-preparation guides, course materials, and AI-assisted study tools (Explain, Solve, Summarize/AOC) to help students prepare for their studies. Some features require an active paid subscription.",
        },
        {
          heading: "2. Your Account",
          body: "You must provide accurate information when registering, and you are responsible for keeping your login details confidential and for all activity on your account. Notify us immediately if you suspect unauthorized use of your account.",
        },
        {
          heading: "3. Subscriptions & Payments",
          body: "Certain features are only available with an active paid subscription. Pricing and billing details are shown at the point of purchase. Payments are processed by a third-party payment provider. Refunds, where applicable, are handled in line with the terms shown at checkout.",
        },
        {
          heading: "4. AI-Generated Content",
          body: "Explanations, solved answers, summaries and areas of concentration produced by our AI features are generated automatically and may be incomplete or contain errors. They are study aids only — not official NOUN content, and not a substitute for your own understanding or for guidance from your lecturers. You are responsible for verifying important information and for complying with your institution's academic integrity policies when using AI assistance.",
        },
        {
          heading: "5. Acceptable Use",
          body: "You agree not to upload content you don't have the right to share, not to misuse the app to harass others or violate the law, and not to attempt to disrupt, reverse-engineer, or gain unauthorized access to the app or its systems.",
        },
        {
          heading: "6. Intellectual Property",
          body: "The app, its design, and its original content belong to Student Guide. Materials or questions you upload remain yours — by uploading, you confirm you have the right to share them and you grant us permission to process them solely to provide the feature you used.",
        },
        {
          heading: "7. Termination",
          body: "We may suspend or terminate your account if you violate these terms or misuse the app. You may stop using the app and request account deletion at any time.",
        },
        {
          heading: "8. Disclaimer & Limitation of Liability",
          body: 'The app is provided "as is" without warranties of any kind. Student Guide is not responsible for NOUN\'s own official systems, processes, exams, or payment portals (such as semester registration or Remita payments) — these remain entirely NOUN\'s responsibility. To the fullest extent permitted by law, Student Guide is not liable for indirect or consequential damages arising from your use of the app.',
        },
        {
          heading: "9. Governing Law",
          body: "These terms are governed by the laws of the Federal Republic of Nigeria.",
        },
        {
          heading: "10. Changes to These Terms",
          body: 'We may update these terms from time to time. We will update the "Last updated" date above when we do. Continued use of the app after a change means you accept the updated terms.',
        },
        {
          heading: "11. Contact Us",
          body: "If you have questions about these terms, contact us at support@studentguide.app.",
        },
      ]}
    />
  );
}
