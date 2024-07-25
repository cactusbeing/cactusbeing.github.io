// behavior-scripts.js

let prePageId = 0;
let sortDir = [true, true, true];
let records = {};
let recording = {};
let startTime = {};
let charts = {};
let timerInterval = {};
let avgInterval = {};
let lastAddTime = 0;
const debounceTime = 1000; // 設定防抖時間為 1 秒
const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };

function addNewPage() {
    const tabs = document.getElementById('tabs');
    const pageContainer = document.getElementById('pageContainer');
    const curPageId = prePageId + 1;

    const tab = document.createElement('div');
    tab.classList.add('tab');
    tab.id = `tab-${curPageId}`;

    let behaviorName = '';
    if (prePageId != 0) {
        while (behaviorName.trim() == '') behaviorName = prompt('請輸入標的行為名稱:');
        tab.innerText = behaviorName;
    }

    tab.onclick = () => showTab(curPageId);

    const pageSection = document.createElement('div');
    pageSection.classList.add('tab-content');
    pageSection.id = `page-${curPageId}`;
    pageSection.innerHTML = `
        <h3 class="card-title text-center" id="title-${curPageId}">記錄行為</h3>
        <div class="form-group mb-3">
            <label class="form-label" for="targetBehavior-${curPageId}">標的行為</label>
            <div class="input-group">
                <input type="text" class="form-control d-inline-block w-auto" id="targetBehavior-${curPageId}" value="${behaviorName}">
                <button class="btn btn-primary" onclick="startRecording(${curPageId})" id="startButton-${curPageId}">開始記錄</button>
                <button class="btn btn-danger" onclick="stopRecording(${curPageId})" id="stopButton-${curPageId}" disabled>停止記錄</button>
            </div>
        </div>
        <button class="btn btn-secondary mb-3" onclick="recordBehavior(${curPageId})" id="recordBehavior-${curPageId}" disabled>記下行為發生時間</button>
        <button class="btn btn-success mb-3 hidden" onclick="downloadTable(${curPageId})" id="downloadButton-${curPageId}">下載表格(Excel檔)</button>
        <div>
            <h3 class="text-center mb-3" id="title-${curPageId}">表格</h3>
            <div id="recordingSection-${curPageId}">
                <table class="table table-custom table-responsive" id="recordTable-${curPageId}">
                    <thead class="table-light">
                        <tr>
                            <th>日期</th>
                            <th>時間</th>
                            <th>姓名</th>
                            <th>學號</th>
                            <th>行為</th>
                            <th>備註</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            <div id="summary-${curPageId}" class="mt-3"></div>
        </div>
        <div id="timer-${curPageId}" class="timer hidden">00:00:00</div>
        <div id="chartContainer-${curPageId}" class="mt-5">
            <h3 class="text-center">圖表</h3>
            <canvas id="behaviorChart-${curPageId}"></canvas>
        </div>
    `;

    tabs.appendChild(tab);
    pageContainer.appendChild(pageSection);

    showTab(curPageId);
    initChart(curPageId);

    // Remove the old "+" button
    const oldPageButton = document.querySelector('.add-page');
    if (oldPageButton) {
        oldPageButton.remove();
    }

    // Add "+" button at the end of tabs
    const addPageButton = document.createElement('button');
    addPageButton.classList.add('add-page');
    addPageButton.innerText = '+';
    addPageButton.onclick = addNewPage;
    tabs.appendChild(addPageButton);

    prePageId = curPageId;
}

function showTab(pageId) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`tab-${pageId}`).classList.add('active');
    document.getElementById(`page-${pageId}`).classList.add('active');
}

function initChart(pageId) {
    const ctx = document.getElementById(`behaviorChart-${pageId}`).getContext('2d');
    const behaviorChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: '行為記錄',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '次數'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: '流逝時間 (秒)'
                    },
                    beginAtZero: true
                }
            }
        }
    });
    charts[pageId] = behaviorChart;
}

function setTargetBehavior(pageId) {
    let behaviorName = document.getElementById(`targetBehavior-${pageId}`).value;
    while (behaviorName.trim() == '')
        behaviorName = prompt("請輸入標的行為名稱:");
    document.getElementById(`title-${pageId}`).innerText = `記錄行為: ${behaviorName}`;
    document.getElementById(`tab-${pageId}`).innerText = behaviorName;
    document.getElementById(`targetBehavior-${pageId}`).value = behaviorName;
}

