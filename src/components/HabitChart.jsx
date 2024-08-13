import { useEffect, useState } from "react";

/**
 * Effort chart of the Employee
 *
 * @author Robert Koteles
 * @desc This component is for showing the activity of the Employee per each day. Tasks done should be marked by green allocated boxes, vertically per each day. The calendar should show 7 days only, user can paginate left or right if there is any rest of data to show.
 * @version 1.0.0
 * @component
 */
const HabitChart = ({ habitData }) => {
  const [actualFirstWeek, setActualFirstWeek] = useState(0);

  // for the first run of the app the previous button should be disabled
  useEffect(() => {
    document.getElementById("navPrevBtn").setAttribute("disabled", "disabled");
  }, []);

  let tempArray = [];

  // transform rows into columns, it's a matrix transpose function
  const transpose = (items) => {
    return items[0].map((_, i) => items.map((row) => row[i]));
  };

  // fill the whole array by values. Firstly all the 7 items should have classes, then need to set the boxes to green, depends on the value from the 'habitData' parameter
  habitData.map((item) => {
    tempArray.push(
      Array(7)
        .fill("", 0, 7)
        .fill("done", 7 - item, 7)
    );
  });

  tempArray = transpose(tempArray);

  // set disable status of the buttons
  const setStatus = (element, type) => {
    switch (type) {
      case "add":
        element.setAttribute("disabled", "disabled");
        break;
      case "remove":
        element.removeAttribute("disabled");
        break;
    }
  };

  // click handler
  const setWeek = (e) => {
    const elm = e.target;
    const buttons = elm.parentElement.querySelectorAll("button");
    const num = Number(elm.dataset.value);

    let tempWeek = actualFirstWeek + num;

    if (tempWeek < 0 || tempWeek > habitData.length - 7) {
      setStatus(elm, "add");
    } else {
      setActualFirstWeek(tempWeek);
      buttons.forEach((element) => {
        setStatus(element, "remove");
      });
    }
  };

  return (
    <div className="habitChart">
      <h3>Habit Chart</h3>

      <table id="chart">
        <tbody>
          {tempArray.map((row) => {
            return (
              <tr>
                {row.map((col, i) => {
                  if (i >= actualFirstWeek && i < actualFirstWeek + 7) {
                    return <td className={col}></td>;
                  }
                })}
              </tr>
            );
          })}

          {tempArray[0].map((item, i) => {
            if (i >= actualFirstWeek && i < actualFirstWeek + 7) {
              return <td>{i + 1}</td>;
            }
          })}
        </tbody>
      </table>
      <button id="navPrevBtn" data-value={-1} onClick={(e) => setWeek(e)}>
        Previous
      </button>
      <button id="navNextBtn" data-value={1} onClick={(e) => setWeek(e)}>
        Next
      </button>
    </div>
  );
};

export default HabitChart;
