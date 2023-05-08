import { PointersObject } from "../../pointersObjectType";

type CharacterProps = {
  pointers: PointersObject,
  idx: number,
  char: string,
  str: string
}

const Character = ({ pointers: { center, iPointer, rightBoundary, pldrmLength }, idx, char, str }: CharacterProps) => {
  const getClassName = (idx: number) => {
    const iMirror = 2 * center - iPointer;
    if (
      iPointer < rightBoundary &&
      pldrmLength[iMirror] > 0 &&
      idx >= iPointer - pldrmLength[iMirror] &&
      idx <= iPointer + pldrmLength[iMirror]
    ) {
      return 'bgRight';
    } else if (
      idx !== iPointer &&
      pldrmLength[iPointer] > 0 &&
      idx >= iPointer - pldrmLength[iPointer] &&
      idx <= iPointer + pldrmLength[iPointer]
    ) {
      return 'bgGreen';
    } else if (idx === iPointer) {
      return 'bgCenter';
    } else {
      return 'palindrome-char-wrapper';
    }
  };

  const bgColor = getClassName(idx);
  const lastCharacter = idx + 1 < str.length ? false : bgColor;

  return (
    <div className={!lastCharacter ? `${bgColor}` : 'palindrome-char-wrapper'}>
      <div>
        <p className="palindrome-char">{char}</p>
      </div>
    </div>
  )
};

export default Character;
