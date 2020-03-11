import React, { useState, useEffect } from "react";
import { restaurants, categoryDetails, foodDetails } from "../foodData";
import { distance } from "../utils";
import { Twemoji } from "react-emoji-render";
import { useSpring, useChain, animated } from "react-spring";
import Zoom from "react-reveal/Zoom";

const WouldYouRather = () => {
  const [resultantRestos, updateResultantRestos] = useState(restaurants);
  const questionKeys = ["category", "food"];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestionKey = questionKeys[currentQuestionIndex];

  const [randomValues, setRandomValues] = useState([]);
  const [foodMatch, setFoodMatch] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(data => {
      const position = [data.coords.latitude, data.coords.longitude];
      const restosWithBranchesSortedByDistance = resultantRestos.map(resto => ({
        ...resto,
        branches: resto.branches
          .map(branch => {
            return {
              ...branch,
              distance: distance(...position, ...branch.longLat)
            };
          })
          .sort((a, b) => a.distance - b.distance)
      }));
      updateResultantRestos(restosWithBranchesSortedByDistance);
    });
  }, []);

  useEffect(() => {
    if (resultantRestos.length > 0) {
      generateRandomValues();
    } else {
      alert("You ran out of options");
    }
  }, [resultantRestos]);

  const generateRandomValues = () => {
    const options = resultantRestos.reduce((acc, item) => {
      acc.food = acc.food ? [...acc.food, ...item.food] : item.food;
      acc.category = acc.category
        ? [...acc.category, ...item.category]
        : item.category;
      return acc;
    }, {});

    const originalOptions = options[currentQuestionKey].slice(0);
    const randomValue1 =
      originalOptions[Math.floor(Math.random() * originalOptions.length)];
    const tempOptionsWithoutVal1 = originalOptions.filter(
      i => i !== randomValue1
    );
    const randomValue2 =
      tempOptionsWithoutVal1[
        Math.floor(Math.random() * tempOptionsWithoutVal1.length)
      ];
    setRandomValues([
      {
        type: currentQuestionKey,
        name: randomValue1
      },
      {
        type: currentQuestionKey,
        name: randomValue2
      }
    ]);
  };
  return (
    <div>
      <p className="wur__header">
        {foodMatch
          ? "Hurray!"
          : currentQuestionKey === "category"
          ? `${2 - currentQuestionIndex} Q's Away From Food`
          : "Almost "}
      </p>
      <div className="wur">
        <Zoom top cascade>
          <div className="wur__options-container">
            {!foodMatch ? (
              randomValues.map(item => (
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
                    } else {
                      setFoodMatch(newItems);
                    }
                  }}
                >
                  {currentQuestionKey === "category" ? (
                    <Twemoji
                      text={
                        categoryDetails.find(i => i.name === item.name).icon
                      }
                      onlyEmojiClassName="emoji-image"
                    />
                  ) : null}
                  {currentQuestionKey === "food" ? (
                    <Twemoji
                      text={
                        foodDetails.find(i => i.name === item.name)
                          ? foodDetails.find(i => i.name === item.name).icon
                          : "s"
                      }
                      onlyEmojiClassName="emoji-image"
                    />
                  ) : null}
                  {item.name}
                </div>
              ))
            ) : (
              <div className="result">
                {resultantRestos
                  .sort(
                    (a, b) => a.branches[0].distance - b.branches[0].distance
                  )
                  .slice(0, 3)
                  .map((item, indx) => {
                    if (indx === 0) {
                      return (
                        <div key={item.name} className="top">
                          <div className="top__image-container">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/7/73/Pizza_Hut_1967-1999_logo.svg" />
                          </div>
                          <div className="top__info">
                            <p>{item.name}</p>
                            <div>
                              <p>Category</p>
                              <p>
                                <Twemoji
                                  onlyEmojiClassName="emoji-image--small"
                                  text="🇮🇹"
                                />
                              </p>
                              <div>
                                <p>It just:</p>
                                <p>
                                  <Twemoji
                                    onlyEmojiClassName="emoji-image--small"
                                    text="📏"
                                  />
                                  0.9 KM
                                </p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <p>Food:</p>
                            <p>
                              {item.food.map(f => (
                                <Twemoji
                                  key={f}
                                  onlyEmojiClassName="emoji-image--small"
                                  text={
                                    foodDetails.find(i => i.name === f)
                                      ? foodDetails.find(i => i.name === f).icon
                                      : "s"
                                  }
                                />
                              ))}
                            </p>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div key={item.name} className="silver">
                          {item.name}
                        </div>
                      );
                    }
                  })}
              </div>
            )}
          </div>
        </Zoom>
        {!foodMatch ? (
          <p
            className="wur__none"
            onClick={() => {
              const updatedRestos = resultantRestos.filter(resto => {
                return (
                  resto[currentQuestionKey][0] !== randomValues[0].name &&
                  resto[currentQuestionKey][0] !== randomValues[1].name
                );
              });
              updateResultantRestos(updatedRestos);
            }}
          >
            None
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default WouldYouRather;
