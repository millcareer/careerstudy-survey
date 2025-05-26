# 企業説明会アンケートフォーム

LINE LIFF（LINE Front-end Framework）を利用した企業説明会参加者向けアンケートアプリケーションです。GitHub Pagesでホストされ、Firebase Firestoreにデータを保存します。

## 🎯 機能概要

- 企業説明会（4社）に関するアンケート収集
- 参加前後の興味度変化を測定
- イベント予約機能
- Firebase Firestoreの`survey`コレクションにデータを保存
- 提出完了時にLINEトークにサマリーを送信
- GitHub Pagesでホスティング（サーバーレス）

## 📋 アンケート内容

### 企業別質問（4社分）
1. **ホーク・ワン**
2. **アイスタイル**
3. **ノバレーゼ**
4. **ACROVE**

各企業について：
- 参加前の認知度
- 参加後の興味度
- 印象・感想（自由記述）
- イベント予約選択

### 総合評価
- GD（グループディスカッション）レベル自己評価
- イベント満足度
- フィードバック（自由記述）

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

### 2. UIテストモード（デフォルト）

現在、LIFF機能とFirebase機能は**デフォルトで無効**になっています。これにより、設定なしでUIをテストできます：

- `liff.js`の`ENABLE_LIFF = false`（LIFF機能無効）
- `index.js`の`ENABLE_FIREBASE = false`（Firebase機能無効）

この状態で：
- GitHub Pagesで通常のWebページとして動作
- フォーム送信時にデータはコンソールに出力
- LIFFログインやFirebase保存は行われない

### 3. 本番環境への設定

#### Firebase設定

1. [Firebase Console](https://console.firebase.google.com/)でプロジェクトを作成
2. Firestoreデータベースを有効化
3. プロジェクトの設定から、WebアプリのFirebase設定情報を取得
4. `index.js`を編集：

```javascript
// Firebase設定を更新
const firebaseConfig = {
    apiKey: "YOUR-API-KEY",
    authDomain: "YOUR-AUTH-DOMAIN",
    projectId: "YOUR-PROJECT-ID",
    storageBucket: "YOUR-STORAGE-BUCKET",
    messagingSenderId: "YOUR-MESSAGING-SENDER-ID",
    appId: "YOUR-APP-ID"
};

// Firebase機能を有効化
const ENABLE_FIREBASE = true; // false → true に変更
```

#### Firestoreセキュリティルール

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

#### LINE LIFF設定

1. [LINE Developers Console](https://developers.line.biz/console/)にログイン
2. プロバイダーを作成（または既存のものを選択）
3. 新規チャネル作成で「LINE Login」を選択
4. LIFFアプリを追加：
   - サイズ: Full
   - エンドポイントURL: `https://[YOUR-GITHUB-USERNAME].github.io/careerstudy-survey/`
   - Scope: `profile`を選択
5. 発行されたLIFF IDを`liff.js`に設定：

```javascript
// LIFF IDを更新
const liffId = 'YOUR-LIFF-ID-HERE';

// LIFF機能を有効化
const ENABLE_LIFF = true; // false → true に変更
```

### 4. GitHub Pages設定

1. GitHubリポジトリの設定ページへ移動
2. 「Pages」セクションを選択
3. Source: Deploy from a branch
4. Branch: `main`、フォルダ: `/ (root)`を選択
5. Save をクリック

## 📊 データ構造

Firestoreの`survey`コレクションに以下の形式でデータが保存されます：

```javascript
{
  // イベント情報
  eventId: "eid20250529",
  
  // 企業別データ
  companies: {
    c01: {
      name: "ホーク・ワン",
      participate_before: "知っていて、興味があった。",
      participate_after: "とても興味を持ったので、選考やISに参加したい。",
      impression_text: "印象・感想テキスト",
      schedule: ["2025/03/18(火) 11:00～12:30", ...]
    },
    c02: { /* アイスタイル */ },
    c03: { /* ノバレーゼ */ },
    c04: { /* ACROVE */ }
  },
  
  // 総合評価
  gd_level: "うまくできたが、成長の余地があると感じた。",
  event_satisfaction: "とても満足だった。",
  event_feedback: "フィードバックテキスト",
  
  // LINE情報（LIFF有効時）
  lineUserId: "LINE ユーザーID",
  lineDisplayName: "LINE 表示名",
  linePictureUrl: "LINE プロフィール画像URL",
  
  // タイムスタンプ
  submittedAt: Firestore.Timestamp,
  submittedAtLocal: "ISO形式の日時文字列"
}
```

## 🧪 開発モードとテスト

### UIテストモード
```javascript
// liff.js
const ENABLE_LIFF = false;    // LIFF無効

// index.js  
const ENABLE_FIREBASE = false; // Firebase無効
```
- ブラウザで直接開いてUIをテスト
- フォームデータはコンソールに出力

### LIFF単体テスト
```javascript
// liff.js
const ENABLE_LIFF = true;     // LIFF有効

// index.js
const ENABLE_FIREBASE = false; // Firebase無効
```
- LINEアプリ内でのみ動作確認
- Firebaseには保存されない

### 本番モード
```javascript
// liff.js
const ENABLE_LIFF = true;    // LIFF有効

// index.js
const ENABLE_FIREBASE = true; // Firebase有効
```
- すべての機能が有効

## 📱 使用方法

1. LINE内でLIFFアプリのURLを開く
2. 各企業セクションのアンケートに回答
3. 総合評価を入力
4. 「アンケートを提出」ボタンをクリック
5. 提出完了後、LINEトークにサマリーが送信される

## 🔧 カスタマイズ

### 企業情報の変更

`index.html`で企業名や質問を変更：
```html
<h2>1. 新しい企業名</h2>
```

### イベントID・日程の変更

`index.js`でイベントIDを変更：
```javascript
formData.eventId = 'eid20250529'; // 新しいイベントIDに変更
```

`index.html`で予約可能日程を変更：
```html
<label><input type="checkbox" name="c01schedule" value="新しい日程"> 新しい日程</label>
```

## 🐛 トラブルシューティング

### フォームが表示されない
- ブラウザのコンソールでエラーを確認
- GitHub Pagesの設定を確認

### データがコンソールに表示されない
- フォームの必須項目をすべて入力しているか確認
- ブラウザの開発者ツールでコンソールを開いているか確認

### 本番環境でFirestoreに保存されない
- `ENABLE_FIREBASE`が`true`になっているか確認
- Firebase設定が正しいか確認
- Firestoreのセキュリティルールを確認

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
