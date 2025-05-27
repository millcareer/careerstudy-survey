// イベント設定ファイル
// このファイルを編集することで、イベントごとに企業やスケジュールを変更できます
const EVENT_CONFIG = {
    // イベント基本情報
    eventId: "eid20250529",
    eventTitle: "INTERN QUEST 終了後アンケート",
    eventSubtitle: "出欠確認も含めているので、必ず回答をお願いします！アンケート内容はイベント翌日にキャリスタアプリに反映され、ワーク３〜７に取り組めるようになります。※アンケートの提出が完了しないと、ワークが開放しません。",
    
    // 参加企業リスト
    companies: [
        {
            id: "c01",
            name: "ホーク・ワン",
            description: "IT×人材で新しい価値を創造する企業",
            color: "#FF6B6B", // 企業カラー（オプション）
        },
        {
            id: "c02",
            name: "アイスタイル",
            description: "@cosmeを運営する美容×ITのリーディングカンパニー",
            color: "#E91E63",
            schedules: [
                {
                    datetime: "2025/03/18(火) 11:00～12:30",
                    title: "ビジネスモデル説明会",
                    description: "@cosmeのビジネスモデルと今後の戦略について"
                },
                {
                    datetime: "2025/03/20(木) 15:00～16:30",
                    title: "エンジニア向け技術説明会",
                    description: "開発環境や技術スタックについて詳しく解説"
                },
                {
                    datetime: "2025/03/19(水) 16:00～17:30",
                    title: "マーケティング職説明会",
                    description: "データドリブンなマーケティング戦略について"
                },
                {
                    datetime: "2025/03/26(水) 16:00～17:30",
                    title: "オフィスツアー＆座談会",
                    description: "実際のオフィスを見学し、社員と直接話せる機会"
                },
                {
                    datetime: "日程が合わない",
                    title: "日程が合わない",
                    description: "現在提示されている日程では都合がつかない場合"
                }
            ]
        },
        {
            id: "c03",
            name: "ノバレーゼ",
            description: "感動を創造するブライダル企業",
            color: "#9C27B0",
            schedules: [
                {
                    datetime: "2025/03/18(火) 11:00～12:30",
                    title: "ブライダル業界研究セミナー",
                    description: "業界の現状と将来性について学べます"
                },
                {
                    datetime: "2025/03/20(木) 15:00～16:30",
                    title: "ウェディングプランナー体験",
                    description: "実際の仕事を体験できるワークショップ"
                },
                {
                    datetime: "2025/03/19(水) 16:00～17:30",
                    title: "式場見学ツアー",
                    description: "実際の結婚式場を見学できる貴重な機会"
                },
                {
                    datetime: "2025/03/26(水) 16:00～17:30",
                    title: "キャリアパス説明会",
                    description: "入社後のキャリア形成について詳しく説明"
                },
                {
                    datetime: "日程が合わない",
                    title: "日程が合わない",
                    description: "現在提示されている日程では都合がつかない場合"
                }
            ]
        },
        {
            id: "c04",
            name: "ACROVE",
            description: "DXで企業の成長を支援するコンサルティングファーム",
            color: "#00BCD4",
            schedules: [
                {
                    datetime: "",
                    title: "【早期本選考直結】27卒2daysサマーインターン",
                    description: "詳細はこちら：https://herp.careers/v1/acrove/-Q7ySqaIftzp"
                }
            ]
        }
    ],
    
    // 質問文のテンプレート（{company}は企業名に置換されます）
    questions: {
        before: {
            title: "【参加前】{company}を知っていましたか？",
            options: [
                "知っていて、興味があった。",
                "知っていた。",
                "知らなかった。"
            ]
        },
        after: {
            title: "【参加後】{company}についてどう思いましたか？",
            options: [
                "とても興味を持ったので、選考やISに参加したい。",
                "興味を持ったので、説明会に参加したい。",
                "あまり興味を持てなかった。"
            ]
        },
        impression: {
            title: "{company}についての印象・感想を教えてください",
            placeholder: "自由にご記入ください"
        },
        schedule: {
            title: "{company}のイベント予約",
            description: "参加を希望するイベントにチェックを入れてください（複数選択可）"
        }
    },
    
    // 総合評価の質問
    generalQuestions: {
        gd_level: {
            title: "今日を振り返って、現時点でのGDレベルを教えてください",
            options: [
                "かなりうまくいったと感じた。",
                "うまくできたが、成長の余地があると感じた。",
                "うまくいった部分もあったが、成長が必要だと感じた。",
                "まだまだ全体的に成長が必要だと感じた。"
            ]
        },
        event_satisfaction: {
            title: "イベントの運営・内容に関する満足度を教えてください",
            options: [
                "とても満足だった。",
                "満足だった。",
                "不満だった。",
                "とても不満だった。"
            ]
        },
        event_feedback: {
            title: "満足度の理由・感想・改善点を教えてください",
            placeholder: "今後のイベント改善のため、率直なご意見をお聞かせください"
        }
    }
};

// 設定を他のファイルで使用できるようにエクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EVENT_CONFIG;
}
