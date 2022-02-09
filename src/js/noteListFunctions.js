const blockOfbuttonsHTMLCode = `<div class="position-absolute top-0 end-0 note-edit-buttons">
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
</div>`;

function deleteNote(noteListName, creationTime) {
    if (noteListExists(noteListName)) {
        let notes = JSON.parse(localStorage.getItem(noteListName));
        notes.splice(indexOfNoteByCreationTime(notes, creationTime), 1);
        localStorage.setItem(noteListName, JSON.stringify(notes));
    }
}

function updateNote(noteList, updatedNote) {
    let index = indexOfNoteByCreationTime(noteList, updatedNote.creationTime);
    noteList[index].creationTime = updatedNote.creationTime;
    noteList[index].text = updatedNote.text;
    noteList[index].completed = updatedNote.completed;
    return noteList;
}

function createNote(text, id, completed = false) {
    return `<li id="${id}" class="list-group-item ${
        completed ? "list-group-item-success" : ""
    }">
    ${text}
    ${blockOfbuttonsHTMLCode}
</li>`;
}

function saveNote(text, noteListName, creationTime, completed = false) {
    creationTime = creationTime.toString();
    let newNote = {
        creationTime,
        text,
        completed,
    };

    if (noteListExists(noteListName)) {
        let noteList = getNoteListByName(noteListName);

        if (noteListContains(noteList, newNote.creationTime)) {
            //console.log("Note exists!!!");
            noteList = updateNote(noteList, newNote);
        } else {
            noteList.push(newNote);
        }
        localStorage.setItem(noteListName, JSON.stringify(noteList));
    } else {
        localStorage.setItem(noteListName, JSON.stringify([newNote]));
    }
}

function indexOfNoteByCreationTime(listOfNotes, creationTime) {
    for (let i = 0; i < listOfNotes.length; i++) {
        if (listOfNotes[i].creationTime == creationTime) {
            return i;
        }
    }
    return -1;
}

function getTextFromNote(id) {
    for (let key of Object.keys(localStorage)) {
        let noteList = getNoteListByName(key);

        if (noteListContains(noteList, id)) {
            let noteIndex = indexOfNoteByCreationTime(noteList, id);
            return noteList[noteIndex].text;
        }
    }
    return "";
}

function createNewNoteList(name) {
    if (!noteListExists(name)) {
        localStorage.setItem(name, JSON.stringify([]));
    }
}

function postNoteList(selector, noteListName) {
    const noteList = getNoteListByName(noteListName);
    const element = document.querySelector(selector);
    element.innerHTML = "";

    if (noteList !== null) {
        noteList.forEach((note) => {
            let newNote = createNote(
                note.text,
                note.creationTime,
                note.completed
            );
            element.insertAdjacentHTML("beforeend", newNote);
        });
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

export {
    postNoteList,
    createNote, 
    saveNote,
    noteListExists,
    indexOfNoteByCreationTime,
    deleteNote,
    createNewNoteList,
    getTextFromNote,
};