function startRecording(pageId) {
    setTargetBehavior(pageId);
    document.getElementById(`timer-${pageId}`).style.display = 'block';
    records[pageId] = [];
    recording[pageId] = true;
    startTime[pageId] = new Date();
    clearTable(pageId);
    document.getElementById(`downloadButton-${pageId}`).classList.add('hidden');
    toggleInputs(pageId, true);
    startTimer(pageId);
    updateSummary(pageId);
    updateTable(pageId);
}

function clearTable(pageId) {
    let tbody = document.getElementById(`recordTable-${pageId}`).getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    tbody = document.getElementById('recordTable-top').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
}

function toggleInputs(pageId, disabled) {
    document.getElementById(`targetBehavior-${pageId}`).disabled = disabled;
    document.getElementById(`startButton-${pageId}`).disabled = disabled;
    document.getElementById(`stopButton-${pageId}`).disabled = !disabled;
    document.getElementById(`recordBehavior-${pageId}`).disabled = !disabled;

    // enable basic data inputs when all pages are stopped
    if (disabled == false) {
        for (let pid in recording) {
            if (recording[pid]) // some pages still running
                return;
        }
    }

    document.getElementById(`class`).disabled = disabled;
    document.getElementById(`name`).disabled = disabled;
    document.getElementById(`studentId`).disabled = disabled;
}

function stopRecording(pageId) {
    recording[pageId] = false;
    clearInterval(timerInterval[pageId]);
    updateSummary(pageId);
    toggleInputs(pageId, false);
    document.getElementById(`downloadButton-${pageId}`).classList.remove('hidden');
    const summary = document.getElementById(`summary-${pageId}`);

    let rsize = records[pageId].length;
    if (rsize > 0) {
        let startTime = records[pageId][0].time;
        let endTime = records[pageId][rsize - 1].time;
        summary.innerHTML += `
            <br\>開始時間: ${startTime.toLocaleDateString('zh-TW')} ${startTime.toLocaleTimeString('en-US', timeOptions)}
            <br\>結束時間: ${endTime.toLocaleDateString('zh-TW')} ${endTime.toLocaleTimeString('en-US', timeOptions)}
        `;
    }
}

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function recordBehavior(pageId) {
    now = Date.now();
    if (now - lastAddTime < debounceTime) {
        alert("請勿連續點擊!")
        return;
    }
    lastAddTime = now;

    if (recording[pageId]) {
        const className = document.getElementById(`class`).value;
        const name = document.getElementById(`name`).value;
        const studentId = document.getElementById(`studentId`).value;
        const time = new Date();
        const behavior = document.getElementById(`targetBehavior-${pageId}`).value;
        records[pageId].push({ time, className, name, studentId, behavior });
        updateTable(pageId);
        updateSummary(pageId);
        updateChart(pageId);
    }
}

function updateChart(pageId) {
    const behaviorChart = charts[pageId];
    behaviorChart.data.labels = records[pageId].map((_, index) => index + 1);
    behaviorChart.data.datasets[0].data = records[pageId].map(record => {
        return (record.time - records[pageId][0].time) / 1000;
    });

    behaviorChart.update();
}

function sortTable(columnIndex, autoSort = false) {
    var table = document.getElementById("recordTable-top");
    var rows = table.rows;
    var switching = true;

    while (switching) {
        switching = false;
        for (var i = 1; i < rows.length - 1; i++) {
            var shouldSwitch = false;
            var x = rows[i].getElementsByTagName("td")[columnIndex];
            var y = rows[i + 1].getElementsByTagName("td")[columnIndex];
            console.log(x.innerHTML, y.innerHTML);

            if (autoSort) {
                if (parseFloat(x.innerHTML) < parseFloat(y.innerHTML)) {
                    shouldSwitch = true;
                    break;
                }
            } else {
                if (sortDir[columnIndex] && parseFloat(x.innerHTML) < parseFloat(y.innerHTML)) {
                    shouldSwitch = true;
                    break;
                } else if (!sortDir[columnIndex] && parseFloat(x.innerHTML) >= parseFloat(y.innerHTML)) {
                    shouldSwitch = true;
                    break;
                }
            }
        }

        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }

    if (!autoSort) {
        sortDir[columnIndex] = !sortDir[columnIndex];
    }
}

