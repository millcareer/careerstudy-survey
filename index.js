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
    
    // 送信ボタンを無効化
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = '送信中...';
    
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
        formData.eventId = 'eid20250529';
        
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
        submitBtn.textContent = 'アンケートを提出';
    }
});

// フォームデータの収集
function collectFormData() {
    const formData = {
        // 企業別データ
        companies: {
            // ホーク・ワン
            c01: {
                name: 'ホーク・ワン',
                participate_before: document.querySelector('input[name="c01participate_before"]:checked')?.value || '',
                participate_after: document.querySelector('input[name="c01participate_after"]:checked')?.value || '',
                impression_text: document.getElementById('c01impression_text').value.trim(),
                schedule: getCheckedValues('c01schedule')
            },
            // アイスタイル
            c02: {
                name: 'アイスタイル',
                participate_before: document.querySelector('input[name="c02participate_before"]:checked')?.value || '',
                participate_after: document.querySelector('input[name="c02participate_after"]:checked')?.value || '',
                impression_text: document.getElementById('c02impression_text').value.trim(),
                schedule: getCheckedValues('c02schedule')
            },
            // ノバレーゼ
            c03: {
                name: 'ノバレーゼ',
                participate_before: document.querySelector('input[name="c03participate_before"]:checked')?.value || '',
                participate_after: document.querySelector('input[name="c03participate_after"]:checked')?.value || '',
                impression_text: document.getElementById('c03impression_text').value.trim(),
                schedule: getCheckedValues('c03schedule')
            },
            // ACROVE
            c04: {
                name: 'ACROVE',
                participate_before: document.querySelector('input[name="c04participate_before"]:checked')?.value || '',
                participate_after: document.querySelector('input[name="c04participate_after"]:checked')?.value || '',
                impression_text: document.getElementById('c04impression_text').value.trim(),
                schedule: getCheckedValues('c04schedule')
            }
        },
        
        // 総合評価
        gd_level: document.querySelector('input[name="fixed1gd_level"]:checked')?.value || '',
        event_satisfaction: document.querySelector('input[name="fixed2event_satisfaction"]:checked')?.value || '',
        event_feedback: document.getElementById('fixed3event_feedback').value.trim()
    };
    
    return formData;
}

// チェックボックスの値を配列で取得
function getCheckedValues(name) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    return Array.from(checkboxes).map(cb => cb.value);
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
    console.log('イベントID: eid20250529');
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
