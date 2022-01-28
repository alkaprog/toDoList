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
                saveNote(inpuitField.value, getFormatedDate(), creationTime);
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
        }
    });
    setDateAndTime();
    postNotesFromLocalStorage();
}

function postNotesFromLocalStorage() {
    let notes = getNoteListForToday();
    console.log(notes);
    let noteList = document.querySelector(".list-group");

    notes.forEach((note) => {
        console.log(note);
        let newNote = createNewNote(note.text, note.creationTime);
        noteList.insertAdjacentHTML("beforeend", newNote);
    });
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

function getFormatedDate() {
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

function createNewNote(text, id) {
    return `<li id="${id}" class="list-group-item">
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

function saveNote(text, date, creationTime) {
    //, tags = []
    //console.log(date);
    let newNote = {
        creationTime,
        text,
    };
    if (localStorage.hasOwnProperty(date)) {
        let listOfNodesForDate = JSON.parse(localStorage.getItem(date));
        listOfNodesForDate.push(newNote);
        localStorage.setItem(date, JSON.stringify(listOfNodesForDate));
    } else {
        localStorage.setItem(date, JSON.stringify([newNote]));
    }
}

function setDateAndTime() {
    document.querySelector(".day-name").innerHTML = getCurrentDayName();
    document.querySelector(".current-date").innerHTML = getFormatedDate();
}

function saveNoteList() {
    localStorage.setItem("test", 1);
}
//noteList:[{creationTime,text,tags},{},{}]
function getNoteListForToday() {
    return JSON.parse(localStorage.getItem(getFormatedDate()));
}

init();
