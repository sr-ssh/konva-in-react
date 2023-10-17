export const getGradient = (gradient: (string | number)[], angle: string = "to right") => {
  let gradientString = `linear-gradient(${angle},`;

  for (let i = 0; i < gradient.length; i += 2) {
    const color = gradient[i + 1];

    gradientString += `${color}`;

    if (i !== gradient.length - 2) {
      gradientString += ", ";
    }
  }

  gradientString += ")";
  return gradientString;
}

export const placeCursorAtTheEnd = (event: React.ChangeEvent<HTMLDivElement>) => {
  const selection = window.getSelection();
  if (selection) {
    const range = document.createRange();
    range.selectNodeContents(event.target);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}