function updateTable(pageId) {
    const tbody = document.getElementById(`recordTable-${pageId}`).getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    records[pageId].forEach(record => {
        const row = tbody.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);
        const cell6 = row.insertCell(5);

        timeStamp = record.time.toLocaleDateString('zh-TW') + '-' + record.time.toLocaleTimeString('en-US', timeOptions);
        cell1.innerHTML = record.time.toLocaleDateString('zh-TW');
        cell2.innerHTML = record.time.toLocaleTimeString('en-US', timeOptions);
        cell3.innerHTML = record.name;
        cell4.innerHTML = record.studentId;
        cell5.innerHTML = record.behavior;
        cell6.innerHTML = `<textarea rows="1"></textarea>`;
    });

    const ttbody = document.getElementById(`recordTable-top`).getElementsByTagName('tbody')[0];
    ttbody.innerHTML = '';
    for (let pid in records) {
        let record = records[pid];
        const row = ttbody.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        cell1.innerHTML = document.getElementById(`targetBehavior-${pid}`).value;
        cell2.innerHTML = record.length;
        if (pid in avgInterval)
            cell3.innerHTML = avgInterval[pid].toFixed(2);
    }

    if (document.getElementById('sortCheckBox').checked)
        sortTable(1, true);
}

function downloadTable(pageId) {
    const behaviorName = document.getElementById(`targetBehavior-${pageId}`).value;
    const table = document.getElementById(`recordTable-${pageId}`);
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const name = document.getElementById('name').value;
    const studentId = document.getElementById('studentId').value;

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "日期," + formattedDate + "\n\n";

    const headers = [];
    let skippedKeyword = new Set(['日期']);
    let skippedIdx = new Set();
    let currIdx = 0;
    for (const th of table.querySelectorAll('thead th')) {
        if (skippedKeyword.has(th.innerText)) {
            skippedIdx.add(currIdx++);
            continue;
        }
        headers.push(th.innerText);
        currIdx++;
    }
    csvContent += headers.join(',') + '\n';

    for (const row of table.querySelectorAll('tbody tr')) {
        const cells = [];
        currIdx = 0;
        for (const cell of row.querySelectorAll('td')) {
            if (skippedIdx.has(currIdx++))
                continue;

            const textarea = cell.querySelector('textarea');
            const input = cell.querySelector('input');

            if (textarea) {
                cells.push('"' + textarea.value.replace(/"/g, '""').replace(/\n/g, '\\n') + '"');
            } else if (input) {
                cells.push('"' + input.value.replace(/"/g, '""') + '"');
            } else {
                cells.push(cell.innerText);
            }
        }
        csvContent += cells.join(',') + '\n';
    }

    csvContent += '\n';
    csvContent += `平均每次間隔,${avgInterval[pageId].toFixed(2)}\n總次數,${records[pageId].length}`;

    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `行為記錄_${behaviorName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function updateSummary(pageId) {
    const summary = document.getElementById(`summary-${pageId}`);
    if (records[pageId].length > 0) {
        let intervals = [];
        for (let i = 1; i < records[pageId].length; i++) {
            let time1 = records[pageId][i - 1].time;
            let time2 = records[pageId][i].time;
            intervals.push((time2.getTime() - time1.getTime()) / 1000); // Convert ms to seconds
        }
        avgInterval[pageId] = intervals.reduce((a, b) => a + b, 0) / intervals.length;

        if (intervals.length > 1)
            summary.innerHTML = `平均每次間隔: ${avgInterval[pageId].toFixed(2)} 秒<br>總次數: ${records[pageId].length}`;
        else {
            summary.innerHTML = `總次數: ${records[pageId].length}`;
        }
    } else {
        summary.innerHTML = '';
    }
}

function startTimer(pageId) {
    const timerElement = document.getElementById(`timer-${pageId}`);
    let elapsedTime = 0;
    timerInterval[pageId] = setInterval(() => {
        elapsedTime++;
        const hours = Math.floor(elapsedTime / 3600);
        const minutes = Math.floor((elapsedTime % 3600) / 60);
        const seconds = elapsedTime % 60;
        timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}