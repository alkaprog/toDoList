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
                    getSelectedDate(),
                    creationTime
                );
                inpuitField.value = "";
            }
        });

    document.querySelector(".list-group").addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-note-btn")) {
            try {
                deleteNoteFromLocalStorage(
                    getSelectedDate(),
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
                getSelectedDate(),
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
            setSelectedDate(getPreviousDate());
            postNotesFromLocalStorage(getSelectedDate());
        });

    document.querySelector(".next-date").addEventListener("click", (event) => {
        setSelectedDate(getNextDate());
        postNotesFromLocalStorage(getSelectedDate());
    });

    displayTodayDate();
    setSelectedDate(new Date());
    postNotesFromLocalStorage(getSelectedDate());
}

function setSelectedDate(date) {
    let selectedDate = document.querySelector(".selected-date");
    selectedDate.innerHTML = getFormatedDate(date);
}

function getSelectedDate(date) {
    let selectedDate = document.querySelector(".selected-date");
    return selectedDate.innerHTML;
}
//refactor to make code easily understandable
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

function postNotesFromLocalStorage(date) {
    let notes = getNoteListForDate(date);
    let noteList = document.querySelector(".list-group");
    noteList.innerHTML = "";
    if (notes !== null) {
        
        
        notes.forEach((note) => {
            //console.log(note);
            let newNote = createNewNote(
                note.text,
                note.creationTime,
                note.completed
            );
            noteList.insertAdjacentHTML("beforeend", newNote);
        });
    }
}
//допилить,чтобы можно было менять текущую дату и соответсвенно список дел
function getSelectedDate() {
    return document.querySelector(".selected-date").innerHTML;
}
//добавить listener, чтобы дата менялась в 00 00
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

function getFormatedDate(date) {
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

function saveNoteToLocalStorage(text, date, creationTime, completed = false) {
    creationTime = creationTime.toString();
    let newNote = {
        creationTime,
        text,
        completed,
    };

    if (localStorage.hasOwnProperty(date)) {
        let listOfNodesForDate = JSON.parse(localStorage.getItem(date));
        //console.log(noteExists(listOfNodesForDate, newNote.creationTime));

        if (noteExists(listOfNodesForDate, newNote.creationTime)) {
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
        localStorage.setItem(date, JSON.stringify(listOfNodesForDate));
    } else {
        localStorage.setItem(date, JSON.stringify([newNote]));
    }
}

function displayTodayDate() {
    document.querySelector(".day-name").innerHTML = getCurrentDayName();
    document.querySelector(".current-date").innerHTML = getFormatedDate();
}

function saveNoteList() {
    localStorage.setItem("test", 1);
}
//noteList:[{creationTime,text,tags},{},{}]
function getNoteListForDate(date) {
    return JSON.parse(localStorage.getItem(date));
}

function noteExists(listOfNotes, creationTime) {
    for (let i = 0; i < listOfNotes.length; i++) {
        if (listOfNotes[i].creationTime == creationTime) {
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

function deleteNoteFromLocalStorage(date, creationTime) {
    let notes = JSON.parse(localStorage.getItem(date));
    notes.splice(indexOfNoteByCreationTime(notes, creationTime), 1);
    localStorage.setItem(date, JSON.stringify(notes));
}

function updateNote(listOfNotes, index, updatedNote) {
    listOfNotes[index].creationTime = updatedNote.creationTime;
    listOfNotes[index].text = updatedNote.text;
    listOfNotes[index].completed = updatedNote.completed;
    return listOfNotes;
}

init();
