import React, { FC } from 'react'
type AddTextProps = {
  close: (text: string) => void,
}

const AddText: FC<AddTextProps> = ({close}) => {
  const pRef = React.useRef<HTMLParagraphElement>(null)
  return (
    <div onClick={() => pRef.current?.innerText && close(pRef.current?.innerText)} style={{
      alignItems: "center",
      background: "rgba(0, 0, 0, .5)",
      border: "none",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: 'column',
      flexShrink: 0,
      height: "100%", inset: 0,
      overflow: "hidden",
      padding: "16px",
      position: "absolute",
      top: 0,
      verticalAlign: "baseline",
      zIndex: 3,
      outline: "none",
    }}> <p ref={pRef} contentEditable style={{ outline: "none", width: "100%", color: "white" }}></p></div >
  )
}

export default AddText