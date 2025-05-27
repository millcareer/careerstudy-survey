// フォームを動的に生成するスクリプト
document.addEventListener('DOMContentLoaded', () => {
    // 設定が読み込まれているか確認
    if (typeof EVENT_CONFIG === 'undefined') {
        console.error('EVENT_CONFIGが定義されていません。config.jsが正しく読み込まれているか確認してください。');
        return;
    }
    
    // イベント情報を表示
    document.getElementById('eventTitle').textContent = EVENT_CONFIG.eventTitle;
    document.getElementById('eventSubtitle').textContent = EVENT_CONFIG.eventSubtitle;
    document.getElementById('eventIdDisplay').textContent = `イベントID: ${EVENT_CONFIG.eventId}`;
    
    // 企業セクションを生成
    generateCompanySections();
    
    // 総合評価セクションを生成
    generateGeneralQuestions();
    
    // 進捗バーの初期化
    updateProgress();
    
    // フォーム入力時の進捗更新
    document.getElementById('surveyForm').addEventListener('change', updateProgress);
});

// 企業セクションを動的に生成
function generateCompanySections() {
    const container = document.getElementById('companySections');
    
    EVENT_CONFIG.companies.forEach((company, index) => {
        const section = document.createElement('section');
        section.className = 'form-section company-section fade-in';
        section.style.animationDelay = `${index * 0.1}s`;
        
        // 企業カラーを適用
        if (company.color) {
            section.style.borderLeftColor = company.color;
        }
        
        let html = `
            <div class="company-header">
                <h2>${index + 1}. ${company.name}</h2>
                ${company.description ? `<p class="company-description">${company.description}</p>` : ''}
            </div>
        `;
        
        // 参加前の質問
        const beforeQ = EVENT_CONFIG.questions.before;
        html += `
            <div class="form-group">
                <label>${beforeQ.title.replace('{company}', company.name)} <span class="required">*</span></label>
                <div class="radio-group">
        `;
        beforeQ.options.forEach((option, i) => {
            html += `
                <label class="radio-label">
                    <input type="radio" name="${company.id}participate_before" value="${option}" required>
                    <span class="radio-custom"></span>
                    <span class="radio-text">${option}</span>
                </label>
            `;
        });
        html += '</div></div>';
        
        // 参加後の質問
        const afterQ = EVENT_CONFIG.questions.after;
        html += `
            <div class="form-group">
                <label>${afterQ.title.replace('{company}', company.name)} <span class="required">*</span></label>
                <div class="radio-group">
        `;
        afterQ.options.forEach((option, i) => {
            html += `
                <label class="radio-label">
                    <input type="radio" name="${company.id}participate_after" value="${option}" required>
                    <span class="radio-custom"></span>
                    <span class="radio-text">${option}</span>
                </label>
            `;
        });
        html += '</div></div>';
        
        // 印象・感想（必須化）
        const impressionQ = EVENT_CONFIG.questions.impression;
        html += `
            <div class="form-group">
                <label for="${company.id}impression_text">${impressionQ.title.replace('{company}', company.name)} <span class="required">*</span></label>
                <textarea id="${company.id}impression_text" 
                         name="${company.id}impression_text" 
                         rows="3"
                         placeholder="${impressionQ.placeholder || ''}"
                         required></textarea>
            </div>
        `;
        
        // イベント予約（少なくとも1つ必須）
        const scheduleQ = EVENT_CONFIG.questions.schedule;
        html += `
            <div class="form-group">
                <label>${scheduleQ.title.replace('{company}', company.name)} <span class="required">*</span></label>
                ${scheduleQ.description ? `<p class="field-description">${scheduleQ.description}<br><span style="color: #ff4444;">※少なくとも1つ選択してください</span></p>` : ''}
                <div class="checkbox-group" data-company-id="${company.id}">
        `;
        
        company.schedules.forEach((schedule, i) => {
            html += `
                <label class="schedule-label">
                    <input type="checkbox" 
                           name="${company.id}schedule" 
                           value="${schedule.datetime}"
                           onchange="validateScheduleSelection('${company.id}')">
                    <div class="schedule-content">
                        <div class="schedule-header">
                            <span class="schedule-datetime">${schedule.datetime}</span>
                            <span class="schedule-title">${schedule.title}</span>
                        </div>
                        ${schedule.description ? 
                            `<p class="schedule-description">${schedule.description}</p>` : ''}
                    </div>
                </label>
            `;
        });
        
        html += `
                </div>
                <div class="error-message" id="${company.id}schedule-error" style="display: none; color: #ff4444; font-size: 13px; margin-top: 5px;">
                    少なくとも1つのイベントを選択してください
                </div>
            </div>
        `;
        
        section.innerHTML = html;
        container.appendChild(section);
    });
}

