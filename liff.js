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
    const industries = data.industries.length > 0 ? data.industries.join(', ') : 'なし';
    
    let message = `【キャリアアンケート提出完了】\n`;
    message += `━━━━━━━━━━━━━━━\n`;
    message += `学籍番号: ${data.studentId}\n`;
    message += `学年: ${data.grade}年生\n`;
    message += `学部・学科: ${data.department}\n`;
    message += `━━━━━━━━━━━━━━━\n`;
    message += `キャリア意識: ${getCareerThinkingText(data.careerThinking)}\n`;
    message += `希望業界: ${industries}\n`;
    message += `インターン経験: ${data.internshipExperience === 'yes' ? 'あり' : 'なし'}\n`;
    
    if (data.careerGoal) {
        message += `\nキャリア目標:\n${data.careerGoal}\n`;
    }
    
    message += `\n提出日時: ${new Date().toLocaleString('ja-JP')}`;
    
    return message;
}

// キャリア意識の数値をテキストに変換
function getCareerThinkingText(value) {
    const texts = {
        '5': 'とても考えている',
        '4': '考えている',
        '3': 'どちらとも言えない',
        '2': 'あまり考えていない',
        '1': '全く考えていない'
    };
    return texts[value] || '未回答';
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
