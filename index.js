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
        // 基本情報
        studentId: document.getElementById('studentId').value.trim(),
        grade: document.getElementById('grade').value,
        department: document.getElementById('department').value.trim(),
        
        // キャリア意識調査
        careerThinking: document.querySelector('input[name="careerThinking"]:checked')?.value || '',
        industries: getCheckedValues('industries'),
        careerGoal: document.getElementById('careerGoal').value.trim(),
        internshipExperience: document.querySelector('input[name="internshipExperience"]:checked')?.value || '',
        skillDevelopment: document.getElementById('skillDevelopment').value.trim(),
        
        // その他
        comments: document.getElementById('comments').value.trim()
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

// 業界選択のバリデーション（少なくとも1つ選択されているか）
function validateIndustries() {
    const checkboxes = document.querySelectorAll('input[name="industries"]');
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    
    if (checkedCount === 0) {
        // カスタムバリデーションメッセージを設定
        checkboxes[0].setCustomValidity('少なくとも1つ選択してください');
    } else {
        checkboxes[0].setCustomValidity('');
    }
}

// 業界チェックボックスにイベントリスナーを追加
document.addEventListener('DOMContentLoaded', () => {
    const industryCheckboxes = document.querySelectorAll('input[name="industries"]');
    industryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', validateIndustries);
    });
    
    // デバッグ情報の表示
    console.log('=== アプリケーション設定 ===');
    console.log('LIFF機能:', typeof ENABLE_LIFF !== 'undefined' && ENABLE_LIFF ? '有効' : '無効');
    console.log('Firebase機能:', ENABLE_FIREBASE ? '有効' : '無効');
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
