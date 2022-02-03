//let SELECTED_DATE;

function init() {
    document
        .querySelector(".list-group")
        .addEventListener("mouseover", (event) => {
            //console.log(event.target);
            if (event.target.classList.contains("list-group-item")) {
                event.target.firstElementChild.style.display = "inline-block";
            }
        });
    //при перемещении курсора с кнопки на кнопку в другой заметке не работает  issamenode?
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
            console.log(event.target);
            if (
                event.target.classList.contains("note-edit-buttons") &
                !event.target.contains(
                    document.elementFromPoint(event.clientX, event.clientY)
                ) &
                (document.elementFromPoint(event.clientX, event.clientY) !==
                    event.target.parentElement)
            ) {
                //console.log("yeah!");
                event.target.style.display = "none";
            }
        });

    document
        .querySelector(".list-group")
        .addEventListener("mouseout", (event) => {
            console.log(event.target);
            if (
                event.target.classList.contains("btn") &
                (document.elementFromPoint(event.clientX, event.clientY) !==
                    event.target.parentElement) &
                (document.elementFromPoint(event.clientX, event.clientY) !==
                    event.target.parentElement.parentElement)
            ) {
                console.log("yeah!");
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
                    getSelectedListName(),
                    creationTime
                );
                inpuitField.value = "";
            }
        });

    document
        .querySelector("#create-note-list")
        .addEventListener("click", (event) => {
            let inpuitField = document.querySelector(".create-note-list-input");
            let notes = document.querySelector(".list-group");
            if (inpuitField.value != "") {
                createNewNoteList(inpuitField.value);
            }
        });

    document.querySelector(".list-group").addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-note-btn")) {
            try {
                deleteNoteFromLocalStorage(
                    getSelectedListName(),
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
            console.log(event.target.parentElement.parentElement.text);
            saveNoteToLocalStorage(
                getTextFromNote(
                    event.target.parentElement.parentElement.innerHTML
                ),
                getSelectedListName(),
                event.target.parentElement.parentElement.id,
                event.target.parentElement.parentElement.classList.contains(
                    "list-group-item-success"
                )
                    ? true
                    : false
            );
        }
    });

    document
        .querySelector(".previous-date")
        .addEventListener("click", (event) => {
            setSelectedListName(getPreviousDate());
            postNotesFromLocalStorage(getSelectedListName());
        });

    document.querySelector(".next-date").addEventListener("click", (event) => {
        setSelectedListName(getNextDate());
        postNotesFromLocalStorage(getSelectedListName());
    });

    displayTodayDate();
    setSelectedListName(new Date());
    postNotesFromLocalStorage(getSelectedListName());
}

//Функции для работы с датами и временем

function setSelectedListName(date) {
    let selectedDate = document.querySelector(".selected-date");
    selectedDate.innerHTML = formatDate(date);
}

function getSelectedListName() {
    return document.querySelector(".selected-date").innerHTML;
}

function getPreviousDate() {
    let splitedSelectedDate = document
        .querySelector(".selected-date")
        .innerHTML.split("-");

    //swap day and year to be able to parse
    [splitedSelectedDate[0], splitedSelectedDate[2]] = [
        splitedSelectedDate[2],
        splitedSelectedDate[0],
    ];

    let selectedDate = new Date(Date.parse(splitedSelectedDate.join("-")));
    selectedDate.setDate(selectedDate.getDate() - 1);

    return selectedDate;
}

function getNextDate() {
    let splitedSelectedDate = document
        .querySelector(".selected-date")
        .innerHTML.split("-");

    //swap day and year to be able to parse
    [splitedSelectedDate[0], splitedSelectedDate[2]] = [
        splitedSelectedDate[2],
        splitedSelectedDate[0],
    ];

    let selectedDate = new Date(Date.parse(splitedSelectedDate.join("-")));
    selectedDate.setDate(selectedDate.getDate() + 1);

    return selectedDate;
}

function getCurrentDayName() {
    let day = new Date().getDay();
    switch (day) {
        case 0:
            return "Sunday";
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        case 6:
            return "Saturday";
        default:
            return "Error";
    }
}

function formatDate(date) {
    var dateToFormat = date ?? new Date();
    return (
        dateToFormat.getDate() +
        "-" +
        ((dateToFormat.getMonth() + 1).toString().length == 2
            ? dateToFormat.getMonth() + 1
            : "0" + (dateToFormat.getMonth() + 1)) +
        "-" +
        dateToFormat.getFullYear()
    );
}

function displayTodayDate() {
    document.querySelector(".day-name").innerHTML = getCurrentDayName();
    document.querySelector(".current-date").innerHTML = formatDate();
}

//допилить,чтобы можно было менять текущую дату и соответсвенно список дел

//добавить listener, чтобы дата менялась в 00 00

//Работа с заметками и списками заметок

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
                        <button class="btn btn-outline-secondary" type="submit">
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
            console.log("Note exists!!!");
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

init();
