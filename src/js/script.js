import {
    getPreviousDate,
    getNextDate,
    getDayName,
    writeFormatedDateToElement,
    writeDayNameToElement,
    formatDate
} from "./dateFunctions.js";

//let SELECTED_DATE;
let noteToEditID;
let selectedDate = new Date();

function initNoteListEventListeners() {
    document
        .querySelector(".list-group")
        .addEventListener("mouseover", (event) => {
            //console.log(event.target);
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
            //console.log(event.target);
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
            //console.log(event.target);
            if (
                event.target.classList.contains("btn") &
                (document.elementFromPoint(event.clientX, event.clientY) !==
                    event.target.parentElement) &
                (document.elementFromPoint(event.clientX, event.clientY) !==
                    event.target.parentElement.parentElement)
            ) {
                //console.log("yeah!");
                event.target.parentElement.style.display = "none";
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
                saveNoteToLocalStorage(
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
        .addEventListener("click", (event) => {
            let inpuitField = document.querySelector(".select-note-list-input");
            if ((inpuitField.value != "") & noteListExists(inpuitField.value)) {
                postNotesFromLocalStorage(inpuitField.value);
            }
        });

    document.querySelector(".list-group").addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-note-btn")) {
            try {
                deleteNoteFromLocalStorage(
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
            //console.log(event.target.parentElement.parentElement.text);
            saveNoteToLocalStorage(
                getTextFromNote(
                    event.target.parentElement.parentElement.innerHTML
                ),
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
                event.target.parentElement.parentElement.innerHTML
            );
        }
    });

    //Модальное окно для редактирования списка дел
    document.querySelector("#edit-note").addEventListener("click", (event) => {
        console.log("click");
        let inpuitField = document.querySelector(".edit-note-input");
        if (inpuitField.value != "") {
            let noteList = JSON.parse(
                localStorage.getItem(getSelectedNoteListName())
            );
            let note = noteList[indexOfNoteByCreationTime(noteToEditID)];
            saveNoteToLocalStorage(
                inpuitField.value,
                getSelectedNoteListName(),
                noteToEditID,
                note.completed
            );
            postNotesFromLocalStorage(getSelectedNoteListName());
        }
    });

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
        .querySelector(".previous-date")
        .addEventListener("click", (event) => {
            setSelectedNoteListName(getPreviousDate(selectedDate));
            selectedDate = getPreviousDate(selectedDate);
            postNotesFromLocalStorage(getSelectedNoteListName());
        });

    document.querySelector(".next-date").addEventListener("click", (event) => {
        setSelectedNoteListName(getNextDate(selectedDate));
        selectedDate = getNextDate(selectedDate);
        postNotesFromLocalStorage(getSelectedNoteListName());
    });

    writeFormatedDateToElement(".current-date", new Date());
    writeDayNameToElement(".day-name", new Date());
    //displayTodayDate();
    setSelectedNoteListName(new Date());
    postNotesFromLocalStorage(getSelectedNoteListName());
}

//допилить,чтобы можно было менять текущую дату и соответсвенно список дел

//добавить listener, чтобы дата менялась в 00 00

//Работа с заметками и списками заметок

function setSelectedNoteListName(name) {
    let selectedNoteListName = document.querySelector(
        ".selected-note-list-name"
    );
    if (stringIsDate(name)) {
        selectedNoteListName.innerHTML = formatDate(name);
    } else {
        selectedNoteListName.innerHTML = name;
    }
}

function getSelectedNoteListName() {
    return document.querySelector(".selected-note-list-name").innerHTML;
}

function getTextFromNote(innerHTMLCode) {
    let wholeText = innerHTMLCode.toString();
    let startIndex;
    for (let i = 0; i < wholeText.length; i++) {
        if (
            (wholeText[i] !== "\n") &
            (wholeText[i] !== " ") &
            (wholeText[i] !== "")
        ) {
            startIndex = i;
            break;
        }
    }
    return wholeText
        .toString()
        .slice(startIndex, wholeText.toString().indexOf("\n", 1));
}

function postNotesFromLocalStorage(noteListName) {
    const notes = getNoteListByName(noteListName);
    const noteList = document.querySelector(".list-group");
    noteList.innerHTML = "";
    if (notes !== null) {
        notes.forEach((note) => {
            let newNote = createNewNote(
                note.text,
                note.creationTime,
                note.completed
            );
            noteList.insertAdjacentHTML("beforeend", newNote);
        });
    }
}

function createNewNote(text, id, completed = false) {
    return `<li id="${id}" class="list-group-item ${
        completed ? "list-group-item-success" : ""
    }">
                    ${text}
                    <div
                        class="position-absolute top-0 end-0 note-edit-buttons"
                    >
                        <button
                            class="btn btn-outline-danger delete-note-btn"
                            type="submit"
                        >
                            Delete
                        </button>
                        <button class="btn btn-outline-secondary edit-button" type="submit" data-toggle="modal" data-target=".edit-note-modal">
                            Edit
                        </button>
                        <button
                            class="btn btn-outline-success done-button"
                            type="submit"
                        >
                            Done
                        </button>
                    </div>
                </li>`;
}

function saveNoteToLocalStorage(
    text,
    noteListName,
    creationTime,
    completed = false
) {
    creationTime = creationTime.toString();
    let newNote = {
        creationTime,
        text,
        completed,
    };

    if (noteListExists(noteListName)) {
        let listOfNodesForDate = JSON.parse(localStorage.getItem(noteListName));
        //console.log(noteExists(listOfNodesForDate, newNote.creationTime));

        if (noteListContains(listOfNodesForDate, newNote.creationTime)) {
            //console.log("Note exists!!!");
            listOfNodesForDate = updateNote(
                listOfNodesForDate,
                indexOfNoteByCreationTime(
                    listOfNodesForDate,
                    newNote.creationTime
                ),
                newNote
            );
        } else {
            listOfNodesForDate.push(newNote);
        }
        localStorage.setItem(noteListName, JSON.stringify(listOfNodesForDate));
    } else {
        localStorage.setItem(noteListName, JSON.stringify([newNote]));
    }
}

function noteListExists(name) {
    return localStorage.hasOwnProperty(name);
}

function getNoteListByName(name) {
    return JSON.parse(localStorage.getItem(name));
}

function noteListContains(noteList, noteCreationTime) {
    for (let i = 0; i < noteList.length; i++) {
        if (noteList[i].creationTime == noteCreationTime) {
            return true;
        }
    }
    return false;
}

function indexOfNoteByCreationTime(listOfNotes, creationTime) {
    for (let i = 0; i < listOfNotes.length; i++) {
        if (listOfNotes[i].creationTime == creationTime) {
            return i;
        }
    }
    return -1;
}

function deleteNoteFromLocalStorage(noteListName, creationTime) {
    let notes = JSON.parse(localStorage.getItem(noteListName));
    notes.splice(indexOfNoteByCreationTime(notes, creationTime), 1);
    localStorage.setItem(noteListName, JSON.stringify(notes));
}

function updateNote(listOfNotes, index, updatedNote) {
    listOfNotes[index].creationTime = updatedNote.creationTime;
    listOfNotes[index].text = updatedNote.text;
    listOfNotes[index].completed = updatedNote.completed;
    return listOfNotes;
}

function createNewNoteList(name) {
    if (!noteListExists(name)) {
        localStorage.setItem(name, JSON.stringify([]));
    }
}

function stringIsDate(str) {
    return true;
}

initNoteListEventListeners();
//console.log(myFunc(new Date()));
