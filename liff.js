// LIFF ID (LINE Developersコンソールで取得したものに置き換えてください)
const liffId = 'YOUR-LIFF-ID-HERE';

// LIFF初期化フラグ
let liffInitialized = false;
let userProfile = null;

// LIFF機能の有効/無効フラグ（false = 通常のWebページとして動作）
const ENABLE_LIFF = false;

// LIFF初期化
async function initializeLiff() {
    // LIFF機能が無効の場合は、通常のWebページとして動作
    if (!ENABLE_LIFF) {
        console.log('LIFF機能は無効です。通常のWebページとして動作します。');
        document.getElementById('loading').style.display = 'none';
        document.getElementById('surveyForm').style.display = 'block';
        return;
    }
    
    try {
        await liff.init({ liffId: liffId });
        liffInitialized = true;
        
        // ログイン状態の確認
        if (!liff.isLoggedIn()) {
            liff.login();
            return;
        }
        
        // ユーザープロフィールの取得
        try {
            userProfile = await liff.getProfile();
            console.log('User profile:', userProfile);
        } catch (error) {
            console.error('Profile取得エラー:', error);
        }
        
        // フォームを表示
        document.getElementById('loading').style.display = 'none';
        document.getElementById('surveyForm').style.display = 'block';
        
    } catch (error) {
        console.error('LIFF初期化エラー:', error);
        showError('LIFFの初期化に失敗しました。ページを再読み込みしてください。');
    }
}

// LINE送信関数
async function sendLineMessage(surveyData) {
    // LIFF機能が無効の場合はスキップ
    if (!ENABLE_LIFF) {
        console.log('LIFF機能が無効のため、LINEメッセージ送信をスキップ');
        return;
    }
    
    if (!liff.isInClient()) {
        console.log('LIFF外部ブラウザのため、メッセージ送信をスキップ');
        return;
    }
    
    try {
        // アンケート結果のメッセージを作成
        const message = createSurveyMessage(surveyData);
        
        await liff.sendMessages([{
            type: 'text',
            text: message
        }]);
        
        console.log('LINEメッセージ送信成功');
    } catch (error) {
        console.error('LINEメッセージ送信エラー:', error);
        // エラーが発生してもフォーム送信は成功とする
    }
}

// アンケート結果メッセージの作成
function createSurveyMessage(data) {
    let message = `【${EVENT_CONFIG.eventTitle}アンケート提出完了】\n`;
    message += `━━━━━━━━━━━━━━━\n`;
    message += `イベントID: ${data.eventId}\n`;
    message += `━━━━━━━━━━━━━━━\n\n`;
    
    // 企業別の興味度
    const companies = data.companies;
    const interestedCompanies = [];
    const eventReservations = [];
    
    Object.keys(companies).forEach((key) => {
        const company = companies[key];
        // 選考やISに参加したい企業
        if (company.participate_after.includes('選考やISに参加したい')) {
            interestedCompanies.push(company.name);
        }
        // イベント予約がある企業
        if (company.schedule.length > 0) {
            eventReservations.push({
                name: company.name,
                schedules: company.schedule
            });
        }
    });
    
    if (interestedCompanies.length > 0) {
        message += `◆ 選考参加希望企業:\n`;
        interestedCompanies.forEach(name => {
            message += `  ・${name}\n`;
        });
        message += '\n';
    }
    
    if (eventReservations.length > 0) {
        message += `◆ イベント予約:\n`;
        eventReservations.forEach(reservation => {
            message += `【${reservation.name}】\n`;
            reservation.schedules.forEach(schedule => {
                message += `  📅 ${schedule.datetime}\n`;
                if (schedule.title) {
                    message += `     ${schedule.title}\n`;
                }
            });
        });
        message += '\n';
    }
    
    message += `━━━━━━━━━━━━━━━\n`;
    message += `総合評価:\n`;
    message += `GDレベル: ${getShortText(data.gd_level)}\n`;
    message += `満足度: ${getShortText(data.event_satisfaction)}\n`;
    
    message += `\n提出日時: ${new Date().toLocaleString('ja-JP')}`;
    
    return message;
}

// 長い選択肢テキストを短縮
function getShortText(value) {
    const shortTexts = {
        'かなりうまくいったと感じた。': 'かなりうまくいった',
        'うまくできたが、成長の余地があると感じた。': 'うまくできた',
        'うまくいった部分もあったが、成長が必要だと感じた。': '成長が必要',
        'まだまだ全体的に成長が必要だと感じた。': '全体的に成長が必要',
        'とても満足だった。': 'とても満足',
        '満足だった。': '満足',
        '不満だった。': '不満',
        'とても不満だった。': 'とても不満'
    };
    return shortTexts[value] || value;
}

// LIFFウィンドウを閉じる
function closeLiff() {
    // LIFF機能が無効の場合は何もしない
    if (!ENABLE_LIFF) {
        console.log('LIFF機能が無効です');
        return;
    }
    
    if (liff.isInClient()) {
        liff.closeWindow();
    } else {
        // 外部ブラウザの場合は閉じられないので、メッセージを表示
        console.log('外部ブラウザのため、手動で閉じてください');
    }
}

// エラー表示
function showError(message) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('surveyForm').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'block';
    document.getElementById('errorText').textContent = message;
}

// ページ読み込み時にLIFF初期化
document.addEventListener('DOMContentLoaded', () => {
    initializeLiff();
});
