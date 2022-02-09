//Возвращает объект даты соответствующий дню предшествующему переданной дате
function getPreviousDate(date) {
    let previousDate = new Date();
    previousDate.setDate(date.getDate() - 1);
    return previousDate;
}

//Возвращает объект даты соответствующий следующему дню после переданной даты
function getNextDate(date) {
    let nextDate = new Date();
    nextDate.setDate(date.getDate() + 1);
    return nextDate;
}

//Возвращает Название дня, соответствующее переданной дате
//date - по умолчанию сегодня
function getDayName(date = new Date()) {
    switch (date.getDay()) {
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

//Получаем объект даты и преобразуем его в строку dd-mm-yyyy
function formatDate(date) {
    date = date ?? new Date();
    return (
        (date.getDate().toString().length == 2
            ? date.getDate()
            : "0" + date.getDate()) +
        "-" +
        ((date.getMonth() + 1).toString().length == 2
            ? date.getMonth() + 1
            : "0" + (date.getMonth() + 1)) +
        "-" +
        date.getFullYear()
    );
}

//Получаем строку dd-mm-yyyy и преобразуем ее в объект даты
function parseDate(stringDate) {
    let splitedStringDate = stringDate.split("-");

    //swap day and year to be able to parse
    [splitedStringDate[0], splitedStringDate[2]] = [
        splitedStringDate[2],
        splitedStringDate[0],
    ];

    let selectedDate = new Date(Date.parse(splitedStringDate.join("-")));
    return selectedDate;
}

//Устанавливает в элемент дату в форматированном виде
//selector - селектор элемента
//date - объект даты, по умолчанию сегодняшняя
//formatter - функция, преобразующая дату в строковый вид
function writeFormatedDateToElement(
    selector,
    date = new Date(),
    formatter = formatDate
) {
    document.querySelector(selector).innerHTML = formatter(date);
}

//Устанавливает в элемент название дня недели, соответствующее дате
//selector - селектор элемента
//date - объект даты, по умолчанию сегодняшняя
function writeDayNameToElement(selector, date = new Date()) {
    document.querySelector(selector).innerHTML = getDayName(date);
}

function stringIsDate(str) {
    const digits = "0123456789";
    if (
        (str.length == 10) &
        digits.includes(str[0]) &
        digits.includes(str[1]) &
        (str[2] == "-") &
        digits.includes(str[3]) &
        digits.includes(str[4]) &
        (str[5] == "-") &
        digits.includes(str[6]) &
        digits.includes(str[7]) &
        digits.includes(str[8]) &
        digits.includes(str[9])
    ) {
        return true;
    }
    return false;
}

export {
    getPreviousDate,
    getNextDate,
    getDayName,
    formatDate,
    parseDate,
    writeFormatedDateToElement,
    writeDayNameToElement,
    stringIsDate,
};
