import { GuidePage, type GuideStep } from "@/components/GuidePage";

const STEPS: GuideStep[] = [
  {
    number: "1",
    icon: "🔐",
    title: "LOGIN TO YOUR STUDENT PORTAL",
    description:
      "Open the NOUN Student Portal and log in with your student credentials.",
    details: [
      "Go to the NOUN Student Portal: https://www.nouonline.nou.edu.ng",
      "Select Student Login / Registered Students.",
      "Enter your Matriculation number.",
      "Enter your Password.",
      "Then click Login/Submit.",
      "If you have forgotten your password or cannot access your portal, use the appropriate NOUN support process instead of creating another student account unnecessarily.",
    ],
  },
  {
    number: "2",
    icon: "💳",
    title: "FUND YOUR E-WALLET FOR THE NEW SEMESTER",
    description:
      "Load your NOUN e-wallet with the amount required for your semester registration and intended course/examination registration.",
    details: [
      "From your student portal, go to Manage Wallet.",
      "Select Load Wallet.",
      "Enter the amount you want to put into your NOUN e-wallet.",
      "For example, if the amount required for the semester's registration and your intended course/exam registration is ₦XX,XXX, enter the required amount.",
      "Click PAY.",
      "The system will generate your Remita Retrieval Reference (RRR).",
      "Copy or save the RRR carefully. You will need it to make and subsequently validate the payment.",
      "Make the payment using the available Remita payment option.",
      "The RRR can also be copied and used for payment at a bank branch.",
      "After payment, keep your Remita receipt and RRR.",
    ],
  },
  {
    number: "3",
    icon: "🔍",
    title: "CONFIRM THE PAYMENT",
    description:
      "After making payment, confirm that the payment has been successfully processed and reflected in your NOUN wallet.",
    details: [
      "Return to your student portal and log in again if necessary.",
      "Go to Manage Wallet.",
      "Select Check Payment Status.",
      "Enter your Matriculation number.",
      "Enter the RRR generated for the payment.",
      "Click Check Wallet Payment.",
      "Confirm that the payment has been successfully processed.",
    ],
  },
  {
    number: "4",
    icon: "🧾",
    title: "CREDIT THE RRR IF PAYMENT IS NOT IN YOUR WALLET",
    description:
      "If you have successfully paid but the money does not appear in your wallet, use the Check RRR and Credit RRR options.",
    details: [
      "Go to Home.",
      "Select Check RRR.",
      "Enter the missing RRR.",
      "Check the payment status.",
      "If the RRR shows Successful, go to Wallet.",
      "Select Credit RRR.",
      "Enter the successful RRR.",
      "Check your wallet balance to confirm that the payment has been credited.",
    ],
  },
  {
    number: "5",
    icon: "📝",
    title: "REGISTER FOR THE NEW SEMESTER",
    description:
      "Once your payment is properly reflected in your wallet, proceed with your semester registration.",
    details: [
      "From the student portal, go to Home.",
      "Select Registration.",
      "Select Semester Registration.",
      "Enter the required semester registration information.",
      "Pay attention to the Semester Count field.",
      "The Semester Count should represent the number of compulsory fee payments made so far, including the present semester.",
      "Review the information you entered carefully.",
      "Click Submit.",
      "Once the semester registration is successful, proceed to course registration.",
    ],
  },
  {
    number: "6",
    icon: "📘",
    title: "REGISTER YOUR COURSES",
    description:
      "After completing your semester registration, register the courses you are taking for the current semester.",
    details: [
      "From the student portal, select Course Registration.",
      "Select Current Semester.",
      "Click Add Courses.",
      "Your available courses will be displayed.",
      "Select the courses you are supposed to take for the semester.",
      "Do not simply select every course displayed without checking your curriculum.",
      "Check the Course Code.",
      "Check the Course Title.",
      "Check the Credit Unit.",
      "Check whether the course is Compulsory or Elective.",
      "Confirm that the course belongs to the correct semester.",
      "After selecting the correct courses, click Submit.",
      "Review and confirm your course selection.",
    ],
  },
  {
    number: "7",
    icon: "📄",
    title: "PRINT COURSE REGISTRATION SLIP",
    description:
      "After successfully registering your courses, open and save your Course Registration Slip.",
    details: [
      "Select Course Registration Slip.",
      "Review the information on the slip.",
      "Confirm that your Name is correct.",
      "Confirm that your Matriculation number is correct.",
      "Confirm that your Programme is correct.",
      "Confirm that your Level is correct.",
      "Confirm that your Semester is correct.",
      "Check the Course Codes and Course Titles.",
      "Click Print.",
      "Save a PDF copy on your phone or computer.",
      "It is also advisable to print and keep a physical copy of the slip.",
    ],
  },
  {
    number: "8",
    icon: "✅",
    title: "REGISTER FOR EXAMINATION",
    description:
      "Course registration and examination registration are separate processes. You must complete examination registration after registering your courses.",
    details: [
      "From the student portal, select Register Courses for Exam.",
      "Select the courses you intend to write in the examination.",
      "Review your selected examination courses carefully.",
      "Click Submit.",
      "Confirm your examination registration.",
      "Make sure all the courses you intend to write are included.",
    ],
  },
  {
    number: "9",
    icon: "🧾",
    title: "PRINT EXAMINATION REGISTRATION SLIP",
    description:
      "After completing examination registration, view and save your examination registration slip.",
    details: [
      "Select See Exam Registration Slip.",
      "Review the examination registration information.",
      "Check that all the courses you intend to write are listed.",
      "Confirm your Name and Matriculation number.",
      "Confirm the Programme, Level and Semester.",
      "Confirm that the correct examination courses are displayed.",
      "Click Print.",
      "Save a PDF copy of the examination registration slip.",
      "It is advisable to print and keep a physical copy for your records.",
    ],
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

export default function RegisterSemesterGuidePage() {
  return (
    <GuidePage
      headerIcon="🎓"
      headerTitle="NOUN RETURNING STUDENT — SEMESTER REGISTRATION"
      headerSubtitle="Follow these steps to complete your semester, course and examination registration successfully."
      steps={STEPS}
      checklistTitle="Important Examination Tips"
      checklistItems={EXAM_TIPS}
    />
  );
}
