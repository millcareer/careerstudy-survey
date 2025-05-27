# 企業説明会アンケートフォーム（設定ファイル版）

LINE LIFF（LINE Front-end Framework）を利用した企業説明会参加者向けアンケートアプリケーションです。GitHub Pagesでホストされ、Firebase Firestoreにデータを保存します。

## 🎯 主な特徴

- **設定ファイルで簡単カスタマイズ** - `config.js`を編集するだけで企業やイベント情報を変更可能
- **すべての項目が必須入力** - 完全なアンケート回答を確保
- **UIUXの向上** - 進捗バー、アニメーション、カスタムコントロール
- **イベント予約の詳細表示** - タイトルと説明文を含む詳細なスケジュール表示
- **動的フォーム生成** - 企業数に応じて自動的にフォームを生成
- **レスポンシブデザイン** - モバイル最適化されたUI

## 📝 必須入力項目

すべての項目が必須入力です：

- **各企業について**
  - 参加前の認知度（ラジオボタン）✓
  - 参加後の興味度（ラジオボタン）✓
  - 印象・感想（テキストエリア）✓
  - イベント予約（少なくとも1つ選択）✓

- **総合評価**
  - GDレベル（ラジオボタン）✓
  - イベント満足度（ラジオボタン）✓
  - フィードバック（テキストエリア）✓

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

### 2. イベント設定の変更

`config.js`ファイルを編集して、イベント情報を設定します：

```javascript
const EVENT_CONFIG = {
    // イベント基本情報
    eventId: "eid20250605",  // イベントIDを変更
    eventTitle: "夏季インターンシップ説明会",
    eventSubtitle: "本日はご参加いただきありがとうございました",
    
    // 参加企業リスト
    companies: [
        {
            id: "c01",
            name: "株式会社サンプル",
            description: "業界をリードする革新的な企業",
            color: "#FF6B6B", // 企業カラー（オプション）
            schedules: [
                {
                    datetime: "2025/06/10(月) 14:00～16:00",
                    title: "会社説明会",
                    description: "事業内容や社風について詳しくご説明します"
                },
                // スケジュールを追加...
            ]
        },
        // 企業を追加...
    ]
};
```

### 3. UIテストモード（デフォルト）

現在、LIFF機能とFirebase機能は**デフォルトで無効**になっています：

- `liff.js`の`ENABLE_LIFF = false`（LIFF機能無効）
- `index.js`の`ENABLE_FIREBASE = false`（Firebase機能無効）

この状態で：
- GitHub Pagesで通常のWebページとして動作
- フォーム送信時にデータはコンソールに出力
- 進捗バーとアニメーションが動作
- 必須項目のバリデーションが機能

### 4. 本番環境への設定

#### Firebase設定

`index.js`を編集：

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

#### LINE LIFF設定

`liff.js`を編集：

```javascript
// LIFF IDを更新
const liffId = 'YOUR-LIFF-ID-HERE';

// LIFF機能を有効化
const ENABLE_LIFF = true; // false → true に変更
```

### 5. GitHub Pages設定

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
      impression_text: "印象・感想テキスト",  // 必須
      schedule: [  // 最低1つ必須
        {
          datetime: "2025/03/18(火) 11:00～12:30",
          title: "会社説明会",
          description: "事業内容や社風について詳しくご説明します"
        }
      ]
    },
    // 他の企業データ...
  },
  
  // 総合評価
  gd_level: "うまくできたが、成長の余地があると感じた。",
  event_satisfaction: "とても満足だった。",
  event_feedback: "フィードバックテキスト",  // 必須
  
  // LINE情報（LIFF有効時）
  lineUserId: "LINE ユーザーID",
  lineDisplayName: "LINE 表示名",
  linePictureUrl: "LINE プロフィール画像URL",
  
  // タイムスタンプ
  submittedAt: Firestore.Timestamp,
  submittedAtLocal: "ISO形式の日時文字列"
}
```

## 🎨 カスタマイズガイド

### 企業の追加・削除

`config.js`の`companies`配列を編集：

```javascript
companies: [
    {
        id: "c05", // ユニークなID
        name: "新規企業株式会社",
        description: "企業の説明",
        color: "#E91E63", // オプション：企業カラー
        schedules: [
            // スケジュール情報
        ]
    }
]
```

### 質問文の変更

`config.js`の`questions`セクションを編集：

```javascript
questions: {
    before: {
        title: "【参加前】{company}についてご存知でしたか？",
        options: [
            "よく知っていた",
            "名前は聞いたことがある",
            "初めて知った"
        ]
    }
}
```

### UIカラーの変更

`index.css`でメインカラーを変更：

```css
:root {
    --primary-color: #06c755; /* LINEグリーン */
    --secondary-color: #05a948;
}
```

## 🐛 トラブルシューティング

### 企業が表示されない
- `config.js`の構文エラーを確認
- ブラウザのコンソールでエラーメッセージを確認

### 進捗バーが100%にならない
- すべての必須項目に入力されているか確認
- 各企業のイベント予約を最低1つ選択しているか確認
- テキストエリアが空でないか確認

### スケジュール選択のエラーメッセージ
- 各企業で少なくとも1つのイベントを選択する必要があります
- エラーメッセージは選択するまで表示され続けます

### 送信できない
- すべての必須項目（赤い * マーク）に入力されているか確認
- 進捗バーが100%になっているか確認

## 📝 運用フロー

1. **イベント準備**
   - `config.js`でイベントID、企業情報、スケジュールを設定
   - GitHubにプッシュ

2. **イベント当日**
   - 参加者にLIFFアプリのURLを共有
   - すべての必須項目の入力を促す

3. **イベント後**
   - Firestoreでデータを確認
   - 次回イベントのために`config.js`を更新

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
