// AWS SDK v3のDynamoDB関連のモジュールをインポート
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
// DynamoDBのデータをJavaScriptオブジェクトから変換するためのユーティリティをインポート
const { marshall } = require("@aws-sdk/util-dynamodb");

// DynamoDBのクライアントを初期化。リージョンは "ap-northeast-1" に設定
const client = new DynamoDBClient({ region: "ap-northeast-1" });

// 使用するDynamoDBのテーブル名を定義
const TableName = "Article";

// Lambda関数のメインハンドラ
exports.handler = async (event, context) => {
  // デフォルトのレスポンスを設定
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // CORSの設定。すべてのオリジンからのアクセスを許可
    },
    body: JSON.stringify({ message: "" }),
  };

  // 認証のチェック。簡易的なトークン認証を実装
  if (event.headers.authorization !== "mtiToken") {
    response.statusCode = 401;
    response.body = JSON.stringify({
      message: "認証されていません。HeaderにTokenを指定してください",
    });

    return response;
  }

  // リクエストボディをパース
  const body = event.body ? JSON.parse(event.body) : null;

  // 必須のパラメータが存在するかチェック
  if (!body || !body.userId || !body.text) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message:
        "無効なリクエストです。request bodyに必須パラメータがセットされていません。",
    });

    return response;
  }

  // リクエストボディからパラメータを取得
  const { userId, text, category } = body;

  // 現在のタイムスタンプを取得
  const timestamp = Date.now();

  // DynamoDBへのPutItem操作のためのパラメータを設定
  const param = {
    TableName,
    Item: marshall({
      userId,
      text,
      category,
      timestamp,
    }),
  };

  // PutItemコマンドを作成
  const command = new PutItemCommand(param);

  try {
    // DynamoDBにデータを追加
    await client.send(command);
    response.statusCode = 201; // 成功した場合、201 Createdを返す
    response.body = JSON.stringify({ userId, text, category, timestamp });
  } catch (e) {
    // エラーが発生した場合の処理
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "予期せぬエラーが発生しました。",
      errorDetail: e.toString(),
    });
  }

  return response;
};


