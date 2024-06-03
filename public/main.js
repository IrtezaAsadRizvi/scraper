var jsonData;
document.getElementById('simpleForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    const url = document.getElementById('url').value;
    const fields = [
        {
            key: 'title',
            selector: '[class="h1 converter-page__title"]'
        }
    ]

    const urls = [url]

    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ urls, fields })
    })
        .then(response => response.text())
        .then(data => {
            jsonData = JSON.parse(data)
            generateTableFromJson(jsonData, 'table-container')
        })
        .catch(error => {
            console.error('Error:', error);
        });
});


function jsonToCsv(jsonData) {
    const array = Array.isArray(jsonData) ? jsonData : [jsonData];

    // Extract headers
    const headers = Object.keys(array[0]);

    // Create CSV string
    const csv = [
        headers.join(','), // header row
        ...array.map(row =>
            headers.map(header =>
                JSON.stringify(row[header] || '')
            ).join(',')
        )
    ].join('\r\n');

    return csv;
}

function downloadCsv(csv, filename) {
    const csvFile = new Blob([csv], { type: 'text/csv' });
    const downloadLink = document.createElement('a');

    downloadLink.href = URL.createObjectURL(csvFile);
    downloadLink.download = filename;

    // Append the link to the document body temporarily and click it
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Clean up by removing the link
    document.body.removeChild(downloadLink);
}

function convertAndDownload() {
    const jsonData = [
        { "name": "John", "age": 30, "city": "New York" },
        { "name": "Peter", "age": 25, "city": "London" },
        { "name": "Mike", "age": 32, "city": "Chicago" }
    ];

    const csvData = jsonToCsv(jsonData);
    downloadCsv(csvData, 'data.csv');
}

function generateTableFromJson(jsonArray, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ""; // Clear any existing content

    if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
        container.innerHTML = "No data available";
        return;
    }

    const table = document.createElement('table');
    const headers = Object.keys(jsonArray[0]);

    if (jsonArray.length === 1) {
        // Create table for a single element
        const singleElement = jsonArray[0];
        const tbody = document.createElement('tbody');

        for (let key in singleElement) {
            const row = document.createElement('tr');
            const keyCell = document.createElement('td');
            keyCell.textContent = key;
            const valueCell = document.createElement('td');
            valueCell.textContent = singleElement[key];

            row.appendChild(keyCell);
            row.appendChild(valueCell);
            tbody.appendChild(row);
        }

        table.appendChild(tbody);
    } else {
        // Create table for multiple elements
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        jsonArray.forEach(item => {
            const row = document.createElement('tr');

            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = item[header];
                row.appendChild(td);
            });

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
    }

    container.appendChild(table);
}
