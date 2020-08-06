let header = ["Property", "Value"];

function generateTableHead(table, data, title) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  let h1 = document.createElement("H1"); // Create the H1 element
  let textElement = document.createTextNode(title); // Create a text element
  h1.appendChild(textElement);
  let caption = table.createCaption();
  caption.prepend(h1);
  for (let key of data) {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
}

function generateTable(table, data) {
  for (let element of data) {
    for (let key in element) {
      let row = table.insertRow();
      let cell1 = row.insertCell();
      let cell2 = row.insertCell();
      let text1 = document.createTextNode(key);
      let text2 = document.createTextNode(element[key]);
      cell1.appendChild(text1);
      cell2.appendChild(text2);
    }
  }
}
