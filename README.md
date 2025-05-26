# キャリアスタディ - アンケートフォーム

LINE LIFF（LINE Front-end Framework）を利用したキャリア意識調査アンケートアプリケーションです。GitHub Pagesでホストされ、Firebase Firestoreにデータを保存します。

## 🎯 機能概要

- LINE LIFFアプリとして動作
- キャリアに関する意識調査アンケート
- Firebase Firestoreの`survey`コレクションにデータを保存
- 提出完了時にLINEトークにメッセージを送信
- GitHub Pagesでホスティング（サーバーレス）

## 🛠 技術スタック

- **フロントエンド**: HTML, CSS, JavaScript
- **データベース**: Firebase Firestore
- **ホスティング**: GitHub Pages
- **認証/連携**: LINE LIFF

## 📋 前提条件

- LINE Developersアカウント
- Firebaseプロジェクト
- GitHubアカウント（GitHub Pages用）

## 🚀 セットアップ手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/millcareer/careerstudy-survey.git
cd careerstudy-survey
```

### 2. Firebase設定

1. [Firebase Console](https://console.firebase.google.com/)でプロジェクトを作成
2. Firestoreデータベースを有効化
3. プロジェクトの設定から、WebアプリのFirebase設定情報を取得
4. `index.js`の`firebaseConfig`を自分のプロジェクトの設定に置き換え：

```javascript
const firebaseConfig = {
    apiKey: "YOUR-API-KEY",
    authDomain: "YOUR-AUTH-DOMAIN",
    projectId: "YOUR-PROJECT-ID",
    storageBucket: "YOUR-STORAGE-BUCKET",
    messagingSenderId: "YOUR-MESSAGING-SENDER-ID",
    appId: "YOUR-APP-ID"
};
```

### 3. Firestoreセキュリティルール

Firebaseコンソールで以下のセキュリティルールを設定：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // surveyコレクションへの書き込みを許可
    match /survey/{document} {
      allow read: if false;  // 読み取りは禁止
      allow create: if true; // 作成のみ許可
    }
  }
}
```

### 4. LINE LIFF設定

1. [LINE Developers Console](https://developers.line.biz/console/)にログイン
2. プロバイダーを作成（または既存のものを選択）
3. 新規チャネル作成で「LINE Login」を選択
4. LIFFアプリを追加：
   - サイズ: Full
   - エンドポイントURL: `https://[YOUR-GITHUB-USERNAME].github.io/careerstudy-survey/`
   - Scope: `profile`を選択
5. 発行されたLIFF IDを`liff.js`に設定：

```javascript
const liffId = 'YOUR-LIFF-ID-HERE';
```

### 5. GitHub Pages設定

1. GitHubリポジトリの設定ページへ移動
2. 「Pages」セクションを選択
3. Source: Deploy from a branch
4. Branch: `main`、フォルダ: `/ (root)`を選択
5. Save をクリック

数分後、`https://[YOUR-GITHUB-USERNAME].github.io/careerstudy-survey/`でアクセス可能になります。

## 📱 使用方法

1. LINE内でLIFFアプリのURLを開く
2. アンケートフォームに回答
3. 「アンケートを提出」ボタンをクリック
4. 提出完了後、LINEトークに結果が送信される

## 📊 データ構造

Firestoreの`survey`コレクションに以下の形式でデータが保存されます：

```javascript
{
  // 基本情報
  studentId: "学籍番号",
  grade: "学年",
  department: "学部・学科",
  
  // キャリア意識調査
  careerThinking: "1-5", // キャリアについて考えているか
  industries: ["IT", "finance", ...], // 希望業界（配列）
  careerGoal: "キャリアの目標",
  internshipExperience: "yes/no",
  skillDevelopment: "身につけたいスキル",
  
  // その他
  comments: "コメント",
  
  // LINE情報
  lineUserId: "LINE ユーザーID",
  lineDisplayName: "LINE 表示名",
  linePictureUrl: "LINE プロフィール画像URL",
  
  // タイムスタンプ
  submittedAt: Firestore.Timestamp,
  submittedAtLocal: "ISO形式の日時文字列"
}
```

## 🔧 カスタマイズ

### アンケート項目の追加・変更

1. `index.html`でフォーム要素を追加
2. `index.js`の`collectFormData()`関数でデータ収集処理を追加
3. `liff.js`の`createSurveyMessage()`関数でLINEメッセージ形式を調整

### スタイルの変更

`index.css`でデザインをカスタマイズできます。LINEアプリ内での表示を考慮し、モバイルファーストなデザインを心がけてください。

## 🐛 トラブルシューティング

### LIFFが初期化されない
- LIFF IDが正しく設定されているか確認
- エンドポイントURLがGitHub PagesのURLと一致しているか確認
- LINEアプリ内で開いているか確認（外部ブラウザでは一部機能が制限される）

### Firestoreに保存されない
- Firebase設定が正しいか確認
- Firestoreのセキュリティルールを確認
- ブラウザのコンソールでエラーを確認

### GitHub Pagesが表示されない
- リポジトリがpublicになっているか確認
- GitHub Pages設定が正しいか確認
- デプロイに数分かかる場合があるので待つ

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🤝 貢献

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📞 お問い合わせ

質問や提案がある場合は、Issueを作成してください。
