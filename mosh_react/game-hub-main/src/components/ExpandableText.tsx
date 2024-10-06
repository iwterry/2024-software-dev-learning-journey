import { useState } from "react";

interface ExpandableTextProps {
  maxDescriptionLength?: number;
  children: string;
}

export default function ExpandableText({ maxDescriptionLength = 100, children }: ExpandableTextProps) {
  const [ isShowingAll, setIsShowingAll ] = useState(false);

  const hasExceededLength = children.length > maxDescriptionLength
  
  const textToDisplay = hasExceededLength && !isShowingAll ?
    children.slice(0, maxDescriptionLength) + '...' :
    children;

  return (
    <>
      {textToDisplay}
      {hasExceededLength && (
        <button onClick={() => setIsShowingAll(!isShowingAll)} style={{marginLeft: "12px"}}>
          {isShowingAll ? 'Show Less' : 'Show More'}
        </button>
      )}
    </>
  );
}