// Firebase設定（ご自身のFirebaseプロジェクトの設定に置き換えてください）
const firebaseConfig = {
    apiKey: "YOUR-API-KEY",
    authDomain: "YOUR-AUTH-DOMAIN",
    projectId: "YOUR-PROJECT-ID",
    storageBucket: "YOUR-STORAGE-BUCKET",
    messagingSenderId: "YOUR-MESSAGING-SENDER-ID",
    appId: "YOUR-APP-ID"
};

// Firebase機能の有効/無効フラグ（false = UIテストモード）
const ENABLE_FIREBASE = false;

// Firebase初期化
if (ENABLE_FIREBASE) {
    firebase.initializeApp(firebaseConfig);
}
const db = ENABLE_FIREBASE ? firebase.firestore() : null;

// 評価を数値に変換するマッピング（総合評価のみ）
const RATING_MAP = {
    // GDレベル
    "かなりうまくいったと感じた。": 4,
    "うまくできたが、成長の余地があると感じた。": 3,
    "うまくいった部分もあったが、成長が必要だと感じた。": 2,
    "まだまだ全体的に成長が必要だと感じた。": 1,
    
    // イベント満足度
    "とても満足だった。": 4,
    "満足だった。": 3,
    "不満だった。": 2,
    "とても不満だった。": 1
};

// フォーム送信処理
document.getElementById('surveyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // 送信ボタンを更新
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    
    try {
        // フォームデータの収集
        const formData = collectFormData();
        
        // LINEユーザー情報を追加（LIFF有効時のみ）
        if (typeof userProfile !== 'undefined' && userProfile) {
            formData.userId = userProfile.userId;
        }
        
        // イベントIDを追加
        formData.eventId = EVENT_CONFIG.eventId;
        
        // タイムスタンプを追加
        if (ENABLE_FIREBASE) {
            formData.submitTimestamp = firebase.firestore.FieldValue.serverTimestamp();
        } else {
            formData.submitTimestamp = new Date();
        }
        
        // Firestoreに保存（Firebase有効時のみ）
        if (ENABLE_FIREBASE) {
            await saveToFirestore(formData);
        } else {
            // UIテストモード：コンソールに出力
            console.log('=== UIテストモード: フォームデータ ===');
            console.log(formData);
            console.log('=====================================');
            
            // テストモードでは少し待機してリアルな送信をシミュレート
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // LINEでメッセージ送信（sendLineMessage関数がある場合）
        if (typeof sendLineMessage === 'function') {
            await sendLineMessage(formData);
        }
        
        // 成功メッセージを表示
        showSuccess();
        
    } catch (error) {
        console.error('送信エラー:', error);
        alert('送信中にエラーが発生しました。もう一度お試しください。');
        
        // ボタンを再度有効化
        submitBtn.disabled = false;
        btnText.style.display = 'block';
        btnLoading.style.display = 'none';
    }
});

// フォームデータの収集
function collectFormData() {
    // GDレベルとイベント満足度の値を取得
    const gdLevelText = document.querySelector('input[name="fixed1gd_level"]:checked')?.value || '';
    const eventSatisfactionText = document.querySelector('input[name="fixed2event_satisfaction"]:checked')?.value || '';
    
    const formData = {
        // 数値に変換した評価
        gdLevel: RATING_MAP[gdLevelText] || 0,
        eventSatisfaction: RATING_MAP[eventSatisfactionText] || 0,
        satisfactionReason: document.getElementById('fixed3event_feedback')?.value.trim() || ''
    };
    
    // 企業別データを収集
    const companiesData = {};
    EVENT_CONFIG.companies.forEach(company => {
        const companyData = {
            companyName: company.name,
            beforeAwareness: document.querySelector(`input[name="${company.id}participate_before"]:checked`)?.value || '',
            afterInterest: document.querySelector(`input[name="${company.id}participate_after"]:checked`)?.value || '',
            impression: document.getElementById(`${company.id}impression_text`)?.value.trim() || '',
            selectedSchedules: []
        };
        
        // スケジュール選択を収集
        const scheduleCheckboxes = document.querySelectorAll(`input[name="${company.id}schedule"]:checked`);
        scheduleCheckboxes.forEach(checkbox => {
            const datetime = checkbox.value;
            const scheduleInfo = company.schedules.find(s => s.datetime === datetime);
            companyData.selectedSchedules.push({
                datetime: datetime,
                title: scheduleInfo?.title || '',
                isUnavailable: datetime === "日程が合わない"  // 「日程が合わない」かどうかを判別
            });
        });
        
        // 企業IDをキーとして保存
        companiesData[company.id] = companyData;
    });
    
    // 企業データを含める
    formData.companies = companiesData;
    
    return formData;
}

// Firestoreに保存
async function saveToFirestore(data) {
    if (!ENABLE_FIREBASE) {
        console.log('Firebase無効のため、Firestore保存をスキップ');
        return 'test-document-id';
    }
    
    try {
        // surveyコレクションに保存
        const docRef = await db.collection('survey').add(data);
        console.log('Firestore保存成功:', docRef.id);
        
        // ドキュメントIDを返す
        return docRef.id;
    } catch (error) {
        console.error('Firestore保存エラー:', error);
        throw error;
    }
}

// 成功表示
function showSuccess() {
    // フォームを非表示
    document.getElementById('surveyForm').style.display = 'none';
    
    // 進捗バーを非表示
    document.querySelector('.progress-container').style.display = 'none';
    
    // 成功メッセージを表示
    document.getElementById('successMessage').style.display = 'block';
    
    // 3秒後にLIFFウィンドウを閉じる（closeLiff関数がある場合）
    setTimeout(() => {
        if (typeof closeLiff === 'function') {
            closeLiff();
        }
    }, 3000);
}

// デバッグ情報の表示
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== アプリケーション設定 ===');
    console.log('LIFF機能:', typeof ENABLE_LIFF !== 'undefined' && ENABLE_LIFF ? '有効' : '無効');
    console.log('Firebase機能:', ENABLE_FIREBASE ? '有効' : '無効');
    console.log('イベントID:', EVENT_CONFIG?.eventId || '未設定');
    console.log('登録企業数:', EVENT_CONFIG?.companies?.length || 0);
    console.log('========================');
});

// デバッグ用：Firebaseの接続状態を確認
if (ENABLE_FIREBASE && db) {
    firebase.firestore().enableNetwork()
        .then(() => {
            console.log('Firestore接続: オンライン');
        })
        .catch((error) => {
            console.error('Firestore接続エラー:', error);
        });
}
