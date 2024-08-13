import { useState } from "react";

/**
 * Factory supply chain
 * 
 * @author Robert Koteles
 * @desc This component is for marking chain dependancy in the lifecycle of a factory. If a step is not available, any other steps after, related to that step should be disabled.
 * @version 1.0.0
 * @component
 */
const FactoryStatus = () => {
  // current status of each factory steps
  const [stationStates, setStationStates] = useState({
    sheets: true,
    beams: true,
    bolts: true,
    frames: true,
  });

  // dependency queue
  const dependencyArray = [
    ["sheets", "beams", "frames"],
    ["bolts", "frames"],
  ];

  const setItem = (item) => {
    let falseItems = [];

    // create a deep clone of the status object to avoid memory issues
      let tempStationStates = Object.assign({}, stationStates);
      
    // progress flags
    let statusItemsAfter = [true, true];
    let hasItemClick = [false, false];

    // user clicked on a checkbox, however the logical value of being checked should be the opposite
    tempStationStates[item] = !tempStationStates[item];

    // check the dependencies in order of clicked item and the already existing status of each steps
    dependencyArray.map((dependencyGroup, dependencyGroupIndex) => {
      dependencyGroup.map((step) => {
        if (item === step) {
          hasItemClick[dependencyGroupIndex] = true;
          statusItemsAfter[dependencyGroupIndex] = tempStationStates[step];
        }

        if (!hasItemClick[dependencyGroupIndex]) {
          hasItemClick[dependencyGroupIndex] = true;
          statusItemsAfter[dependencyGroupIndex] = tempStationStates[step];
        }

        if (!statusItemsAfter[dependencyGroupIndex]) {
          falseItems.push(step);
        }

        if (falseItems.includes(step)) {
          statusItemsAfter[dependencyGroupIndex] = false;
        }

        tempStationStates[step] = statusItemsAfter[dependencyGroupIndex];
      });
    });

    setStationStates(tempStationStates);
  };

  return (
    <div>
      <h3>Control Panel</h3>
      
      // TODO: for some reason the for(... in...) iteration was marked as an issue by Linter, that's why I approached by the Object way
      {Object.entries(stationStates).map((entry) => {
        let key = entry[0];
        let value = entry[1];

        return (
            <div key={key}>
            <input
              type="checkbox"
              id={`${key}-status`}
              checked={value}
              onClick={() => setItem(key)}
            />
            <label
              htmlFor={`${key}-status`}
              id={`${key}-station`}
              style={{ backgroundColor: value ? "" : "red" }}
            >
              {key.toUpperCase()} {value.toString()}{" "}
            </label>
          </div>
        );
      })}
    </div>
  );
};

// TODO: I cannot see the meaning of having this code here, is should be removed in the real life. It's kept here due to the test
/*
setTimeout(() => {
  document.getElementById("sheets-station").click();
  console.log(document.getElementById("sheets-station").outerHTML);
  console.log(document.getElementById("beams-station").outerHTML);
  console.log(document.getElementById("bolts-station").outerHTML);
  console.log(document.getElementById("frames-station").outerHTML);
}, 200);
*/

export default FactoryStatus;
