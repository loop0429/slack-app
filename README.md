# ドッヂボール作戦会議
Slackを模倣したアプリケーションです。

## ライブラリ
- Next.js
  - TypeScript
- Supabase
- Mantine
- axios

## 設定方法
1. `yarn`でセットアップを行う
2. [Supabase](https://supabase.com/)で新規アカウント登録・新規プロジェクトを立ち上げる
3. SQL Editorの`Quick start`の項目にある、`Slack Clone`を実行  
usersテーブルに`avator_image`と`display_name`のカラムを追加。（どちらもtypeはtextで）
4. ルートディレクトリの`.env.example`を元に`.env.local`を作成し、Supabaseのプロジェクト作成時に表示された`Project URL`・`Project API keys`を`NEXT_PUBLIC_SUPABASE_URL`・`NEXT_PUBLIC_SUPABASE_KEY`に記述
5. `yarn dev`でアプリケーションを起動し、`アカウントを作成する`からアカウントを作成して開始
6. Supabaseの管理画面でusersテーブルに5.で作成したアカウントが追加されるので、必要に応じて`avator_image(画像url)`・`display_name(任意の文字列)`を設定  
※サンプルなので、その2箇所を設定するための画面・処理は作ってない  
※ちなみに設定しなくても問題ない

2023/03/12(sun)の勉強会で試したDatabase Webhookを試したい場合は、PDF(`public/supabase.pdf`)を参考にお試しください。  
※`.env`の`SLACK_WEBHOOK_URL`にSlackのWebhook Urlを記述。[この辺](https://zenn.dev/hotaka_noda/articles/4a6f0ccee73a18)を参考に。  
※SupabaseのHttp Requestに記述するURLにlocalhostは使えないので、Vercelなどにデプロイして`/api/hook`へ対象にしてください。
