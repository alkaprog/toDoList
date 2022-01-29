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
                    getTodayFormatedDate(),
                    creationTime
                );
                inpuitField.value = "";
            }
        });

    document.querySelector(".list-group").addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-note-btn")) {
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
    setDateAndTime();
    postNotesFromLocalStorage();
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

function postNotesFromLocalStorage() {
    let notes = getNoteListForToday();
    //console.log(notes);
    let noteList = document.querySelector(".list-group");

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

//допилить,чтобы можно было менять текущую дату и соответсвенно список дел
function getSelectedDate() {
    return getTodayFormatedDate();
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
            return "Friday";
        case 5:
            return "Saturday";
        default:
            return "Error";
    }
}

function getTodayFormatedDate() {
    var today = new Date();
    return (
        today.getDate() +
        ":" +
        ((today.getMonth() + 1).toString().length == 2
            ? today.getMonth() + 1
            : "0" + (today.getMonth() + 1)) +
        ":" +
        today.getFullYear()
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

function setDateAndTime() {
    document.querySelector(".day-name").innerHTML = getCurrentDayName();
    document.querySelector(".current-date").innerHTML = getTodayFormatedDate();
}

function saveNoteList() {
    localStorage.setItem("test", 1);
}
//noteList:[{creationTime,text,tags},{},{}]
function getNoteListForToday() {
    return JSON.parse(localStorage.getItem(getTodayFormatedDate()));
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

function updateNote(listOfNotes, index, updatedNote) {
    console.log("Old version " + listOfNotes[index]);
    listOfNotes[index].creationTime = updatedNote.creationTime;
    listOfNotes[index].text = updatedNote.text;
    listOfNotes[index].completed = updatedNote.completed;
    console.log("Old version " + listOfNotes[index]);
    return listOfNotes;
}

init();