// 総合評価セクションを生成
function generateGeneralQuestions() {
    const container = document.getElementById('generalQuestions');
    let html = '';
    
    // GDレベル
    const gdQ = EVENT_CONFIG.generalQuestions.gd_level;
    html += `
        <div class="form-group">
            <label>${gdQ.title} <span class="required">*</span></label>
            <div class="radio-group">
    `;
    gdQ.options.forEach((option, i) => {
        html += `
            <label class="radio-label">
                <input type="radio" name="fixed1gd_level" value="${option}" required>
                <span class="radio-custom"></span>
                <span class="radio-text">${option}</span>
            </label>
        `;
    });
    html += '</div></div>';
    
    // イベント満足度
    const satisfactionQ = EVENT_CONFIG.generalQuestions.event_satisfaction;
    html += `
        <div class="form-group">
            <label>${satisfactionQ.title} <span class="required">*</span></label>
            <div class="radio-group">
    `;
    satisfactionQ.options.forEach((option, i) => {
        html += `
            <label class="radio-label">
                <input type="radio" name="fixed2event_satisfaction" value="${option}" required>
                <span class="radio-custom"></span>
                <span class="radio-text">${option}</span>
            </label>
        `;
    });
    html += '</div></div>';
    
    // フィードバック（必須化）
    const feedbackQ = EVENT_CONFIG.generalQuestions.event_feedback;
    html += `
        <div class="form-group">
            <label for="fixed3event_feedback">${feedbackQ.title} <span class="required">*</span></label>
            <textarea id="fixed3event_feedback" 
                     name="fixed3event_feedback" 
                     rows="4"
                     placeholder="${feedbackQ.placeholder || ''}"
                     required></textarea>
        </div>
    `;
    
    container.innerHTML = html;
}

// スケジュール選択のバリデーション
function validateScheduleSelection(companyId) {
    const checkboxes = document.querySelectorAll(`input[name="${companyId}schedule"]`);
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    const errorDiv = document.getElementById(`${companyId}schedule-error`);
    
    if (checkedCount === 0) {
        errorDiv.style.display = 'block';
        checkboxes.forEach(cb => cb.setCustomValidity('少なくとも1つ選択してください'));
    } else {
        errorDiv.style.display = 'none';
        checkboxes.forEach(cb => cb.setCustomValidity(''));
    }
    
    // 進捗バーを更新
    updateProgress();
}

// 進捗バーの更新
function updateProgress() {
    const form = document.getElementById('surveyForm');
    const requiredInputs = form.querySelectorAll('input[required], textarea[required]');
    const checkboxGroups = {};
    let totalRequired = 0;
    let completedRequired = 0;
    
    // 必須入力をチェック
    requiredInputs.forEach(input => {
        if (input.type === 'radio') {
            const name = input.name;
            if (!checkboxGroups[name]) {
                checkboxGroups[name] = false;
                totalRequired++;
            }
            if (input.checked) {
                checkboxGroups[name] = true;
            }
        } else if (input.type === 'textarea' || input.type === 'text') {
            totalRequired++;
            if (input.value.trim() !== '') {
                completedRequired++;
            }
        }
    });
    
    // ラジオボタングループの完了数を計算
    completedRequired += Object.values(checkboxGroups).filter(v => v).length;
    
    // チェックボックスグループ（スケジュール）をチェック
    EVENT_CONFIG.companies.forEach(company => {
        totalRequired++;
        const checkboxes = document.querySelectorAll(`input[name="${company.id}schedule"]`);
        const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
        if (checkedCount > 0) {
            completedRequired++;
        }
    });
    
    // 進捗を計算
    const progress = totalRequired > 0 ? Math.round((completedRequired / totalRequired) * 100) : 0;
    
    // 進捗バーを更新
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${progress}%`;
    
    // 進捗に応じて色を変更
    if (progress === 100) {
        progressBar.style.backgroundColor = '#4CAF50';
    } else if (progress >= 70) {
        progressBar.style.backgroundColor = '#8BC34A';
    } else if (progress >= 30) {
        progressBar.style.backgroundColor = '#FFC107';
    } else {
        progressBar.style.backgroundColor = '#03A9F4';
    }
}

// フォーム送信前のバリデーション
document.getElementById('surveyForm').addEventListener('submit', (e) => {
    // スケジュール選択の最終確認
    let isValid = true;
    
    EVENT_CONFIG.companies.forEach(company => {
        const checkboxes = document.querySelectorAll(`input[name="${company.id}schedule"]`);
        const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
        
        if (checkedCount === 0) {
            e.preventDefault();
            isValid = false;
            document.getElementById(`${company.id}schedule-error`).style.display = 'block';
            checkboxes.forEach(cb => cb.setCustomValidity('少なくとも1つ選択してください'));
        }
    });
    
    if (!isValid) {
        alert('すべての必須項目を入力してください。\n特に、各企業のイベント予約を少なくとも1つ選択してください。');
    }
});
