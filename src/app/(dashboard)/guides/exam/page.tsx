import { GuidePage, type GuideStep } from "@/components/GuidePage";

const STEPS: GuideStep[] = [
  {
    number: "1",
    icon: "🔐",
    title: "Take Your Seat",
    description: "",
    details: [
      "Upon entering the examination hall, locate the computer system assigned to you by the invigilator.",
      "Sit only at the computer allocated to you.",
      "Ensure the computer displays the NOUN logo on the desktop before proceeding.",
    ],
  },
  {
    number: "2",
    icon: "📘",
    title: "Log In to the Examination System",
    description: "",
    details: [
      "Double-click the NOUN e-Exam icon on the desktop (if it is not already open).",
      "At the login page — Username: Enter your Matriculation Number. Password: Enter your Matriculation Number in lowercase letters (for example, nou123456789).",
      "Click Login.",
      "You will be taken to the NOUN e-Examination Environment.",
    ],
  },
  {
    number: "3",
    icon: "🔍",
    title: "Select Your Course",
    description: "",
    details: [
      "A list of the courses you registered for examination will appear.",
      "Click on the course you are scheduled to write.",
      "Read the examination instructions carefully.",
      "Click Start Attempt to begin the examination.",
    ],
  },
  {
    number: "4",
    icon: "📝",
    title: "Answer the Questions",
    description: "",
    details: [
      "Each page contains 10 questions.",
      "Some questions are Multiple Choice Questions (MCQs).",
      "Others are Fill-in-the-Blank questions.",
      "For Multiple Choice Questions, read each question carefully and select the correct option by clicking A, B, C, or D.",
      "For Fill-in-the-Blank Questions, type your answer carefully, pay attention to capital and small letters (case sensitivity) where required, and check your spelling before moving to the next question.",
    ],
  },
  {
    number: "5",
    icon: "📚",
    title: "Move Through the Examination",
    description: "",
    details: [
      "After answering all the questions on a page, click Next.",
      "Continue answering each page until you reach the last page of the examination.",
    ],
  },
  {
    number: "6",
    icon: "✅",
    title: "Review Your Answers",
    description:
      "Before submitting your examination: you may return to any question you skipped or wish to review.",
    details: [
      "Use either the question numbers displayed on the side of the screen, or the navigation boxes below the examination page.",
      "Generally: shaded boxes indicate questions you have answered. Unshaded boxes indicate questions that have not yet been answered.",
      "Ensure all questions have been answered before submitting your examination.",
    ],
  },
  {
    number: "7",
    icon: "📤",
    title: "Submit Your Examination",
    description: "After reviewing your answers,",
    details: [
      "Click Finish Attempt.",
      "Click Submit to submit your examination.",
      "Once you submit your examination, you cannot make any further changes to your answers.",
    ],
  },
  {
    number: "8",
    icon: "🧾",
    title: "View Your Result",
    description:
      "After successfully submitting your examination, your score or grade will be displayed on the screen (where applicable).",
    details: ["Ensure you have seen your submission confirmation before leaving your seat."],
  },
];

const EXAM_TIPS = [
  "Arrive at the examination venue early.",
  "Listen carefully to the instructions given by the invigilators.",
  "Do not attempt to log in using another student's details.",
  "Read every question carefully before answering.",
  "Manage your time wisely throughout the examination.",
  "Review unanswered questions before submitting.",
  "Do not click Finish Attempt until you are satisfied with all your answers.",
  "Remain seated until you are instructed to leave the examination hall.",
];

export default function ExamGuidePage() {
  return (
    <GuidePage
      headerIcon="🎓"
      headerTitle="CBT Examination"
      headerSubtitle="The National Open University of Nigeria (NOUN) conducts its examinations using a Computer-Based Test (CBT) platform. Follow the steps below to successfully complete your examination."
      steps={STEPS}
      checklistTitle="Important Examination Tips"
      checklistItems={EXAM_TIPS}
    />
  );
}
