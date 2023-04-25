"use strict";
class ListOfPolicyholders {
  constructor() {
    const policyholdersZeStorage = localStorage.getItem("policyholders");
    this.policyholders = policyholdersZeStorage
      ? JSON.parse(policyholdersZeStorage)
      : [];

    this.firstnameInput = document.getElementById("firstname");
    this.lastNameInput = document.getElementById("lastname");
    this.ageInput = document.getElementById("age");
    this.phoneNumberInput = document.getElementById("phoneNumber");
    this.submitButton = document.getElementById("submit");
    this.cancelButton = document.getElementById("cancel");
    this.displayElement = document.getElementById("list-policyholders");
    this.isEdit = false;
    this.activePolicyholderId = null;
    this._setEvents();
  }

  _setEvents() {
    this.cancelButton.onclick = () => this.handleCancelButton();
    this.submitButton.onclick = (e) => {
      e.preventDefault();

      if (this.isEdit) {
        const allPolicyholderWithoutEdited = this.policyholders.filter(
          (policyholder) => policyholder.id !== this.activePolicyholderId
        );
        const activePolicyholder = this.policyholders.find(
          (policyholder) => policyholder.id === this.activePolicyholderId
        );
        const editedPolicyholder = {
          ...activePolicyholder,
          firstname: this.firstnameInput.value,
          lastname: this.lastNameInput.value,
          age: this.ageInput.value,
          phoneNumber: this.phoneNumberInput.value,
        };

        allPolicyholderWithoutEdited.push(editedPolicyholder);
        this.policyholders = allPolicyholderWithoutEdited;
      } else {
        if (
          this.firstnameInput.value.length !== 0 &&
          this.lastNameInput.value.length !== 0 &&
          this.ageInput.value > 0 &&
          this.ageInput.value < 150 &&
          this.phoneNumberInput.value.length >= 9 &&
          this.phoneNumberInput.value.length <= 12
        ) {
          const policyholder = new Policyholder(
            this.policyholders.length + 1,
            this.firstnameInput.value,
            this.lastNameInput.value,
            this.ageInput.value,
            this.phoneNumberInput.value
          );
          this.policyholders.push(policyholder);
        } else {
          e.preventDefault();
          alert("Musíte vyplnit správně všechna pole!");
        }
      }
      this.savePolicyholders();
      this.clearValues();
      this.displayPolicyholders();
    };
  }

  displayPolicyholders() {
    this.displayElement.innerHTML = "";
    for (const policyholder of this.policyholders) {
      const addPolicyholder = document.createElement("tr");
      addPolicyholder.className = "addPolicyholder";

      addPolicyholder.insertAdjacentHTML(
        "beforeend",
        `<td>${policyholder.firstname} ${policyholder.lastname}</td> 
        <td>${policyholder.age}</td>
        <td>${policyholder.phoneNumber}</td>`
      );

      this.__addButton(
        "Editovat",
        () => {
          const editPolicyholder = this.policyholders.find(
            (poj) => poj.id === policyholder.id
          );
          this.phoneNumberInput.value = editPolicyholder.phoneNumber;
          this.firstnameInput.value = editPolicyholder.firstname;
          this.lastNameInput.value = editPolicyholder.lastname;
          this.ageInput.value = editPolicyholder.age;
          this.isEdit = true;
          this.activePolicyholderId = editPolicyholder.id;
        },
        addPolicyholder
      );

      this.__addButton(
        "Smazat",
        () => {
          if (confirm("Opravdu si přejete odstranit pojištence?")) {
            this.policyholders = this.policyholders.filter(
              (poj) => poj.id !== policyholder.id
            ); // Ponechá vše co není rovné proměnné item
            this.savePolicyholders();
            this.displayPolicyholders();
          }
        },
        addPolicyholder
      );

      addPolicyholder.insertAdjacentHTML("beforeend", "</tr>");
      this.displayElement.appendChild(addPolicyholder);
    }
  }

  __addButton(titulek, callback, element) {
    const button = document.createElement("button");
    button.onclick = callback;
    button.innerText = titulek;
    element.appendChild(button);
  }

  savePolicyholders() {
    localStorage.setItem("policyholders", JSON.stringify(this.policyholders));
    this.isEdit = false;
  }

  handleCancelButton() {
    this.clearValues();
  }

  clearValues() {
    this.phoneNumberInput.value = "";
    this.firstnameInput.value = "";
    this.lastNameInput.value = "";
    this.ageInput.value = "";
  }
}
