// aba.js

allCheckBoxes = [];

document.addEventListener('DOMContentLoaded', () => {
    const tabTitles = [
        '標的行為問題',
        '立即前事（近因）',
        '環境背景因素（遠因）',
        '個體背景因素',
        '標的行為問題得到之後果',
        '標的行為問題之功能'
    ];

    const tabContents = [
        `
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-0-0"> 自傷行為</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-0-1"> 攻擊行為</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-0-2"> 固著行為</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-0-3"> 不適當的社會行為</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-0-4"> 特殊情緒困擾</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-0-5"> 身體調節異常</label>
        `,
        `
        <h4>出現個案想要獲取外在刺激之事件或狀況</h4>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-1-0"> 想要的食物出現，抑或在特定／一段時間未獲得食物</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-1-1"> 想要的物品出現，抑或在特定／一段時間未獲得某樣物品</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-1-2"> 想要的活動出現，抑或在特定／一段時間未從事活動</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-1-3"> 想見到的某個人出現，抑或在特定／一段時間未獲得關愛、注意</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-1-4"> 參與或完成課程、活動，或做工作／作業時遭遇困難</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-1-5"> 周遭人（例如：同儕）拒絕與個案互動或讓他參與活動</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-1-6"> 在特定事物上周遭人直接幫個案做決策，抑或個案想要控制的人事物等情境出現</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-1-7"> 周遭人（例如：同儕）表現標的行為問題得以獲取個案想要的外在刺激，以讓他模仿</label>
        <h4>出現個案想要避開外在刺激之事件或狀況</h4>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-1-8"> 不想要的食物出現</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-1-9"> 不想要的物品出現</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-1-10"> 不想聽到的聲音出現</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-1-11"> 不想見到的某個人出現</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-1-12"> 他人（例如：同儕）表現不符合期待的語言或行為</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-1-13"> 處於不舒服或陌生的某個地點或情境</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-1-14"> 被詢問、指正、責罵或處罰</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-1-15"> 被要求參與或完成不想從事的課程、活動，或工作／作業</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-1-16"> 個案的物品被拿走</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-1-17"> 個案的身體或物品被觸碰</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-1-18"> 預定的作息改變</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-1-19"> 個案被要求中止他目前正進行的活動</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-1-20"> 個案的座位／空間被更動或侵犯</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-1-21"> 個案被嘲弄</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-1-22"> 周遭人（例如：同儕）表現標的行為問題得以避開個案不想要的外在刺激，以讓他模仿</label>
        <h4>出現個案想要獲取內在感官刺激之事件或狀況</h4>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-1-23"> 在獨處情境中無所事事、等待或從事一項活動太久，或是一段時間未獲得活動；抑或個案想要的感官刺激出現</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-1-24"> 個案想要的感官刺激出現，或是正在做某個他想要進行的事情或活動</label>
        <h4>出現個案想要避開內在不舒服狀態之事件或狀況</h4>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-1-25"> 在獨處情境中，個案處於身體欠佳（例如：尿急、飢餓）的狀態</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-1-26"> 在獨處情境中，個案處於心理困頓（例如：焦慮、緊張）的狀態</label>
        `,
        `
        <h4>物理因素</h4>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-2-0"> 天氣轉變</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-2-1"> 環境空間擁擠</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-2-2"> 環境照明不佳</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-2-3"> 環境通風不好</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-2-4"> 環境色彩不良</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-2-5"> 環境動線不順</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-2-6"> 環境吵雜和有干擾刺激</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-2-7"> 不易取得環境中的物品</label>
        <h4>社會因素</h4>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-2-8"> 在家裡發生讓個案情緒波動的事件</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-2-9"> 從家裡到下一個環境（學校、機構或職場）的途中發生讓個案情緒波動的事件</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-2-10"> 環境（學校、機構或職場）中發生讓個案情緒波動的事件</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-2-11"> 環境中的人員產生改變</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-2-12"> 受到教師或服務人員、同儕抑或家人的排斥</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-2-13"> 環境未提供個案參與活動或獲得關注的機會</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-2-14"> 環境未提供個案選擇或決定的機會</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-2-15"> 個案在群體中的社會角色低落</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-2-16"> 個案在群體中的社會關係疏離</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-2-17"> 作息過於緊湊，比平常匆忙或趕時間</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-2-18"> 個案正準備轉銜至新環境（新班級、學校、機構或職場），新環境的人員不了解個案的狀況</label>
        `,
        `
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-3-0"> 氣質的影響：活動量、趨避性、適應度、規律性、反應閾、反應強度、堅持度、注意分散度和情緒本質等因素的影響</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-3-1"> 生理的問題：腦神經生物化學傳導物質失衡，腦神經系統異常，遺傳和染色體異常，器官發展不健全，疾病、藥物和疼痛的影響，新陳代謝／內分泌異常，飲食失衡、睡眠異常、運動不適足等生活作息的失調等的問題</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-3-2"> 能力的限制：溝通能力、認知能力、社會能力、休閒能力、因應能力、容忍能力等的限制</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-3-3"> 思考的扭曲：出現錯誤歸因的狀況，具有非理性信念、負向內言或自發性負面思考，自我效能低落</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-3-4"> 高度動機的需求未獲滿足：生理需求、安全需求、愛與隸屬需求、尊重需求、求知和尋求理解需求、審美、自我實現需求、超越需求未獲滿足</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-3-5"> 情緒狀態不佳或不穩：之前發生一些事件讓個案情緒狀態不佳（例如：憤怒、難過、焦慮、恐懼，之前發生一些事件讓個案情緒狀態不穩（例如：過於高興）</label>
        `,
        `
        <h4>個案獲取他想要的外在刺激，或看到表現行為問題之他人獲取他想要的外在刺激</h4>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-0"> 個案得到想要的食物</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-1"> 個案得到想要的物品</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-2"> 個案得到想要的活動</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-3"> 個案得到關愛、注意</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-4"> 個案得到協助</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-5"> 個案得到隸屬感和聯盟關係</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-6"> 個案獲得對外在環境的控制權</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-7"> 個案看到表現行為問題之他人獲得他想要的外在刺激</label>
        <h4>個案避開他不想要之外在刺激，或看到表現行為問題之他人避開他不想要的外在刺激</h4>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-8"> 不想要的食物被拿走</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-9"> 不想要的物品被拿走</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-10"> 不想聽到的聲音停止</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-11"> 不想見到的人走開</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-12"> 他人（例如：同儕）不符合個案期待的語言或行為停止</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-13"> 離開令個案感到不舒服或陌生的地點或情境</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-14"> 中止對個案的詢問、指正、責罵或處罰</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-15"> 中止對個案的課程、活動，或工作／作業要求</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-16"> 個案的物品被歸還</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-17"> 中止對個案身體或物品的觸碰</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-18"> 讓個案逃避作息改變的狀況</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-19"> 撤消要個案中止活動的指令</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-20"> 停止對個案座位／空間的更動或侵犯</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-21"> 中止對個案的嘲弄</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-22"> 個案看到表現行為問題之他人逃避他不想要的外在刺激</label>
        <h4>個案獲取他想要之內在感官刺激，產生感官自娛的狀態</h4>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-23"> 個案減輕無聊感，表現愉悅的表情</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-24"> 個案獲得想要的內在感官刺激</label>
        <h4>個案避開他不想要之內在不舒服的狀態</h4>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-25"> 個案減輕身體的不舒服感</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-26"> 個案減輕心理的困頓感</label>
        <h4>個案或周遭人（例如：同儕）無法由標的行為問題獲取或逃避外在／內在刺激</h4>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-27"> 個案不受理會，抑或得不到他想要的外在刺激</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-28"> 個案不受理會，抑或無法逃避他不想要的外在刺激</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-29"> 個案受到制止、斥責、警告或處罰</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-30"> 與個案協商或做約定</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-31"> 引導個案表現適當的行為，以獲得他想要的外在刺激</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-32"> 引導個案表現適當的行為，以逃避他不想要的外在刺激</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-33"> 轉移個案的注意力，引導他做其他事情或活動，以紓解他的無聊感或不舒服狀態</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-4-34"> 周遭人（例如：同儕）無法由標的行為問題獲取或逃避外在刺激</label>
        `,
        `
        <h4>取得外在刺激</h4>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-5-0"> 獲得想要的食物</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-5-1"> 獲得想要的物品</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-5-2"> 獲得想要的活動</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-5-3"> 獲得關愛、注意</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-5-4"> 獲得協助</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-5-5"> 獲得隸屬感和聯盟關係</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-5-6"> 獲得對外在環境的控制權</label>
        <h4>逃避外在刺激</h4>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-5-7"> 逃避不想要的食物</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-5-8"> 逃避不想要的物品</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-5-9"> 逃避不想聽到的聲音</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-5-10"> 逃避不想見到的人</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-5-11"> 逃避他人（例如：同儕）不符合期待的語言或行為</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-5-12"> 逃避不舒服或陌生的地點或情境</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-5-13"> 逃避詢問、指正、責罵或處罰</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-5-14"> 逃避課程、活動，或工作／作業要求</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-5-15"> 逃避個案的物品被拿走</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-5-16"> 逃避個案的身體或物品被觸碰</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-5-17"> 逃避作息的改變</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-5-18"> 逃避活動的中止</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-5-19"> 逃避座位／空間的更動或侵犯</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-5-20"> 逃避嘲弄</label>
        <h4>取得內在刺激</h4>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-5-21"> 獲得視覺自娛刺激</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-5-22"> 獲得聴覺自娛刺激</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-5-23"> 獲得觸覺自娛</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-5-24"> 獲得嗅覺自娛刺激</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-5-25"> 獲得身體動覺自娛刺激</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-5-26"> 獲得口腔覺自娛刺激</label>
        <h4>逃避內在刺激</h4>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-5-27"> 逃避身體欠佳的狀態</label>
        <label class="w3-container w3-padding"><input type="checkbox" id="tab-5-28"> 逃避心理困頓的狀態</label>
        `,
    ];

    const tabsContainer = document.getElementById('tabs');
    const contentContainer = document.getElementById('content');

    tabTitles.forEach((title, index) => {
        const tabButton = document.createElement('button');
        tabButton.className = 'w3-bar-item w3-hover-purple w3-button w3-border tab-link';
        tabButton.textContent = title;
        tabButton.dataset.tab = `tab-${index}`;
        tabsContainer.appendChild(tabButton);

        // init card title
        const cTitle = document.getElementById(`card-title-${index}`);
        if (cTitle)
            cTitle.innerText = title;
    });

    contentContainer.innerHTML = tabContents.map((content, index) => `
        <div id="tab-${index}" class="tab-content">${content}</div>
    `).join('');

    const tabLinks = document.querySelectorAll('.tab-link');

    function showTab(tabId) {
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
        });

        document.getElementById(tabId).style.display = 'block';

        tabLinks.forEach(link => {
            link.classList.remove('active');
        });

        document.querySelector(`[data-tab=${tabId}]`).classList.add('active');
    }

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            showTab(link.dataset.tab);
        });
    });

    // init tab
    showTab('tab-0');

    // Add event listeners to checkboxes
    const allTabs = document.querySelectorAll('[id^="tab-"]');
    const filteredTabs = Array.from(allTabs).filter(element => {
        return /^tab-\d+-\d+$/.test(element.id);
    });
    filteredTabs.forEach(checkbox => {
        checkbox.addEventListener('change', updateCards);
        allCheckBoxes.push(checkbox);
    });
});

function updateCards() {
    if (allCheckBoxes.length == 0)
        return;

    // Init all cards
    document.querySelectorAll('.card-body').forEach(card => {
        card.innerHTML = '';
    });

    // Iterate through checkboxes and update the corresponding card
    cardContent = [];
    allCheckBoxes.forEach(checkbox => {
        if (checkbox.checked) {
            const checkboxId = checkbox.id;
            const cardId = checkboxId.split('-').at(-2);
            const card = document.getElementById(`card-${cardId}`);

            card.innerHTML += `<li class="card-text">${checkbox.parentElement.textContent.trim()}</li>`;
        }
    });
}

function downloadFile() {

}