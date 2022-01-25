document.querySelectorAll(".list-group-item").forEach((listElement) => {
    listElement.addEventListener("mouseover", () => {
        let buttonsBlock = listElement.firstElementChild;
        buttonsBlock.style.display = "inline-block";
    });
    listElement.addEventListener("mouseout", () => {
        let buttonsBlock = listElement.firstElementChild;
        buttonsBlock.style.display = "none";
    });
});

document.querySelectorAll(".delete-note-btn").forEach((listElement) => {
    listElement.addEventListener("click", () => {
        listElement.parentElement.parentElement.remove();
    });
});

document.querySelectorAll(".done-button").forEach((listElement) => {
    listElement.addEventListener("click", () => {
        listElement.parentElement.parentElement.classList.toggle("list-group-item-success");
        
    });
});
