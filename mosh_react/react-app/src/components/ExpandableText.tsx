import { useState } from "react";

interface ExpandableTextProps {
  children: string;
  minTextLength?: number;
}
export default function ExpandableText({ children, minTextLength = 50 }: ExpandableTextProps) {
  const textLength =  children.length;
  let textToDisplay = children;
  const  [shouldShowMore, setShouldShowMore] = useState(false);
  const buttonText = shouldShowMore ? 'Show less' : 'Show more';
  const shouldShowButton = textLength > minTextLength;
  if (textLength > minTextLength && !shouldShowMore) {
    textToDisplay = children.slice(0, minTextLength) + '...';
  }

  


  return (
    <>
      { textToDisplay }
      { shouldShowButton && (
        <button onClick={() => setShouldShowMore(!shouldShowMore)}>{buttonText}</button>
      )}
    </>
  );
}