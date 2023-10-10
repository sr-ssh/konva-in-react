export const getGradient = (gradient: (string | number)[]) => {
  let gradientString = "linear-gradient(to right,";

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