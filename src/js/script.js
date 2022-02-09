import {
    getPreviousDate,
    getNextDate,
    writeFormatedDateToElement,
    writeDayNameToElement,
    formatDate,
    stringIsDate,
} from "./dateFunctions.js";

import {
    postNoteList,
    createNewNote,
    saveNote,
    noteListExists,
    indexOfNoteByCreationTime,
    deleteNote,
    createNewNoteList,
    getTextFromNote,
} from "./noteListFunctions.js";

let noteToEditID;
let selectedDate = new Date();

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
                    getSelectedNoteListName(".selected-note-list-name"),
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
                getSelectedNoteListName(".selected-note-list-name"),
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
    document.querySelector("#edit-note").addEventListener("click", (event) => {
        console.log("click");
        let inpuitField = document.querySelector(".edit-note-input");
        if (inpuitField.value != "") {
            let noteList = JSON.parse(
                localStorage.getItem(
                    getSelectedNoteListName(".selected-note-list-name")
                )
            );
            let note = noteList[indexOfNoteByCreationTime(noteToEditID)];
            saveNote(
                inpuitField.value,
                getSelectedNoteListName(".selected-note-list-name"),
                noteToEditID,
                note.completed
            );
            postNoteList(
                ".list-group",
                getSelectedNoteListName(".selected-note-list-name")
            );
        }
    });

    document
        .querySelector(".previous-date")
        .addEventListener("click", (event) => {
            writeNoteListNameToElement(
                ".selected-note-list-name",
                getPreviousDate(selectedDate)
            );
            selectedDate = getPreviousDate(selectedDate);
            postNoteList(
                ".list-group",
                getSelectedNoteListName(".selected-note-list-name")
            );
        });

    document.querySelector(".next-date").addEventListener("click", (event) => {
        writeNoteListNameToElement(
            ".selected-note-list-name",
            getNextDate(selectedDate)
        );
        selectedDate = getNextDate(selectedDate);
        postNoteList(
            ".list-group",
            getSelectedNoteListName(".selected-note-list-name")
        );
    });

    writeNoteListNameToElement(".selected-note-list-name", new Date());
    postNoteList(
        ".list-group",
        getSelectedNoteListName(".selected-note-list-name")
    );
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
                let newNote = createNewNote(inpuitField.value, creationTime);

                notes.insertAdjacentHTML("beforeend", newNote);
                saveNote(
                    inpuitField.value,
                    getSelectedNoteListName(".selected-note-list-name"),
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
        .addEventListener("click", (event) => {
            let inpuitField = document.querySelector(".select-note-list-input");
            if ((inpuitField.value != "") & noteListExists(inpuitField.value)) {
                postNoteList(".list-group", inpuitField.value);
            }
        });
}

function initTimeDisplay() {
    writeFormatedDateToElement(".current-date", new Date());
    writeDayNameToElement(".day-name", new Date());
}

function writeNoteListNameToElement(selector, name) {
    let selectedNoteListName = document.querySelector(selector);
    if (stringIsDate(name)) {
        selectedNoteListName.innerHTML = formatDate(name);
    } else {
        selectedNoteListName.innerHTML = name;
    }
}

function getSelectedNoteListName(selector) {
    return document.querySelector(selector).innerHTML;
}

initTimeDisplay();
initNoteListEventListeners();
initControlBlockListeners();
