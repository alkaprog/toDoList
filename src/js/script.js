import {
    getPreviousDate,
    getNextDate,
    writeFormatedDateToElement,
    writeDayNameToElement,
    formatDate,
    stringIsDate,
    parseDate,
} from "./dateFunctions.js";

import {
    postNoteList,
    createNote,
    saveNote,
    noteListExists,
    indexOfNoteByCreationTime,
    deleteNote,
    createNewNoteList,
    getTextFromNote,
    swapNotesOrder,
} from "./noteListFunctions.js";

let noteToEditID;
let selectedDate = new Date();
let displayedNoteListName;

function initNoteListEventListeners() {
    document
        .querySelector(".list-group")
        .addEventListener("mouseover", (event) => {
            if (event.target.classList.contains("list-group-item")) {
                event.target.firstElementChild.style.display = "inline-block";
            }
        });

    document
        .querySelector(".list-group")
        .addEventListener("mouseout", (event) => {
            if (
                event.target.classList.contains("list-group-item") &
                !event.target.contains(
                    document.elementFromPoint(event.clientX, event.clientY)
                )
            ) {
                event.target.firstElementChild.style.display = "none";
            }
        });

    document
        .querySelector(".list-group")
        .addEventListener("mouseout", (event) => {
            if (
                event.target.classList.contains("note-edit-buttons") &
                !event.target.contains(
                    document.elementFromPoint(event.clientX, event.clientY)
                ) &
                (document.elementFromPoint(event.clientX, event.clientY) !==
                    event.target.parentElement)
            ) {
                event.target.style.display = "none";
            }
        });

    document
        .querySelector(".list-group")
        .addEventListener("mouseout", (event) => {
            if (
                event.target.classList.contains("btn") &
                (document.elementFromPoint(event.clientX, event.clientY) !==
                    event.target.parentElement) &
                (document.elementFromPoint(event.clientX, event.clientY) !==
                    event.target.parentElement.parentElement)
            ) {
                event.target.parentElement.style.display = "none";
            }
        });

    document.querySelector(".list-group").addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-note-btn")) {
            try {
                deleteNote(
                    getSelectedNoteListName(),
                    event.target.parentElement.parentElement.id
                );
            } catch (err) {
                console.log("Ошибка! Возможно вы очистили Local Storage");
            }

            event.target.parentElement.parentElement.remove();
        }
    });

    document.querySelector(".list-group").addEventListener("click", (event) => {
        if (event.target.classList.contains("done-button")) {
            event.target.parentElement.parentElement.classList.toggle(
                "list-group-item-success"
            );
            saveNote(
                getTextFromNote(event.target.parentElement.parentElement.id),
                getSelectedNoteListName(),
                event.target.parentElement.parentElement.id,
                event.target.parentElement.parentElement.classList.contains(
                    "list-group-item-success"
                )
                    ? true
                    : false
            );
        }
    });

    document.querySelector(".list-group").addEventListener("click", (event) => {
        if (event.target.classList.contains("edit-button")) {
            noteToEditID = event.target.parentElement.parentElement.id;
            document.querySelector(".edit-note-input").value = getTextFromNote(
                event.target.parentElement.parentElement.id
            );
        }
    });

    //Модальное окно для редактирования списка дел
    document
        .querySelector("#save-edited-note")
        .addEventListener("click", (event) => {
            let inpuitField = document.querySelector(".edit-note-input");
            if (inpuitField.value != "") {
                let noteList = JSON.parse(
                    localStorage.getItem(getSelectedNoteListName())
                );
                let note = noteList[indexOfNoteByCreationTime(noteToEditID)];
                saveNote(
                    inpuitField.value,
                    getSelectedNoteListName(),
                    noteToEditID,
                    note.completed
                );
                postNoteList(".list-group", getSelectedNoteListName());
            }
        });

    document.querySelector(".previous-date").addEventListener("click", () => {
        writeNoteListNameToElement(
            ".selected-note-list-name",
            formatDate(getPreviousDate(selectedDate))
        );
        selectedDate = getPreviousDate(selectedDate);
        displayedNoteListName = formatDate(selectedDate);
        postNoteList(".list-group", getSelectedNoteListName());
    });

    document.querySelector(".next-date").addEventListener("click", () => {
        writeNoteListNameToElement(
            ".selected-note-list-name",
            formatDate(getNextDate(selectedDate))
        );
        selectedDate = getNextDate(selectedDate);
        displayedNoteListName = formatDate(selectedDate);
        postNoteList(".list-group", getSelectedNoteListName());
    });

    writeNoteListNameToElement(
        ".selected-note-list-name",
        formatDate(new Date())
    );
    postNoteList(".list-group", getSelectedNoteListName());
}

