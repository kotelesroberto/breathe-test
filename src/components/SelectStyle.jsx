import { useEffect, useState } from "react";

/**
 * Style select element
 * 
 * @author Robert Koteles
 * @desc `
    Complete the form element on the Data Entry page that allows a user to submit a name and opinion. Without using inline CSS, achieve the following:
    • The name should be represented by a text input element, with the placeholder text: "Write your name here..." and the label "Name".
    • The opinion should be represented by a drop down box element containing three options: "Positive", "Neutral" and "Negative" (content and value). It should also have the label "Opinion".
    • The background color for the last option in the drop down box should be "green" and text color should be "white", whereas the background color of dropdown box itself and the rest of the option elements should be "white" and text color should be "black" (see image).
    • The form should contain a submit button.
    • Each element of the form should be styled so that it occupies the entire width of the screen, with a 2% margin on the left and the right.
`
 * @version 1.0.0
 * @component
 */
const SelectStyle = () => {
  /** Transformation */
  const getSelectElements = () => {
    return document.querySelectorAll("select");
  };

  const createStyledDropdownElement = (selectElm) => {
    let dropdownContainer = "";
    let carriedAttributes = "";
    let optionItems = "";
    let selectedItemText = "";
    let selectedItemValue = "";

    // Copy the original functional attributes as data attribute to the new element
    if (selectElm.required) {
      selectElm.required = false;
      carriedAttributes += ` data-required='true'`;
    }
    if (selectElm.getAttribute("aria-required")) {
      selectElm.removeAttribute("aria-required");
      carriedAttributes += ` data-aria-required='true'`;
    }

    // get its options
    const options = Array.from(selectElm.options);

    options.forEach((option, i) => {
      if (option.selected === true) {
        selectedItemText = option.text;
        selectedItemValue = option.value;
      }

      let disableProp =
        option.disabled === true ? "selectmenu-option--disabled" : "";
      let selectedProp =
        selectElm.value === option.value ? "selectmenu-option--selected" : "";
      let ariaDisableProp =
        option.disabled === true ? 'aria-disabled="disabled"' : "";

      optionItems += `
            <li class="selectmenu-option ${disableProp} ${selectedProp}" id="${option.value
        .replace(/[^0-9a-z ]/gi, "")
        .split(" ")
        .join("_")
        .toLowerCase()}" data-val="${option.value}" ${ariaDisableProp}>${
        option.text
      }</li>
          `;
    });

    // create unique id for aria control attributes
    let selectMenuId = `selectmenu-options-${new Date().getTime()}${
      selectedItemText.length
    }${parseInt(Math.random() * 10)}`;

    dropdownContainer = `
          <div class="selectmenu" ${carriedAttributes}>
            <button type="button" class="selectmenu-container" aria-expanded="false" aria-controls="${selectMenuId}" data-text="${selectedItemText}" data-val="${selectedItemValue}" tabindex="0" >
              <span class="selectmenu-label">${selectedItemText}</span>
              <span class="selectmenu-arrow"></span>
            </button>
            <ul class="selectmenu-options hide" id="${selectMenuId}">
              ${optionItems}
            </ul>
          </div>
        `;

    // create insertable DOM markup from the controlGroupContent
    return document.createRange().createContextualFragment(dropdownContainer);
  };

  const createStyledDropdown = (selectElements) => {
    selectElements.forEach((selectElm) => {
      if (!selectElm.classList.contains("selectmenu-transformed")) {
        let styledDropdown = createStyledDropdownElement(selectElm);
        insertStyledDropdown(selectElm, styledDropdown);
        initEvent(selectElm);
      }
    });
  };

  const insertStyledDropdown = (selectElm, styledDropdown) => {
    // hide the original select DOM element
    selectElm.style.display = "none";
    selectElm.classList.add("selectmenu-transformed"); // to avoid duplication
    selectElm.setAttribute("aria-disabled", false);
    selectElm.setAttribute("aria-required", true);

    // insert the styled dropdown after the select DOM element
    selectElm.parentNode.insertBefore(styledDropdown, selectElm.nextSibling);
  };

  /** Event handlers */
  const clickEventOnContainer = (e) => {
    e.preventDefault();

    let selectMenu = e.target.closest(".selectmenu");
    let selectMenuContainer = selectMenu.querySelector(".selectmenu-container");
    let ariaValue = true;

    if (selectMenu.classList.contains("selectmenu--active")) {
      ariaValue = false;
    }

    selectMenu.classList.toggle("selectmenu--active");
    selectMenuContainer.setAttribute("aria-expanded", ariaValue);
  };

  const setSelectedOption = (elm, selectMenu, config) => {
    // set the previously selected element unselected
    let selectedOption = selectMenu.querySelector(
      ".selectmenu-option--selected"
    );

    if (selectedOption !== null) {
      selectedOption.classList.remove("selectmenu-option--selected");
    }
    // set the option as selected one
    elm.classList.add("selectmenu-option--selected");

    // set the visible text and data
    let selectMenuContainer = selectMenu.querySelector(".selectmenu-container");
    selectMenuContainer.setAttribute("data-text", config.optionText);
    selectMenuContainer.setAttribute("data-val", config.optionVal);
    selectMenuContainer.querySelector(".selectmenu-label").innerHTML =
      config.optionText;

    let sourceSelect = selectMenu.parentNode.querySelector("select");
    sourceSelect.value = config.optionVal;

    // trigger a change event if there is any function connected to the original select element when changing
    sourceSelect.dispatchEvent(new Event("change"));
  };

  const clickEventOnOption = (e) => {
    e.preventDefault();

    // option is disabled
    if (e.target.classList.contains("selectmenu-option--disabled")) return;

    // set the value of the original select element
    let selectMenu = e.target.closest(".selectmenu");

    let config = {
      optionID: e.target.getAttribute("id"),
      optionVal: e.target.getAttribute("data-val"),
      optionText: e.target.textContent,
    };

    // set the option as selected one
    setSelectedOption(e.target, selectMenu, config);

    // close dropdown
    e.target.closest(".selectmenu").classList.remove("selectmenu--active");

    let selectMenuContainer = selectMenu.querySelector(".selectmenu-container");
    selectMenuContainer.setAttribute("aria-expanded", false);
  };

  const initEvent = (selectElm) => {
    let styledDropdown = selectElm.parentNode.querySelector(".selectmenu");

    let smContainer = styledDropdown.querySelector(".selectmenu-container");
    let smOptionsContainer = styledDropdown.querySelector(
      ".selectmenu-options"
    );
    let smOptions = smOptionsContainer.querySelectorAll(".selectmenu-option");

    // init click on the visible field
    smContainer.removeEventListener("click", clickEventOnContainer);
    smContainer.addEventListener("click", clickEventOnContainer);

    // init click on the list items as options
    smOptions.forEach((option) => {
      option.removeEventListener("click", clickEventOnOption);
      option.addEventListener("click", clickEventOnOption);
    });

    // init keypress event on the visible field
    // TODO

    // init click on the document
    // TODO
  };

  useEffect(() => {
    createStyledDropdown(getSelectElements());
  }, []);

  return (
    <div>
      <h3>Style select element</h3>

      <form className="flex flex-col margin-l-2  margin-r-2">
        <label htmlFor="name">Name</label>
        <input id="name" placeholder="Write your name here..." />

        <label htmlFor="opinion">Opinion</label>
        <select id="opinion" aria-required="true" required="true">
          <option value="positive">Positive</option>
          <option value="neutral">Neutral</option>
          <option value="negative">Negative</option>
        </select>
        <input value="Submit" type="submit" />
      </form>
    </div>
  );
};

export default SelectStyle;
