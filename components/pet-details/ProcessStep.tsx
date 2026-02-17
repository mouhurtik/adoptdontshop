
interface ProcessStepProps {
  number: number;
  text: string;
}

const ProcessStep = ({ number, text }: ProcessStepProps) => (
  <li className="flex items-start">
    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-adoptGreen-light text-adoptGreen font-semibold mr-3">
      {number}
    </div>
    <span className="pt-1">{text}</span>
  </li>
);

export default ProcessStep;