function initControlBlockListeners() {
    //модаолка с выбором списка дел
    document
        .querySelector(".choose-note-list-button")
        .addEventListener("click", (event) => {
            let noteLists = [];
            let noteListsNames = [];

            let dailyNoteLists = document.querySelector(".list-of-daily-notes");
            dailyNoteLists.innerHTML = ``;

            let customNoteLists = document.querySelector(
                ".list-of-custom-notes"
            );
            customNoteLists.innerHTML = ``;

            for (let key of Object.keys(localStorage)) {
                noteListsNames.push(key);
                noteLists.push(localStorage.getItem(key));

                dailyNoteLists.insertAdjacentHTML(
                    "beforeend",
                    `<li class="list-group-item">${key}</li>`
                );

                customNoteLists.insertAdjacentHTML(
                    "beforeend",
                    `<li class="list-group-item">${key}</li>`
                );
            }
        });

    document
        .querySelector("#add-note-btn")
        .addEventListener("click", (event) => {
            let inpuitField = document.querySelector(".add-note-input");
            let notes = document.querySelector(".list-group");
            if (inpuitField.value != "") {
                let creationTime = new Date().valueOf();
                let newNote = createNote(inpuitField.value, creationTime);

                notes.insertAdjacentHTML("beforeend", newNote);
                saveNote(
                    inpuitField.value,
                    getSelectedNoteListName(),
                    creationTime
                );
                inpuitField.value = "";
            }
        });

    document
        .querySelector("#create-note-list")
        .addEventListener("click", (event) => {
            let inpuitField = document.querySelector(".create-note-list-input");
            if (inpuitField.value != "") {
                createNewNoteList(inpuitField.value);
            }
        });

    document
        .querySelector("#select-note-list")
        .addEventListener("click", () => {
            let inpuitField = document.querySelector(".select-note-list-input");
            let noteListName = inpuitField.value;
            if ((noteListName != "") & noteListExists(noteListName)) {
                postNoteList(".list-group", noteListName);
                displayedNoteListName = noteListName;
                writeNoteListNameToElement(
                    ".selected-note-list-name",
                    noteListName
                );
                let buttons = document.querySelectorAll(
                    ".current-data-swap-button"
                );
                if (stringIsDate(noteListName)) {
                    selectedDate = parseDate(noteListName);
                    buttons.forEach((btn) => {
                        btn.classList.remove("d-none");
                    });
                } else {
                    buttons.forEach((btn) => {
                        btn.classList.add("d-none");
                    });
                }
            }
        });
}

function initTimeDisplay() {
    writeFormatedDateToElement(".current-date", new Date());
    writeDayNameToElement(".day-name", new Date());
}

function initDragNDrop() {
    let noteList = document.querySelector(".list-group");

    noteList.ondragover = allowDrop;
    noteList.ondragstart = drag;
    noteList.ondrop = drop;

    function allowDrop(event) {
        event.preventDefault();
    }
    //допилить, чтобы элемент отображался так же как и бало изначально
    function drag(event) {
        const element = document.elementFromPoint(event.clientX, event.clientY);
        if (element instanceof HTMLLIElement) {
            event.dataTransfer.setData("id", element.id);
            event.dataTransfer.setDragImage(element, 0, 0);
        }
    }

    function drop(event) {
        let startElementID = event.dataTransfer.getData("id");
        if (startElementID !== "") {
            const finishElement = document.elementFromPoint(
                event.clientX,
                event.clientY
            );
            if (finishElement instanceof HTMLLIElement) {
                swapElements(
                    document.getElementById(finishElement.id),
                    document.getElementById(startElementID)
                );
            }
            console.log(event.target);
        }
    }
}

function writeNoteListNameToElement(selector, name) {
    let selectedNoteListName = document.querySelector(selector);
    if (stringIsDate(name)) {
        selectedNoteListName.innerHTML = name;
        displayedNoteListName = name;
    } else {
        selectedNoteListName.innerHTML = name;
        displayedNoteListName = name;
    }
}

function swapElements(element1, element2) {
    var parentElement1 = element1.parentNode;
    var parentElement2 = element2.parentNode;
    var indexOfElement1, indexOfElement2;

    if (
        !parentElement1 ||
        !parentElement2 ||
        parentElement1.isEqualNode(element2) ||
        parentElement2.isEqualNode(element1)
    )
        return;

    for (var i = 0; i < parentElement1.children.length; i++) {
        if (parentElement1.children[i].isEqualNode(element1)) {
            indexOfElement1 = i;
        }
    }
    for (var i = 0; i < parentElement2.children.length; i++) {
        if (parentElement2.children[i].isEqualNode(element2)) {
            indexOfElement2 = i;
        }
    }

    if (
        parentElement1.isEqualNode(parentElement2) &&
        indexOfElement1 < indexOfElement2
    ) {
        indexOfElement2++;
    }
    parentElement1.insertBefore(
        element2,
        parentElement1.children[indexOfElement1]
    );
    parentElement2.insertBefore(
        element1,
        parentElement2.children[indexOfElement2]
    );
    swapNotesOrder(element1.id, element2.id);
}

function getSelectedNoteListName() {
    return displayedNoteListName;
}

initDragNDrop();
initTimeDisplay();
initNoteListEventListeners();
initControlBlockListeners();
