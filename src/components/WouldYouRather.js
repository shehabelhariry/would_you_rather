import React, { useState } from "react";
import { restaurants } from "../foodData";

const WouldYouRather = () => {
  const [resultantRestos, updateResultantRestos] = useState(restaurants);
  const questionKeys = ["category", "food", "dtime"];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestionKey = questionKeys[currentQuestionIndex];

  const chooseOptions = () => {
    const options = resultantRestos.reduce((acc, item) => {
      const h = Object.entries(item);
      h.forEach(element => {
        const t = acc[element[0]]
          ? [...acc[element[0]], ...element[1]]
          : element[1];
        acc[[element[0]]] = [...new Set(t)];
      });
      return acc;
    }, {});
    console.log(options);
    const tempOptions = options[currentQuestionKey].slice(0);
    const randomValue1 =
      tempOptions[Math.floor(Math.random() * tempOptions.length)];
    const tempOptionsWithoutVal1 = tempOptions.filter(i => i !== randomValue1);
    const randomValue2 =
      tempOptionsWithoutVal1[
        Math.floor(Math.random() * tempOptionsWithoutVal1.length)
      ];
    return [
      {
        type: currentQuestionKey,
        name: randomValue1
      },
      {
        type: currentQuestionKey,
        name: randomValue2
      }
    ];
  };
  return (
    <div>
      {resultantRestos.length}
      <div className="wur">
        {resultantRestos.length > 1 ? (
          chooseOptions().map(item => (
            <div
              className="wur__option"
              key={item.name}
              onClick={() => {
                const newItems = resultantRestos.filter(resto =>
                  resto[currentQuestionKey].includes(item.name)
                );
                updateResultantRestos(newItems);
                if (currentQuestionIndex !== questionKeys.length - 1) {
                  setCurrentQuestionIndex(currentQuestionIndex + 1);
                }
              }}
            >
              {item.name}
            </div>
          ))
        ) : (
          <div>Go for : {resultantRestos.map(i => i.name)}</div>
        )}
      </div>
      <p className="wur__none">None</p>
    </div>
  );
};

export default WouldYouRather;
