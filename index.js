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
            formData.lineUserId = userProfile.userId;
            formData.lineDisplayName = userProfile.displayName;
            formData.linePictureUrl = userProfile.pictureUrl;
        }
        
        // イベントIDを追加
        formData.eventId = EVENT_CONFIG.eventId;
        
        // タイムスタンプを追加
        if (ENABLE_FIREBASE) {
            formData.submittedAt = firebase.firestore.FieldValue.serverTimestamp();
        }
        formData.submittedAtLocal = new Date().toISOString();
        
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
    const formData = {
        // 企業別データ
        companies: {}
    };
    
    // 各企業のデータを収集
    EVENT_CONFIG.companies.forEach(company => {
        const companyData = {
            name: company.name,
            participate_before: document.querySelector(`input[name="${company.id}participate_before"]:checked`)?.value || '',
            participate_after: document.querySelector(`input[name="${company.id}participate_after"]:checked`)?.value || '',
            impression_text: document.getElementById(`${company.id}impression_text`)?.value.trim() || '',
            schedule: []
        };
        
        // スケジュールデータを収集
        const scheduleCheckboxes = document.querySelectorAll(`input[name="${company.id}schedule"]:checked`);
        scheduleCheckboxes.forEach(checkbox => {
            const datetime = checkbox.value;
            // config.jsから該当するスケジュール情報を取得
            const scheduleInfo = company.schedules.find(s => s.datetime === datetime);
            companyData.schedule.push({
                datetime: datetime,
                title: scheduleInfo?.title || '',
                description: scheduleInfo?.description || ''
            });
        });
        
        formData.companies[company.id] = companyData;
    });
    
    // 総合評価
    formData.gd_level = document.querySelector('input[name="fixed1gd_level"]:checked')?.value || '';
    formData.event_satisfaction = document.querySelector('input[name="fixed2event_satisfaction"]:checked')?.value || '';
    formData.event_feedback = document.getElementById('fixed3event_feedback')?.value.trim() || '';
    
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
