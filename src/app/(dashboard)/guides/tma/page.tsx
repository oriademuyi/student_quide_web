import { GuidePage, type GuideStep } from "@/components/GuidePage";

const STEPS: GuideStep[] = [
  {
    number: "1",
    icon: "🔐",
    title: "Activate Your eLearn Portal",
    description:
      "Before attempting your TMAs, you must first activate your NOUN eLearn account.",
    details: [
      "Log in to your NOUN Student Email.",
      "Look for the email sent by the eLearn Team containing your default password.",
      "Visit the NOUN eLearn Portal.",
      "Enter your Username and the default password provided in the email.",
      "Create a new password when prompted.",
      "Confirm your new password and save the changes.",
      "Log in again using your Username and newly created password.",
    ],
  },
  {
    number: "2",
    icon: "📘",
    title: "Access Your Registered Courses",
    description: "",
    details: [
      "After logging in, click Dashboard on the left side of the page.",
      "Select My Courses.",
      "A list of all your registered courses for the semester will be displayed.",
      "Click on the course you wish to attempt.",
    ],
  },
  {
    number: "3",
    icon: "🔍",
    title: "Complete the Required Discussion Forums",
    description:
      "Each course contains discussion forums that must be completed before the corresponding TMA becomes available.",
    details: [
      "To Unlock TMA 1",
      "Open Week 1.",
      "Select your study region: North East, North West, North Central, South East, South South, South West.",
      "Click on your region to open the discussion forum.",
      "Read the discussion question and type a meaningful response before submitting it.",
      "Repeat the same process for Week 2.",
      "After successfully participating in both Week 1 and Week 2 discussion forums, TMA 1 will be unlocked.",
    ],
  },
  {
    number: "4",
    icon: "📝",
    title: "Attempt TMA 1",
    description: "",
    details: [
      "Return to the course page.",
      "Scroll down and click TMA 1.",
      "Answer Questions 1–10.",
      "Review your answers carefully before submitting.",
    ],
  },
  {
    number: "5",
    icon: "📚",
    title: "Unlock and Attempt TMA 2",
    description:
      "To access TMA 2, you must participate in the discussion forums for Week 3 and Week 4. After contributing to both discussion forums:",
    details: [
      "Return to the course page.",
      "Click TMA 2.",
      "Answer all the questions and submit your work.",
    ],
  },
  {
    number: "6",
    icon: "✅",
    title: "Unlock and Attempt TMA 3",
    description:
      "To access TMA 3, participate in the discussion forums for Week 5 and Week 6. Once both discussion forum contributions have been completed:",
    details: [
      "Return to the course page.",
      "Click TMA 3.",
      "Answer all the questions and submit your responses.",
    ],
  },
  {
    number: "7",
    icon: "📤",
    title: "Repeat the Process for Every Course",
    description: "Follow the same procedure for each of your registered courses:",
    details: [
      "Activate your eLearn account (once only).",
      "Open the course.",
      "Visit the NOUN eLearn Portal.",
      "Participate in the required weekly discussion forums.",
      "Unlock the corresponding TMA.",
      "Complete and submit TMA 1, TMA 2, and TMA 3 before the deadline.",
    ],
  },
];

const IMPORTANT_NOTES = [
  "Ensure you have a stable internet connection while attempting your TMAs.",
  "Participate meaningfully in every discussion forum. Simply opening the page may not unlock the TMA.",
  "Read each question carefully before selecting your answer.",
  "Submit your TMA before the closing date. Late submissions are not accepted.",
  "Keep your eLearn login details safe and do not share your password with anyone.",
  "Confirm that your TMA has been submitted successfully before leaving the page.",
];

export default function TmaGuidePage() {
  return (
    <GuidePage
      headerIcon="🎓"
      headerTitle="How To Complete Your TMA"
      headerSubtitle="Follow these simple steps to prepare, write and submit your Tutor Marked Assignment successfully."
      steps={STEPS}
      checklistTitle="Important Notes"
      checklistItems={IMPORTANT_NOTES}
    />
  );
}
